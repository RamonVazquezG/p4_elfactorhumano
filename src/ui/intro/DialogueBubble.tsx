import type { DialogueLine } from "@/simulation/data/narrativeDialogs";

/**
 * Contenedor reutilizable para una línea de diálogo.
 * Cambia alineación y colores según quién habla.
 */
interface DialogueBubbleProps {
  line: DialogueLine;
  /** Texto visible (puede estar parcialmente escrito por el efecto de tipeo). */
  visibleText: string;
  /** Indica si el efecto de tipeo sigue en curso para mostrar el cursor. */
  isTyping: boolean;
}

/** Estilos por hablante. */
const SPEAKER_STYLES = {
  boss: {
    wrapper: "items-start",
    bubble: "bg-slate-800 border-slate-600 text-slate-100 rounded-tl-sm",
    avatar: "bg-gradient-to-br from-indigo-500 to-purple-700",
    initials: "RV",
  },
  player: {
    wrapper: "items-end",
    bubble: "bg-sky-900/70 border-sky-700 text-sky-50 rounded-tr-sm",
    avatar: "bg-gradient-to-br from-sky-400 to-cyan-600",
    initials: "TÚ",
  },
  system: {
    wrapper: "items-center",
    bubble: "bg-transparent border-dashed border-slate-600 text-slate-400 font-mono text-sm",
    avatar: "",
    initials: "",
  },
} as const;

export function DialogueBubble({ line, visibleText, isTyping }: DialogueBubbleProps) {
  const style = SPEAKER_STYLES[line.speaker];
  const isSystem = line.speaker === "system";
  const isPlayer = line.speaker === "player";

  return (
    <div className={`flex w-full flex-col gap-2 animate-slide-up ${style.wrapper}`}>
      {/* Cabecera con avatar, nombre y cargo */}
      <div className={`flex items-center gap-3 ${isPlayer ? "flex-row-reverse" : ""}`}>
        {!isSystem && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg ${style.avatar}`}
            aria-hidden
          >
            {style.initials}
          </div>
        )}
        <div className={`flex flex-col ${isPlayer ? "items-end" : isSystem ? "items-center" : ""}`}>
          <span className="text-sm font-semibold text-slate-100">{line.name}</span>
          <span className="text-xs text-slate-400">{line.role}</span>
        </div>
      </div>

      {/* Burbuja con el texto */}
      <p
        className={`max-w-xl rounded-2xl border px-5 py-4 leading-relaxed shadow-md ${style.bubble}`}
      >
        {visibleText}
        {isTyping && (
          <span className="ml-0.5 inline-block w-2 animate-blink text-slate-300">▍</span>
        )}
      </p>
    </div>
  );
}
