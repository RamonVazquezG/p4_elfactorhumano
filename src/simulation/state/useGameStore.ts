import { create } from "zustand";
import type { GameState, GameStats } from "@/types/game";
import type { GameMetrics } from "@/types/metrics";
import type { DecisionStrategy, ResolvedTask, Task } from "@/types/tasks";
import { evaluateEndCondition } from "../engine/conditionChecker";
import { computeInactivityPenalty } from "../engine/inactivityTimer";
import {
  applyMetricImpact,
  diffMetrics,
  updateExtremes,
} from "../engine/metricsCalculator";
import {
  canEnqueue,
  createTask,
  getNextSpawnDelay,
  pickNextTemplate,
  rememberTemplate,
  type RandomFn,
} from "../engine/taskGenerator";
import { TASK_POOL } from "../data/taskPool";
import { INITIAL_METRICS, SIMULATION_TUNING } from "./initialMetrics";

/**
 * Almacén central de la simulación (Zustand).
 * Orquesta los módulos puros del motor; no contiene JSX ni lógica de presentación.
 */

/** Acciones disponibles para la capa de presentación. */
export interface GameActions {
  /** Cierra la introducción narrativa y muestra el menú principal. */
  acknowledgeIntro: () => void;
  /** Inicia una nueva partida en el tablero Kanban. */
  startSimulation: (now: number) => void;
  /** Avanza el reloj: penalizaciones, llegada de tareas y evaluación de finales. */
  tick: (now: number) => void;
  /** Abre el modal de decisión para una tarea. */
  openTask: (taskId: string) => void;
  /** Cierra el modal de decisión sin resolver. */
  closeTask: () => void;
  /** Resuelve una tarea con la estrategia elegida. */
  resolveTask: (taskId: string, strategy: DecisionStrategy, now: number) => void;
  /** Regresa al menú principal con el estado reiniciado. */
  returnToMenu: () => void;
}

export type GameStore = GameState & GameActions;

/** Crea las estadísticas vacías de una partida nueva. */
function createInitialStats(): GameStats {
  return {
    decisionsByStrategy: { sacrifice: 0, shortcut: 0, rebellion: 0 },
    totalInactivityPenalty: 0,
    extremes: {
      lowestMentalHealth: INITIAL_METRICS.mentalHealth,
      lowestEthicalIntegrity: INITIAL_METRICS.ethicalIntegrity,
      highestFiringRisk: INITIAL_METRICS.firingRisk,
    },
  };
}

/** Crea el estado inicial completo (determinista, apto para renderizado en servidor). */
export function createInitialState(): GameState {
  return {
    screen: "INTRO",
    metrics: { ...INITIAL_METRICS },
    queue: [],
    history: [],
    activeTaskId: null,
    ending: null,
    startedAt: null,
    clock: 0,
    nextSpawnAt: null,
    ticketSequence: 0,
    recentTemplateIds: [],
    stats: createInitialStats(),
  };
}

/**
 * Aplica la evaluación de finales sobre un estado parcial ya calculado.
 * Si se alcanza un final, cambia a la pantalla GAME_OVER y cierra el modal.
 */
function withEndEvaluation(
  next: Pick<GameState, "metrics" | "history"> & Partial<GameState>,
): Partial<GameState> {
  const ending = evaluateEndCondition(next.metrics, next.history.length);
  if (!ending) return next;
  return { ...next, ending, screen: "GAME_OVER", activeTaskId: null, nextSpawnAt: null };
}

/**
 * Crea el almacén. `rng` es inyectable para pruebas deterministas.
 * La aleatoriedad solo se invoca dentro de acciones (eventos y temporizadores),
 * nunca durante el renderizado.
 */
export function createGameStore(rng: RandomFn = Math.random) {
  return create<GameStore>()((set, get) => ({
    ...createInitialState(),

    acknowledgeIntro: () => {
      // Solo avanza si seguimos en la introducción.
      if (get().screen !== "INTRO") return;
      set({ screen: "MAIN_MENU" });
    },

    startSimulation: (now) => {
      set({
        ...createInitialState(),
        screen: "SIMULATION_DASHBOARD",
        startedAt: now,
        clock: now,
        nextSpawnAt: now + SIMULATION_TUNING.firstTaskDelayMs,
      });
    },

    tick: (now) => {
      const state = get();
      if (state.screen !== "SIMULATION_DASHBOARD" || state.startedAt === null) return;

      // 1. Penalización por inactividad sobre las tareas pendientes.
      const inactivity = computeInactivityPenalty(state.queue, now);
      let queue: Task[] = inactivity.queue;
      const metrics: GameMetrics =
        inactivity.penalty > 0
          ? applyMetricImpact(state.metrics, { firingRisk: inactivity.penalty })
          : state.metrics;

      // 2. Llegada procedural de nuevas tareas.
      let { nextSpawnAt, ticketSequence, recentTemplateIds } = state;
      if (nextSpawnAt !== null && now >= nextSpawnAt) {
        if (canEnqueue(queue.length)) {
          const template = pickNextTemplate(
            TASK_POOL,
            recentTemplateIds,
            queue.map((t) => t.templateId),
            rng,
          );
          ticketSequence += 1;
          queue = [...queue, createTask(template, ticketSequence, now)];
          recentTemplateIds = rememberTemplate(recentTemplateIds, template.templateId);
        }
        nextSpawnAt = now + getNextSpawnDelay(now - state.startedAt, rng);
      }

      set(
        withEndEvaluation({
          clock: now,
          queue,
          metrics,
          history: state.history,
          nextSpawnAt,
          ticketSequence,
          recentTemplateIds,
          stats: {
            ...state.stats,
            totalInactivityPenalty: state.stats.totalInactivityPenalty + inactivity.penalty,
            extremes: updateExtremes(state.stats.extremes, metrics),
          },
        }),
      );
    },

    openTask: (taskId) => {
      const state = get();
      if (state.screen !== "SIMULATION_DASHBOARD") return;
      if (!state.queue.some((t) => t.id === taskId)) return;
      set({ activeTaskId: taskId });
    },

    closeTask: () => set({ activeTaskId: null }),

    resolveTask: (taskId, strategy, now) => {
      const state = get();
      if (state.screen !== "SIMULATION_DASHBOARD") return;
      const task = state.queue.find((t) => t.id === taskId);
      if (!task) return;
      const option = task.options.find((o) => o.strategy === strategy);
      if (!option) return;

      // Aplica el impacto y registra el delta efectivo (tras el recorte a [0, 100]).
      const metrics = applyMetricImpact(state.metrics, option.impact);
      const resolved: ResolvedTask = {
        task,
        chosenOption: option,
        appliedImpact: diffMetrics(state.metrics, metrics),
        resolvedAt: now,
        responseTimeMs: now - task.createdAt,
      };
      const queue = state.queue.filter((t) => t.id !== taskId);
      const history = [resolved, ...state.history];

      // Si la cola queda vacía, adelanta la llegada de la siguiente tarea.
      const emptySpawnAt = now + SIMULATION_TUNING.emptyQueueSpawnDelayMs;
      const nextSpawnAt =
        queue.length === 0 && state.nextSpawnAt !== null
          ? Math.min(state.nextSpawnAt, emptySpawnAt)
          : state.nextSpawnAt;

      set(
        withEndEvaluation({
          clock: now,
          metrics,
          queue,
          history,
          activeTaskId: null,
          nextSpawnAt,
          stats: {
            ...state.stats,
            decisionsByStrategy: {
              ...state.stats.decisionsByStrategy,
              [strategy]: state.stats.decisionsByStrategy[strategy] + 1,
            },
            extremes: updateExtremes(state.stats.extremes, metrics),
          },
        }),
      );
    },

    returnToMenu: () => {
      set({ ...createInitialState(), screen: "MAIN_MENU" });
    },
  }));
}

/** Instancia única del almacén usada por la aplicación. */
export const useGameStore = createGameStore();

/** Selector: tarea actualmente abierta en el modal (o `null`). */
export function selectActiveTask(state: GameState): Task | null {
  return state.queue.find((t) => t.id === state.activeTaskId) ?? null;
}
