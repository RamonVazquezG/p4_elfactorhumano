import type { ResolvedTask } from "@/types/tasks";
import { formatDuration, formatTicketNumber, STRATEGY_META } from "../../shared/labels";
import { ImpactChips } from "./ImpactChips";

/**
 * Resumen de solo lectura de una tarea resuelta para la columna de historial.
 */
interface ResolvedTaskCardProps {
  entry: ResolvedTask;
}

export function ResolvedTaskCard({ entry }: ResolvedTaskCardProps) {
  const { task, chosenOption, appliedImpact, responseTimeMs } = entry;
  const strategy = STRATEGY_META[chosenOption.strategy];

  return (
    <article className="rounded-lg bg-white/95 p-3 shadow-sm ring-1 ring-slate-200 animate-card-enter">
      <header className="mb-1.5 flex items-center justify-between gap-2">
        <span
          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${strategy.className}`}
        >
          {strategy.shortLabel}
        </span>
        <span className="font-mono text-[11px] text-slate-400">
          {formatTicketNumber(task.ticketNumber)} · {formatDuration(responseTimeMs)}
        </span>
      </header>

      <h4 className="text-sm font-semibold leading-snug text-slate-700 line-through decoration-slate-300">
        {task.title}
      </h4>
      <p className="mt-1 text-xs font-medium text-slate-600">→ {chosenOption.label}</p>
      <p className="mt-1 text-xs italic leading-snug text-slate-500">{chosenOption.feedback}</p>

      <div className="mt-2">
        <ImpactChips impact={appliedImpact} />
      </div>

      {/* Distintivo del precedente real */}
      <p
        className="mt-2 inline-block rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500"
        title={task.precedent.summary}
      >
        📰 Precedente: {task.precedent.badge}
      </p>
    </article>
  );
}
