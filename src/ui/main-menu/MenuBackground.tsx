/**
 * Fondo decorativo del menú principal: cuadrícula tenue y tickets flotantes.
 * Totalmente estático (sin aleatoriedad) para un renderizado determinista.
 */

/** Fragmentos de tickets decorativos con posiciones fijas. */
const FLOATING_TICKETS = [
  { text: "KT-0412 · Transferencia de conocimiento", className: "left-[6%] top-[12%] -rotate-6" },
  { text: "INC-2201 · Producción caída", className: "right-[8%] top-[18%] rotate-3" },
  { text: "PR #1187 · elimina pruebas", className: "left-[10%] bottom-[18%] rotate-2" },
  { text: "HR-77 · Alineación cultural", className: "right-[12%] bottom-[14%] -rotate-3" },
  { text: "OPS · Guardia 03:00 AM", className: "left-[38%] top-[6%] rotate-1" },
  { text: "SEC-09 · credenciales en chat", className: "right-[30%] bottom-[6%] -rotate-2" },
] as const;

export function MenuBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Resplandores de color */}
      <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-indigo-700/25 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-rose-700/20 blur-3xl" />

      {/* Cuadrícula tipo hoja de cálculo corporativa */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Tickets flotantes */}
      {FLOATING_TICKETS.map((ticket) => (
        <div
          key={ticket.text}
          className={`absolute hidden rounded-md border border-slate-700/60 bg-slate-800/40 px-3 py-2 font-mono text-xs text-slate-500 shadow-lg backdrop-blur-sm md:block ${ticket.className}`}
        >
          {ticket.text}
        </div>
      ))}
    </div>
  );
}
