import type { GameStats } from "@/types/game";
import type { GameMetrics } from "@/types/metrics";
import type { DecisionStrategy, ResolvedTask } from "@/types/tasks";
import { formatDuration, STRATEGY_META } from "../shared/labels";

/**
 * Desglose final de los costos humanos y éticos de la partida.
 */
interface MetricsSummaryReportProps {
  metrics: GameMetrics;
  stats: GameStats;
  history: readonly ResolvedTask[];
  durationMs: number;
}

/** Fila individual de estadística. */
function StatRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-800 py-2 last:border-0">
      <span className="text-sm text-slate-400">
        {label}
        {hint && <span className="ml-1 text-xs text-slate-600">({hint})</span>}
      </span>
      <span className="font-mono text-sm font-semibold tabular-nums text-slate-100">{value}</span>
    </div>
  );
}

export function MetricsSummaryReport({
  metrics,
  stats,
  history,
  durationMs,
}: MetricsSummaryReportProps) {
  const totalDecisions = history.length;
  const avgResponseMs =
    totalDecisions > 0
      ? history.reduce((sum, h) => sum + h.responseTimeMs, 0) / totalDecisions
      : 0;
  const strategies: DecisionStrategy[] = ["sacrifice", "shortcut", "rebellion"];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Indicadores finales y extremos */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
          Costo humano
        </h3>
        <StatRow
          label="Salud Mental final"
          value={`${Math.round(metrics.mentalHealth)}%`}
          hint={`mín. ${Math.round(stats.extremes.lowestMentalHealth)}%`}
        />
        <StatRow
          label="Integridad Ética final"
          value={`${Math.round(metrics.ethicalIntegrity)}%`}
          hint={`mín. ${Math.round(stats.extremes.lowestEthicalIntegrity)}%`}
        />
        <StatRow
          label="Riesgo de Despido final"
          value={`${Math.round(metrics.firingRisk)}%`}
          hint={`máx. ${Math.round(stats.extremes.highestFiringRisk)}%`}
        />
        <StatRow
          label="Riesgo por demoras"
          value={`+${stats.totalInactivityPenalty}%`}
        />
      </section>

      {/* Patrón de decisiones */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
          Patrón de decisiones
        </h3>
        <StatRow label="Duración del turno" value={formatDuration(durationMs)} />
        <StatRow label="Tickets resueltos" value={String(totalDecisions)} />
        <StatRow label="Tiempo medio de respuesta" value={formatDuration(avgResponseMs)} />

        {/* Distribución por estrategia */}
        <div className="mt-4 space-y-2">
          {strategies.map((s) => {
            const count = stats.decisionsByStrategy[s];
            const pct = totalDecisions > 0 ? (count / totalDecisions) * 100 : 0;
            return (
              <div key={s}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-300">{STRATEGY_META[s].label}</span>
                  <span className="font-mono text-slate-400">
                    {count} · {Math.round(pct)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      s === "sacrifice"
                        ? "bg-sky-400"
                        : s === "shortcut"
                          ? "bg-amber-400"
                          : "bg-rose-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
