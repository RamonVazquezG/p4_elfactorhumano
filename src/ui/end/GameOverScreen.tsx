import type { Ending } from "@/types/endings";
import type { GameStats } from "@/types/game";
import type { GameMetrics } from "@/types/metrics";
import type { ResolvedTask } from "@/types/tasks";
import { MetricsSummaryReport } from "./MetricsSummaryReport";

/**
 * Pantalla final: muestra el desenlace narrativo y las estadísticas de impacto.
 */
interface GameOverScreenProps {
  ending: Ending;
  metrics: GameMetrics;
  stats: GameStats;
  history: readonly ResolvedTask[];
  durationMs: number;
  onRestart: () => void;
}

export function GameOverScreen({
  ending,
  metrics,
  stats,
  history,
  durationMs,
  onRestart,
}: GameOverScreenProps) {
  // Precedentes reales únicos encontrados durante la partida.
  const precedents = Array.from(
    new Map(history.map((h) => [h.task.precedent.badge, h.task.precedent])).values(),
  );

  return (
    <main className="relative flex min-h-screen flex-1 justify-center overflow-hidden px-4 py-12">
      {/* Resplandor según el tipo de final */}
      <div
        className={`pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[48rem] -translate-x-1/2 rounded-full blur-3xl ${
          ending.isVictory ? "bg-emerald-700/20" : "bg-red-800/25"
        }`}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-3xl animate-slide-up">
        <header className="text-center">
          <span
            className={`inline-block rounded-full px-4 py-1 font-mono text-xs uppercase tracking-[0.25em] ${
              ending.isVictory
                ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border border-red-500/40 bg-red-500/10 text-red-300"
            }`}
          >
            {ending.trigger} · {ending.badge}
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            {ending.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            {ending.description}
          </p>
        </header>

        <div className="mt-10">
          <MetricsSummaryReport
            metrics={metrics}
            stats={stats}
            history={history}
            durationMs={durationMs}
          />
        </div>

        {/* Casos reales abordados durante la partida */}
        {precedents.length > 0 && (
          <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
              Casos reales detrás de tus tickets
            </h3>
            <ul className="space-y-3">
              {precedents.map((p) => (
                <li key={p.badge} className="text-sm leading-snug">
                  <span className="font-semibold text-indigo-300">{p.badge}:</span>{" "}
                  <span className="text-slate-400">{p.summary}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="rounded-xl bg-white px-8 py-3.5 font-bold text-slate-900 shadow-xl transition hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            Volver al menú principal
          </button>
        </div>
      </div>
    </main>
  );
}
