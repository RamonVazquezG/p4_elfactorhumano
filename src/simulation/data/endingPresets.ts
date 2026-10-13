import type { Ending, EndingType } from "@/types/endings";

/**
 * Textos de los finales posibles (español).
 */
export const ENDING_PRESETS: Readonly<Record<EndingType, Ending>> = {
  BURNOUT: {
    type: "BURNOUT",
    isVictory: false,
    trigger: "Burnout Extremo",
    title: "Renuncia por Colapso Mental",
    description:
      "Tu cuerpo y mente cedieron ante las guardias de madrugada y el estrés crónico. Tuviste que renunciar sin recibir indemnización, priorizando tu recuperación física.",
    badge: "Salud Mental 0%",
    metric: "mentalHealth",
  },
  CORRUPTION: {
    type: "CORRUPTION",
    isVictory: false,
    trigger: "Corrupción Profesional",
    title: "El Engranaje Tóxico",
    description:
      "Mantuviste tu puesto y cobraste cada bono, pero a costa de explotar a terceros, aprobar sistemas defectuosos y traicionar todos los principios éticos de la ingeniería.",
    badge: "Integridad Ética 0%",
    metric: "ethicalIntegrity",
  },
  FIRED: {
    type: "FIRED",
    isVictory: false,
    trigger: "Terminación Inmediata",
    title: "Despido sin Liquidación",
    description:
      "Recursos Humanos bloqueó tus credenciales corporativas a mitad del turno. Fuiste removido del proyecto por \"falta de cooperación y no alineación cultural\".",
    badge: "Riesgo de Despido 100%",
    metric: "firingRisk",
  },
  SURVIVED: {
    type: "SURVIVED",
    isVictory: true,
    trigger: "Transición Completada",
    title: "Sobreviviste a la Transición",
    description:
      "La transferencia de conocimiento terminó y recibiste tu indemnización. El sistema que construiste durante años ahora lo opera otro equipo, a otro precio, en otro huso horario. Saliste con tu puesto... hasta el próximo ciclo de «optimización». La pregunta es cuánto te costó.",
    badge: "Indemnización cobrada",
    metric: null,
  },
};
