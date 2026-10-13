"use client";

import { useEffect, useRef } from "react";
import { getRemainingGraceMs, isTaskOverdue } from "@/simulation/engine/inactivityTimer";
import type { DecisionStrategy, Task } from "@/types/tasks";
import { formatTicketNumber, STRATEGY_META, URGENCY_META } from "../../shared/labels";

/**
 * Vista detallada de una tarea con sus tres opciones de decisión.
 * Atajos: teclas 1, 2 y 3 eligen opción; Escape cierra.
 */
interface TaskDecisionModalProps {
  task: Task;
  now: number;
  onResolve: (strategy: DecisionStrategy) => void;
  onClose: () => void;
}

/** Estilos de cada botón de opción según la estrategia. */
const OPTION_STYLES: Record<DecisionStrategy, string> = {
  sacrifice: "hover:border-sky-400 hover:bg-sky-50 focus-visible:ring-sky-400",
  shortcut: "hover:border-amber-400 hover:bg-amber-50 focus-visible:ring-amber-400",
  rebellion: "hover:border-rose-400 hover:bg-rose-50 focus-visible:ring-rose-400",
};

export function TaskDecisionModal({ task, now, onResolve, onClose }: TaskDecisionModalProps) {
  const overdue = isTaskOverdue(task, now);
  const remainingSeconds = Math.ceil(getRemainingGraceMs(task, now) / 1000);
  const urgency = URGENCY_META[task.urgency];
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  // Guarda los callbacks más recientes para el listener de teclado.
  const handlersRef = useRef({ onResolve, onClose, task });
  useEffect(() => {
    handlersRef.current = { onResolve, onClose, task };
  });

  // Enfoca la primera opción y registra los atajos de teclado.
  useEffect(() => {
    firstButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      const { onResolve: resolve, onClose: close, task: t } = handlersRef.current;
      if (e.key === "Escape") {
        close();
        return;
      }
      const index = ["1", "2", "3"].indexOf(e.key);
      if (index >= 0) resolve(t.options[index].strategy);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="kanban-scroll max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white text-slate-800 shadow-2xl animate-slide-up"
      >
        {/* Encabezado del ticket */}
        <header className="border-b border-slate-200 px-6 pb-4 pt-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${urgency.className}`}
            >
              Urgencia {urgency.label}
            </span>
            <span className="font-mono text-xs text-slate-400">
              {formatTicketNumber(task.ticketNumber)}
            </span>
            <span className="text-xs text-slate-500">· {task.requester}</span>
            <span
              className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                overdue ? "animate-pulse bg-red-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {overdue
                ? `Demorado · +${task.accumulatedPenalty}% riesgo`
                : `Penaliza en ${remainingSeconds}s`}
            </span>
          </div>
          <h2 id="task-modal-title" className="text-xl font-bold leading-tight text-slate-900">
            {task.title}
          </h2>
          <p className="mt-2 leading-relaxed text-slate-600">{task.description}</p>
        </header>

        {/* Precedente real */}
        <aside className="mx-6 mt-4 rounded-lg border-l-4 border-indigo-400 bg-indigo-50 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">
            📰 Caso real · {task.precedent.badge}
          </p>
          <p className="mt-1 text-sm leading-snug text-indigo-900/80">{task.precedent.summary}</p>
        </aside>

        {/* Opciones */}
        <div className="space-y-3 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            ¿Qué decides?
          </p>
          {task.options.map((option, i) => {
            const meta = STRATEGY_META[option.strategy];
            return (
              <button
                key={option.strategy}
                ref={i === 0 ? firstButtonRef : undefined}
                type="button"
                onClick={() => onResolve(option.strategy)}
                className={`flex w-full items-start gap-4 rounded-lg border-2 border-slate-200 p-4 text-left transition focus:outline-none focus-visible:ring-2 active:scale-[0.99] ${
                  OPTION_STYLES[option.strategy]
                }`}
              >
                <kbd className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-slate-50 font-mono text-sm font-bold text-slate-600">
                  {i + 1}
                </kbd>
                <span className="flex-1">
                  <span
                    className={`mb-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${meta.className}`}
                  >
                    {meta.label}
                  </span>
                  <span className="block font-semibold text-slate-900">{option.label}</span>
                  <span className="mt-0.5 block text-sm text-slate-600">{option.description}</span>
                </span>
              </button>
            );
          })}
        </div>

        <footer className="flex items-center justify-between border-t border-slate-200 px-6 py-3">
          <span className="text-xs text-slate-400">Atajos: 1 · 2 · 3 · Esc</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Volver al tablero
          </button>
        </footer>
      </div>
    </div>
  );
}
