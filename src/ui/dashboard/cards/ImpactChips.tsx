import { isFavorableDelta } from "@/simulation/engine/metricsCalculator";
import type { MetricImpact } from "@/types/metrics";
import { formatSignedPercent, METRIC_ORDER, METRIC_SHORT_LABELS } from "../../shared/labels";

/**
 * Chips compactos que muestran el impacto exacto sobre cada indicador.
 * Omite los indicadores sin cambio.
 */
interface ImpactChipsProps {
  impact: MetricImpact;
}

export function ImpactChips({ impact }: ImpactChipsProps) {
  const entries = METRIC_ORDER.filter((key) => Math.round(impact[key]) !== 0);

  if (entries.length === 0) {
    return <span className="text-xs text-slate-400">Sin impacto</span>;
  }

  return (
    <ul className="flex flex-wrap gap-1.5">
      {entries.map((key) => {
        const delta = impact[key];
        const good = isFavorableDelta(key, delta);
        return (
          <li
            key={key}
            className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
              good ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}
          >
            {formatSignedPercent(delta)} {METRIC_SHORT_LABELS[key]}
          </li>
        );
      })}
    </ul>
  );
}
