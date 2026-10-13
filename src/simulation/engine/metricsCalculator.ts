import type {
  GameMetrics,
  MetricExtremes,
  MetricImpact,
  MetricKey,
} from "@/types/metrics";
import { METRIC_MAX, METRIC_MIN } from "../state/initialMetrics";

/**
 * Restringe un valor al rango delimitado [0, 100].
 */
export function clampMetric(value: number): number {
  return Math.max(METRIC_MIN, Math.min(METRIC_MAX, value));
}

/**
 * Calcula el impacto de una decisión sobre los tres indicadores del jugador.
 * Asegura que los valores se mantengan dentro del rango delimitado [0, 100].
 *
 * @param currentMetrics - Objeto con los valores vigentes de salud, ética y riesgo.
 * @param impact - Modificadores resultantes de la opción elegida por el usuario.
 * @returns Las métricas normalizadas tras procesar la decisión.
 */
export function applyMetricImpact(
  currentMetrics: GameMetrics,
  impact: Partial<MetricImpact>,
): GameMetrics {
  return {
    mentalHealth: clampMetric(currentMetrics.mentalHealth + (impact.mentalHealth ?? 0)),
    ethicalIntegrity: clampMetric(
      currentMetrics.ethicalIntegrity + (impact.ethicalIntegrity ?? 0),
    ),
    firingRisk: clampMetric(currentMetrics.firingRisk + (impact.firingRisk ?? 0)),
  };
}

/**
 * Obtiene la diferencia efectiva entre dos estados de métricas.
 * Útil para registrar en el historial el impacto real tras el recorte a [0, 100].
 */
export function diffMetrics(before: GameMetrics, after: GameMetrics): MetricImpact {
  return {
    mentalHealth: after.mentalHealth - before.mentalHealth,
    ethicalIntegrity: after.ethicalIntegrity - before.ethicalIntegrity,
    firingRisk: after.firingRisk - before.firingRisk,
  };
}

/**
 * Actualiza los valores extremos registrados con el estado más reciente.
 */
export function updateExtremes(
  extremes: MetricExtremes,
  metrics: GameMetrics,
): MetricExtremes {
  return {
    lowestMentalHealth: Math.min(extremes.lowestMentalHealth, metrics.mentalHealth),
    lowestEthicalIntegrity: Math.min(
      extremes.lowestEthicalIntegrity,
      metrics.ethicalIntegrity,
    ),
    highestFiringRisk: Math.max(extremes.highestFiringRisk, metrics.firingRisk),
  };
}

/**
 * Determina si un delta es favorable para el jugador según el indicador.
 * En Riesgo de Despido, un aumento es negativo; en los demás, una disminución.
 */
export function isFavorableDelta(key: MetricKey, delta: number): boolean {
  return key === "firingRisk" ? delta < 0 : delta > 0;
}

/**
 * Clasifica el nivel de peligro de un indicador para su representación visual.
 */
export function getMetricDangerLevel(
  key: MetricKey,
  value: number,
): "safe" | "warning" | "danger" {
  // Para el riesgo, el peligro crece con el valor; para el resto, al disminuir.
  const severity = key === "firingRisk" ? value : METRIC_MAX - value;
  if (severity >= 75) return "danger";
  if (severity >= 45) return "warning";
  return "safe";
}
