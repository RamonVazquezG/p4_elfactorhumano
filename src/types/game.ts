import type { EndingType } from "./endings";
import type { GameMetrics, MetricExtremes } from "./metrics";
import type { DecisionStrategy, ResolvedTask, Task } from "./tasks";

/**
 * Contratos globales del estado de juego.
 */

/** Pantallas de la máquina de estados secuencial. */
export type GameScreen =
  | "INTRO"
  | "MAIN_MENU"
  | "SIMULATION_DASHBOARD"
  | "GAME_OVER";

/** Estadísticas agregadas para el reporte final. */
export interface GameStats {
  /** Conteo de decisiones por estrategia. */
  decisionsByStrategy: Record<DecisionStrategy, number>;
  /** Riesgo de Despido total acumulado por inactividad. */
  totalInactivityPenalty: number;
  /** Extremos de cada indicador durante la partida. */
  extremes: MetricExtremes;
}

/** Estado serializable completo de la simulación. */
export interface GameState {
  screen: GameScreen;
  metrics: GameMetrics;
  /** Tareas pendientes (columna 2). */
  queue: Task[];
  /** Tareas resueltas, la más reciente primero (columna 3). */
  history: ResolvedTask[];
  /** Tarea abierta en el modal de decisión. */
  activeTaskId: string | null;
  /** Final alcanzado (solo en GAME_OVER). */
  ending: EndingType | null;
  /** Inicio de la simulación (ms). */
  startedAt: number | null;
  /** Último instante procesado por el reloj (ms). Fuente de verdad para la UI. */
  clock: number;
  /** Momento programado para la llegada de la siguiente tarea (ms). */
  nextSpawnAt: number | null;
  /** Contador secuencial de tickets generados. */
  ticketSequence: number;
  /** Plantillas usadas recientemente, para evitar repeticiones. */
  recentTemplateIds: string[];
  stats: GameStats;
}
