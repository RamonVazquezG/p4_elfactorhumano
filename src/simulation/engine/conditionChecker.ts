import type { EndingType } from "@/types/endings";
import type { GameMetrics } from "@/types/metrics";
import { METRIC_MAX, METRIC_MIN, SIMULATION_TUNING } from "../state/initialMetrics";

/**
 * Evalúa las condiciones de victoria y derrota tras cada actualización del estado.
 *
 * Orden de prioridad cuando varias condiciones se cumplen a la vez:
 * 1. Salud Mental (el colapso físico es inmediato).
 * 2. Riesgo de Despido (RR. HH. actúa antes que cualquier auditoría).
 * 3. Integridad Ética.
 * 4. Supervivencia (solo si ninguna derrota aplica).
 *
 * @param metrics - Indicadores vigentes.
 * @param resolvedCount - Número de tickets resueltos hasta el momento.
 * @returns El tipo de final alcanzado o `null` si la partida continúa.
 */
export function evaluateEndCondition(
  metrics: GameMetrics,
  resolvedCount: number,
): EndingType | null {
  if (metrics.mentalHealth <= METRIC_MIN) return "BURNOUT";
  if (metrics.firingRisk >= METRIC_MAX) return "FIRED";
  if (metrics.ethicalIntegrity <= METRIC_MIN) return "CORRUPTION";
  if (resolvedCount >= SIMULATION_TUNING.ticketsToSurvive) return "SURVIVED";
  return null;
}
