import type { ResolvedTask } from "@/types/tasks";
import { ResolvedTaskCard } from "../cards/ResolvedTaskCard";
import { ColumnShell } from "./ColumnShell";

/**
 * Columna 3: Historial de Resoluciones (inmutable, más reciente primero).
 */
interface TaskHistoryColumnProps {
  history: readonly ResolvedTask[];
}

export function TaskHistoryColumn({ history }: TaskHistoryColumnProps) {
  return (
    <ColumnShell
      title="Historial de Resoluciones"
      badge={
        <span className="rounded-full bg-slate-300 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
          {history.length}
        </span>
      }
    >
      {history.length === 0 ? (
        <p className="rounded-lg border-2 border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
          Aún no has resuelto ningún ticket.
        </p>
      ) : (
        history.map((entry) => <ResolvedTaskCard key={entry.task.id} entry={entry} />)
      )}
    </ColumnShell>
  );
}
