import type { Task } from "@/types/tasks";
import { SIMULATION_TUNING } from "../state/initialMetrics";

/**
 * Lógica de penalización por inactividad.
 * Cada tarea pendiente, tras su periodo de gracia, incrementa el Riesgo de Despido
 * en una tasa fija por cada intervalo completo de demora.
 */

/** Resultado de evaluar la inactividad en un instante dado. */
export interface InactivityResult {
  /** Penalización total de Riesgo de Despido a aplicar en este tick. */
  penalty: number;
  /** Cola actualizada con las marcas de penalización avanzadas. */
  queue: Task[];
}

/**
 * Devuelve el instante (ms) a partir del cual la tarea empieza a penalizar.
 */
export function getTaskDeadline(task: Task): number {
  return task.createdAt + SIMULATION_TUNING.gracePeriodMsByUrgency[task.urgency];
}

/**
 * Indica si una tarea ya superó su periodo de gracia.
 */
export function isTaskOverdue(task: Task, now: number): boolean {
  return now >= getTaskDeadline(task);
}

/**
 * Milisegundos restantes antes de que la tarea empiece a penalizar (mínimo 0).
 */
export function getRemainingGraceMs(task: Task, now: number): number {
  return Math.max(0, getTaskDeadline(task) - now);
}

/**
 * Evalúa la cola completa y calcula la penalización acumulada desde el último cobro.
 * Es idempotente respecto a llamadas frecuentes: solo cobra intervalos completos.
 *
 * @param queue - Tareas pendientes.
 * @param now - Instante actual (ms).
 */
export function computeInactivityPenalty(queue: readonly Task[], now: number): InactivityResult {
  const { inactivityIntervalMs, inactivityPenaltyPerInterval } = SIMULATION_TUNING;
  let penalty = 0;
  let changed = false;

  const nextQueue = queue.map((task) => {
    const deadline = getTaskDeadline(task);
    if (now < deadline) return task;

    // El cobro arranca desde la fecha límite o desde el último cobro, lo que sea mayor.
    const from = Math.max(task.lastPenaltyAt, deadline);
    const intervals = Math.floor((now - from) / inactivityIntervalMs);
    if (intervals <= 0) {
      // Asegura que la marca quede alineada con la fecha límite.
      if (task.lastPenaltyAt < deadline) {
        changed = true;
        return { ...task, lastPenaltyAt: deadline };
      }
      return task;
    }

    const taskPenalty = intervals * inactivityPenaltyPerInterval;
    penalty += taskPenalty;
    changed = true;
    return {
      ...task,
      lastPenaltyAt: from + intervals * inactivityIntervalMs,
      accumulatedPenalty: task.accumulatedPenalty + taskPenalty,
    };
  });

  return { penalty, queue: changed ? nextQueue : (queue as Task[]) };
}

/**
 * Crea el reloj periódico que impulsa la simulación.
 * Devuelve una función para detenerlo.
 *
 * @param onTick - Callback que recibe el instante actual en ms.
 * @param intervalMs - Periodo del reloj.
 */
export function startSimulationClock(
  onTick: (now: number) => void,
  intervalMs: number = SIMULATION_TUNING.tickIntervalMs,
): () => void {
  const handle = setInterval(() => onTick(Date.now()), intervalMs);
  return () => clearInterval(handle);
}
