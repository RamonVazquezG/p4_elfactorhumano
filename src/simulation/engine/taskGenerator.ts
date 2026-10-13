import type { Task, TaskTemplate } from "@/types/tasks";
import { SIMULATION_TUNING } from "../state/initialMetrics";

/**
 * Generador procedural de tareas y administrador del backlog.
 * Lógica pura: la aleatoriedad se inyecta mediante `rng` para facilitar pruebas.
 */

/** Función generadora de números aleatorios en [0, 1). */
export type RandomFn = () => number;

/**
 * Interpola linealmente entre dos valores.
 */
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Calcula el progreso de dificultad (0 a 1) según el tiempo transcurrido.
 */
export function getDifficultyProgress(elapsedMs: number): number {
  return Math.max(0, Math.min(1, elapsedMs / SIMULATION_TUNING.difficultyRampMs));
}

/**
 * Calcula el retraso aleatorio hasta la llegada de la siguiente tarea.
 * El intervalo se acorta progresivamente a medida que avanza la partida.
 *
 * @param elapsedMs - Tiempo transcurrido desde el inicio de la simulación.
 * @param rng - Generador aleatorio.
 */
export function getNextSpawnDelay(elapsedMs: number, rng: RandomFn): number {
  const t = getDifficultyProgress(elapsedMs);
  const { spawnDelayStartMs: start, spawnDelayEndMs: end } = SIMULATION_TUNING;
  const min = lerp(start.min, end.min, t);
  const max = lerp(start.max, end.max, t);
  return Math.round(min + rng() * (max - min));
}

/**
 * Selecciona la siguiente plantilla evitando repetir las usadas recientemente.
 * Si todas fueron usadas recientemente, se elige de todo el pool.
 */
export function pickNextTemplate(
  pool: readonly TaskTemplate[],
  recentTemplateIds: readonly string[],
  activeTemplateIds: readonly string[],
  rng: RandomFn,
): TaskTemplate {
  const excluded = new Set([...recentTemplateIds, ...activeTemplateIds]);
  const candidates = pool.filter((t) => !excluded.has(t.templateId));
  const source = candidates.length > 0 ? candidates : pool;
  return source[Math.floor(rng() * source.length)];
}

/**
 * Crea una instancia viva de tarea a partir de una plantilla.
 */
export function createTask(
  template: TaskTemplate,
  ticketNumber: number,
  now: number,
): Task {
  return {
    ...template,
    id: `${template.templateId}-${ticketNumber}`,
    ticketNumber,
    createdAt: now,
    lastPenaltyAt: now,
    accumulatedPenalty: 0,
  };
}

/**
 * Registra una plantilla en la memoria de recientes, respetando el tamaño máximo.
 */
export function rememberTemplate(
  recentTemplateIds: readonly string[],
  templateId: string,
): string[] {
  return [templateId, ...recentTemplateIds].slice(
    0,
    SIMULATION_TUNING.recentTemplateMemory,
  );
}

/**
 * Indica si la cola admite una nueva tarea.
 */
export function canEnqueue(queueLength: number): boolean {
  return queueLength < SIMULATION_TUNING.maxQueueSize;
}
