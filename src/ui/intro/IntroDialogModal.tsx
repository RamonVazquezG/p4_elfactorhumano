"use client";

import { useEffect, useRef, useState } from "react";
import type { DialogueLine } from "@/simulation/data/narrativeDialogs";
import { DialogueBubble } from "./DialogueBubble";

/**
 * Introducción narrativa: videollamada urgente con el jefe.
 * Muestra el guion línea por línea con efecto de máquina de escribir.
 */
interface IntroDialogModalProps {
  lines: readonly DialogueLine[];
  /** Se invoca al pulsar «Aceptar y Continuar» en la última línea. */
  onFinish: () => void;
}

/** Milisegundos por carácter del efecto de tipeo. */
const TYPING_SPEED_MS = 22;

export function IntroDialogModal({ lines, onFinish }: IntroDialogModalProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentLine = lines[lineIndex];
  const isTyping = charCount < currentLine.text.length;
  const isLastLine = lineIndex === lines.length - 1;

  // Efecto de tipeo: avanza un carácter por intervalo hasta completar la línea.
  useEffect(() => {
    if (!isTyping) return;
    const handle = setInterval(() => {
      setCharCount((c) => Math.min(c + 1, currentLine.text.length));
    }, TYPING_SPEED_MS);
    return () => clearInterval(handle);
  }, [isTyping, currentLine.text.length]);

  // Mantiene visible la línea más reciente.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lineIndex, charCount]);

  /** Completa la línea en curso o avanza a la siguiente. */
  const handleAdvance = () => {
    if (isTyping) {
      setCharCount(currentLine.text.length);
      return;
    }
    if (isLastLine) {
      onFinish();
      return;
    }
    setLineIndex((i) => i + 1);
    setCharCount(0);
  };

  /** Salta toda la introducción mostrando el texto completo. */
  const handleSkip = () => {
    setLineIndex(lines.length - 1);
    setCharCount(lines[lines.length - 1].text.length);
  };

  // Atajos de teclado: Enter o Espacio para avanzar.
  const advanceRef = useRef(handleAdvance);
  useEffect(() => {
    advanceRef.current = handleAdvance;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        advanceRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-950 via-[#0b1020] to-slate-950 p-4 animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
        className="flex h-[min(720px,92vh)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/90 shadow-2xl shadow-black/60"
      >
        {/* Barra superior estilo videollamada */}
        <header className="flex items-center justify-between border-b border-slate-700 bg-slate-950/80 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
            </span>
            <h2 id="intro-title" className="text-sm font-semibold tracking-wide text-slate-200">
              Reestructuración — CONFIDENCIAL
            </h2>
          </div>
          <span className="font-mono text-xs text-slate-500">02:47 AM · Cifrado E2E</span>
        </header>

        {/* Historial del diálogo */}
        <div ref={scrollRef} className="kanban-scroll flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {lines.slice(0, lineIndex + 1).map((line, i) => (
            <DialogueBubble
              key={i}
              line={line}
              visibleText={i === lineIndex ? line.text.slice(0, charCount) : line.text}
              isTyping={i === lineIndex && isTyping}
            />
          ))}
        </div>

        {/* Controles */}
        <footer className="flex items-center justify-between gap-3 border-t border-slate-700 bg-slate-950/60 px-5 py-4">
          <button
            type="button"
            onClick={handleSkip}
            disabled={isLastLine && !isTyping}
            className="text-sm text-slate-400 underline-offset-4 transition hover:text-slate-200 hover:underline disabled:invisible"
          >
            Saltar introducción
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-xs text-slate-500 sm:inline">
              {lineIndex + 1}/{lines.length}
            </span>
            <button
              type="button"
              onClick={handleAdvance}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold shadow-lg transition active:scale-95 ${
                isLastLine && !isTyping
                  ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                  : "bg-slate-700 text-slate-100 hover:bg-slate-600"
              }`}
            >
              {isTyping ? "Mostrar todo" : isLastLine ? "Aceptar y Continuar" : "Siguiente"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
