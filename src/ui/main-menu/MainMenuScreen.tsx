import { MenuBackground } from "./MenuBackground";

/**
 * Pantalla de título: marca del juego, subtítulo temático, créditos y CTA de inicio.
 */
interface MainMenuScreenProps {
  onStart: () => void;
  /** Tickets necesarios para sobrevivir, mostrados en las instrucciones. */
  ticketsToSurvive: number;
}

export function MainMenuScreen({ onStart, ticketsToSurvive }: MainMenuScreenProps) {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-6 py-16">
      <MenuBackground />

      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center animate-slide-up">
        <span className="mb-6 rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-1 font-mono text-xs uppercase tracking-[0.25em] text-rose-300">
          Simulación · Outsourcing extremo
        </span>

        <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
          Legacy Overtime
        </h1>
        <p className="mt-3 text-xl font-medium text-slate-300 sm:text-2xl">
          El Protocolo de Sustitución
        </p>

        <p className="mt-8 max-w-lg leading-relaxed text-slate-400">
          Eres la última persona del equipo local. Capacita a tu reemplazo, apaga incendios a las
          3:00 AM y sobrevive a la transición sin perder tu salud mental, tu ética… ni tu empleo.
        </p>

        {/* Reglas rápidas */}
        <ul className="mt-8 grid w-full gap-3 text-left text-sm sm:grid-cols-3">
          <li className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
            <span className="block font-semibold text-sky-300">Salud Mental</span>
            <span className="text-slate-400">Si llega a 0%, colapsas.</span>
          </li>
          <li className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
            <span className="block font-semibold text-emerald-300">Integridad Ética</span>
            <span className="text-slate-400">Si llega a 0%, te conviertes en el sistema.</span>
          </li>
          <li className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
            <span className="block font-semibold text-rose-300">Riesgo de Despido</span>
            <span className="text-slate-400">Si llega a 100%, quedas fuera.</span>
          </li>
        </ul>
        <p className="mt-4 text-sm text-slate-500">
          Resuelve {ticketsToSurvive} tickets para completar la transición. Los tickets
          demorados aumentan tu riesgo de despido.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="group mt-10 inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-lg font-bold text-slate-900 shadow-xl shadow-indigo-900/40 transition hover:-translate-y-0.5 hover:bg-indigo-50 active:translate-y-0"
        >
          Iniciar Simulación
          <span className="transition group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </button>

        <footer className="mt-14 text-xs text-slate-600">
          Proyecto académico · El Factor Humano · Basado en casos reales de outsourcing en TI
        </footer>
      </div>
    </main>
  );
}
