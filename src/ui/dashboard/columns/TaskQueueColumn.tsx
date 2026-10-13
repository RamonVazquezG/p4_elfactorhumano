import { isTaskOverdue } from "@/simulation/engine/inactivityTimer";
import type { Task } from "@/types/tasks";
import { TaskPreviewCard } from "../cards/TaskPreviewCard";
import { ColumnShell } from "./ColumnShell";

/**
 * Columna 2: Tareas Pendientes que llegan en tiempo real.
 */
interface TaskQueueColumnProps {
  tasks: readonly Task[];
  now: number;
  maxQueueSize: number;
  onOpenTask: (taskId: string) => void;
}

export function TaskQueueColumn({ tasks, now, maxQueueSize, onOpenTask }: TaskQueueColumnProps) {
  const overdueCount = tasks.filter((t) => isTaskOverdue(t, now)).length;

  return (
    <ColumnShell
      title="Tareas Pendientes"
      badge={
        <div className="flex items-center gap-2">
          {overdueCount > 0 && (
            <span className="animate-pulse rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white">
              {overdueCount} demorada{overdueCount === 1 ? "" : "s"}
            </span>
          )}
          <span className="rounded-full bg-slate-300 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
            {tasks.length}/{maxQueueSize}
          </span>
        </div>
      }
    >
      {tasks.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
          <span className="text-2xl" aria-hidden>
            📭
          </span>
          Bandeja vacía… por ahora.
        </div>
      ) : (
        tasks.map((task) => (
          <TaskPreviewCard key={task.id} task={task} now={now} onOpen={onOpenTask} />
        ))
      )}
    </ColumnShell>
  );
}
