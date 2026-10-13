import { getRemainingGraceMs, isTaskOverdue } from "@/simulation/engine/inactivityTimer";
import type { Task } from "@/types/tasks";
import { formatDuration, formatTicketNumber, URGENCY_META } from "../../shared/labels";

/**
 * Tarjeta compacta de tarea dentro de la columna "Tareas Pendientes".
 * Muestra urgencia, título, antigüedad y el estado de demora.
 */
interface TaskPreviewCardProps {
  task: Task;
  /** Reloj de la simulación (ms). */
  now: number;
  onOpen: (taskId: string) => void;
}

export function TaskPreviewCard({ task, now, onOpen }: TaskPreviewCardProps) {
  const overdue = isTaskOverdue(task, now);
  const remainingMs = getRemainingGraceMs(task, now);
  const urgency = URGENCY_META[task.urgency];

  return (
    <button
      type="button"
      onClick={() => onOpen(task.id)}
      className={`group w-full rounded-lg bg-white p-3 text-left shadow-sm ring-1 transition animate-card-enter hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        overdue ? "ring-red-400" : "ring-slate-200 hover:ring-slate-300"
      }`}
    >
      {/* Etiqueta de color de urgencia, al estilo Trello */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${urgency.className}`}
        >
          {urgency.label}
        </span>
        <span className="font-mono text-[11px] text-slate-400">
          {formatTicketNumber(task.ticketNumber)}
        </span>
      </div>

      <h4 className="text-sm font-semibold leading-snug text-slate-800 group-hover:text-indigo-700">
        {task.title}
      </h4>
      <p className="mt-1 truncate text-xs text-slate-500">{task.requester}</p>

      <footer className="mt-3 flex items-center justify-between text-[11px]">
        <span className="font-mono text-slate-400">⏱ {formatDuration(now - task.createdAt)}</span>
        {overdue ? (
          <span className="relative inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2 py-0.5 font-semibold text-white">
            <span className="absolute -left-0.5 -top-0.5 h-2.5 w-2.5 animate-ping rounded-full bg-red-400" />
            Demorado · +{task.accumulatedPenalty}% riesgo
          </span>
        ) : (
          <span className="font-mono text-slate-500">
            Penaliza en {Math.ceil(remainingMs / 1000)}s
          </span>
        )}
      </footer>
    </button>
  );
}
