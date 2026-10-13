import type { MetricKey } from "@/types/metrics";
import type { DecisionStrategy, TaskUrgency } from "@/types/tasks";

/**
 * Etiquetas y formateadores de presentación compartidos (textos en español).
 */

/** Nombre y estilo de cada estrategia de decisión. */
export const STRATEGY_META: Record<
  DecisionStrategy,
  { label: string; shortLabel: string; className: string }
> = {
  sacrifice: {
    label: "Sacrificio Personal",
    shortLabel: "Sacrificio",
    className: "bg-sky-100 text-sky-800 ring-sky-300",
  },
  shortcut: {
    label: "Delegación Tóxica / Atajo",
    shortLabel: "Atajo",
    className: "bg-amber-100 text-amber-800 ring-amber-300",
  },
  rebellion: {
    label: "Rebeldía / Confrontación",
    shortLabel: "Rebeldía",
    className: "bg-rose-100 text-rose-800 ring-rose-300",
  },
};

/** Etiqueta y estilo de cada nivel de urgencia. */
export const URGENCY_META: Record<TaskUrgency, { label: string; className: string }> = {
  low: { label: "Baja", className: "bg-emerald-500" },
  medium: { label: "Media", className: "bg-yellow-500" },
  high: { label: "Alta", className: "bg-orange-500" },
  critical: { label: "Crítica", className: "bg-red-600" },
};

/** Etiquetas cortas de los indicadores para chips de impacto. */
export const METRIC_SHORT_LABELS: Record<MetricKey, string> = {
  mentalHealth: "Salud Mental",
  ethicalIntegrity: "Integridad Ética",
  firingRisk: "Riesgo de Despido",
};

/** Orden canónico de los indicadores en la interfaz. */
export const METRIC_ORDER: readonly MetricKey[] = [
  "mentalHealth",
  "ethicalIntegrity",
  "firingRisk",
];

/** Formatea milisegundos como mm:ss. */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** Formatea un delta con signo explícito y símbolo de porcentaje. */
export function formatSignedPercent(value: number): string {
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

/** Formatea el número de ticket con ceros a la izquierda. */
export function formatTicketNumber(n: number): string {
  return `#${String(n).padStart(4, "0")}`;
}
