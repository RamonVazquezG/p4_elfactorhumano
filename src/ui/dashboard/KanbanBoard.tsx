import type { GameMetrics, MetricDefinition } from "@/types/metrics";
import type { DecisionStrategy, ResolvedTask, Task } from "@/types/tasks";
import { formatDuration } from "../shared/labels";
import { MetricsColumn } from "./columns/MetricsColumn";
import { TaskHistoryColumn } from "./columns/TaskHistoryColumn";
import { TaskQueueColumn } from "./columns/TaskQueueColumn";
import { TaskDecisionModal } from "./modals/TaskDecisionModal";

/**
 * Tablero Kanban principal: barra superior + 3 columnas + modal de decisión.
 * Componente puramente presentacional; recibe todo por props.
 */
interface KanbanBoardProps {
  metrics: GameMetrics;
  metricDefinitions: readonly MetricDefinition[];
  queue: readonly Task[];
  history: readonly ResolvedTask[];
  activeTask: Task | null;
  /** Reloj de la simulación (ms). */
  now: number;
  /** Tiempo transcurrido del turno (ms). */
  elapsedMs: number;
  ticketsToSurvive: number;
  maxQueueSize: number;
  onOpenTask: (taskId: string) => void;
  onCloseTask: () => void;
  onResolveTask: (taskId: string, strategy: DecisionStrategy) => void;
}

export function KanbanBoard({
  metrics,
  metricDefinitions,
  queue,
  history,
  activeTask,
  now,
  elapsedMs,
  ticketsToSurvive,
  maxQueueSize,
  onOpenTask,
  onCloseTask,
  onResolveTask,
}: KanbanBoardProps) {
  const progress = Math.min(100, (history.length / ticketsToSurvive) * 100);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-indigo-900 via-[#1e2a5a] to-slate-900">
      {/* Barra superior del espacio de trabajo */}
      <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-white/10 bg-black/25 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/15 text-sm font-black text-white">
            LO
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Transición Offshore · Plataforma Núcleo</h1>
            <p className="text-xs text-indigo-200/70">Tablero de la Oficina de Transformación Digital</p>
          </div>
        </div>

        {/* Progreso hacia la supervivencia */}
        <div className="flex min-w-[200px] flex-1 items-center gap-3 sm:max-w-sm">
          <span className="whitespace-nowrap text-xs font-medium text-indigo-100">
            Transferencia {history.length}/{ticketsToSurvive}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 rounded-md bg-black/30 px-3 py-1.5 font-mono text-sm text-indigo-100">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" aria-hidden />
          Turno {formatDuration(elapsedMs)}
        </div>
      </header>

      {/* Tres columnas */}
      <main className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 md:grid-cols-[minmax(260px,1fr)_minmax(300px,1.2fr)_minmax(280px,1.1fr)] md:overflow-hidden">
        <MetricsColumn metrics={metrics} definitions={metricDefinitions} />
        <TaskQueueColumn
          tasks={queue}
          now={now}
          maxQueueSize={maxQueueSize}
          onOpenTask={onOpenTask}
        />
        <TaskHistoryColumn history={history} />
      </main>

      {activeTask && (
        <TaskDecisionModal
          key={activeTask.id}
          task={activeTask}
          now={now}
          onClose={onCloseTask}
          onResolve={(strategy) => onResolveTask(activeTask.id, strategy)}
        />
      )}
    </div>
  );
}
