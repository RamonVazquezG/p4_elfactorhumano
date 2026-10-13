/**
 * Guion narrativo inicial: llamada urgente con la jefatura.
 * Todo el contenido visible está en español.
 */

/** Hablantes posibles dentro del diálogo introductorio. */
export type DialogueSpeaker = "boss" | "player" | "system";

/** Línea individual del guion. */
export interface DialogueLine {
  speaker: DialogueSpeaker;
  /** Nombre visible del hablante. */
  name: string;
  /** Cargo o contexto mostrado bajo el nombre. */
  role: string;
  text: string;
}

/** Nombre y cargo del jefe ficticio. */
export const BOSS_NAME = "Ricardo Valdés";
export const BOSS_ROLE = "Director de Transformación Digital";

/** Guion de la introducción, en orden de aparición. */
export const INTRO_DIALOGUE: readonly DialogueLine[] = [
  {
    speaker: "system",
    name: "Sistema",
    role: "Videollamada entrante · 02:47 AM",
    text: "Llamada urgente de Ricardo Valdés. Asunto: «Reestructuración — CONFIDENCIAL».",
  },
  {
    speaker: "boss",
    name: BOSS_NAME,
    role: BOSS_ROLE,
    text: "Perdón por la hora. Seré directo: a partir de hoy, todo el equipo local de ingeniería fue desvinculado. Todos, menos tú.",
  },
  {
    speaker: "player",
    name: "Tú",
    role: "Ingeniero/a de Sistemas · Equipo local",
    text: "¿Todos? ¿Y quién va a mantener la plataforma? Hay quince años de código legado ahí...",
  },
  {
    speaker: "boss",
    name: BOSS_NAME,
    role: BOSS_ROLE,
    text: "Para eso te quedaste. La operación pasa a un proveedor offshore. Tu trabajo es capacitarlos, documentar todo y corregir lo que se rompa mientras tanto.",
  },
  {
    speaker: "boss",
    name: BOSS_NAME,
    role: BOSS_ROLE,
    text: "Por la diferencia horaria, las sesiones de capacitación serán a las 3:00 AM. Y tu indemnización está condicionada a completar la transferencia de conocimiento sin incidentes.",
  },
  {
    speaker: "player",
    name: "Tú",
    role: "Ingeniero/a de Sistemas · Equipo local",
    text: "Entonces... ¿estoy entrenando a quienes me van a reemplazar?",
  },
  {
    speaker: "boss",
    name: BOSS_NAME,
    role: BOSS_ROLE,
    text: "Prefiero llamarlo «optimización del talento global». Los tickets ya están entrando. No los dejes esperando: RR. HH. mide los tiempos de respuesta.",
  },
  {
    speaker: "system",
    name: "Sistema",
    role: "Llamada finalizada",
    text: "Tus credenciales siguen activas. Por ahora.",
  },
];
