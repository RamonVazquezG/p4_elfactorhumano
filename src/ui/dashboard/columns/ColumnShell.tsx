import type { ReactNode } from "react";

/**
 * Contenedor genérico de columna estilo Trello (encabezado + lista desplazable).
 */
interface ColumnShellProps {
  title: string;
  /** Contador o insignia mostrada a la derecha del título. */
  badge?: ReactNode;
  children: ReactNode;
}

export function ColumnShell({ title, badge, children }: ColumnShellProps) {
  return (
    <section className="flex min-h-0 flex-col rounded-xl bg-slate-100/95 shadow-lg shadow-black/20 ring-1 ring-white/10">
      <header className="flex items-center justify-between px-4 pb-2 pt-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">{title}</h2>
        {badge}
      </header>
      <div className="kanban-scroll flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-3 pb-3">
        {children}
      </div>
    </section>
  );
}
