import { getMetricDangerLevel } from "@/simulation/engine/metricsCalculator";
import type { MetricDefinition } from "@/types/metrics";

/**
 * Tarjeta individual de indicador con barra de progreso animada.
 */
interface MetricCardProps {
  definition: MetricDefinition;
  value: number;
}

/** Colores de la barra según el nivel de peligro. */
const DANGER_STYLES = {
  safe: { bar: "bg-emerald-500", text: "text-emerald-700", ring: "ring-slate-200" },
  warning: { bar: "bg-amber-500", text: "text-amber-700", ring: "ring-amber-300" },
  danger: { bar: "bg-red-600", text: "text-red-700", ring: "ring-red-400" },
} as const;

/** Icono decorativo por indicador. */
const METRIC_ICONS = {
  mentalHealth: "🧠",
  ethicalIntegrity: "⚖️",
  firingRisk: "🔥",
} as const;

export function MetricCard({ definition, value }: MetricCardProps) {
  const level = getMetricDangerLevel(definition.key, value);
  const styles = DANGER_STYLES[level];
  const rounded = Math.round(value);

  return (
    <article
      className={`rounded-lg bg-white p-4 shadow-sm ring-1 transition-shadow ${styles.ring} ${
        level === "danger" ? "shadow-red-200" : ""
      }`}
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <span aria-hidden>{METRIC_ICONS[definition.key]}</span>
          {definition.label}
        </h3>
        <span
          className={`font-mono text-lg font-bold tabular-nums ${styles.text} ${
            level === "danger" ? "animate-pulse" : ""
          }`}
        >
          {rounded}%
        </span>
      </header>

      {/* Barra de progreso con transición suave */}
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-label={definition.label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${styles.bar}`}
          style={{ width: `${value}%` }}
        />
      </div>

      <p className="mt-2 text-xs leading-snug text-slate-500">{definition.description}</p>
    </article>
  );
}
