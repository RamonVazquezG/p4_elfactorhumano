import type { MetricImpact } from "./metrics";

/**
 * Contratos de datos para las tareas procedurales del tablero Kanban.
 */

/** Estrategia arquetípica que representa cada una de las tres opciones. */
export type DecisionStrategy = "sacrifice" | "shortcut" | "rebellion";

/** Nivel de urgencia de un ticket corporativo. */
export type TaskUrgency = "low" | "medium" | "high" | "critical";

/** Opción de decisión disponible dentro de una tarea. */
export interface DecisionOption {
  strategy: DecisionStrategy;
  /** Texto del botón (español). */
  label: string;
  /** Explicación de lo que implica la opción (español). */
  description: string;
  /** Deltas aplicados sobre los indicadores al elegir la opción. */
  impact: MetricImpact;
  /** Mensaje narrativo mostrado en el historial tras resolver (español). */
  feedback: string;
}

/** Precedente real en el que se inspira la tarea. */
export interface RealWorldPrecedent {
  /** Etiqueta corta para el distintivo, p. ej. "Disney IT · 2015". */
  badge: string;
  /** Resumen breve del caso real (español). */
  summary: string;
}

/** Plantilla estática a partir de la cual se generan tareas en tiempo real. */
export interface TaskTemplate {
  templateId: string;
  title: string;
  description: string;
  urgency: TaskUrgency;
  /** Remitente ficticio del ticket (español). */
  requester: string;
  precedent: RealWorldPrecedent;
  /** Exactamente tres opciones: sacrificio, atajo y rebeldía. */
  options: readonly [DecisionOption, DecisionOption, DecisionOption];
}

/** Instancia viva de una tarea dentro de la columna "Tareas Pendientes". */
export interface Task extends TaskTemplate {
  /** Identificador único de la instancia. */
  id: string;
  /** Número secuencial del ticket (p. ej. #0007). */
  ticketNumber: number;
  /** Marca de tiempo (ms) en la que llegó la tarea. */
  createdAt: number;
  /** Última marca de tiempo (ms) en la que se cobró penalización por inactividad. */
  lastPenaltyAt: number;
  /** Penalización acumulada de Riesgo de Despido por inactividad en esta tarea. */
  accumulatedPenalty: number;
}

/** Registro inmutable de una tarea resuelta para la columna "Historial". */
export interface ResolvedTask {
  task: Task;
  chosenOption: DecisionOption;
  /** Impacto efectivamente aplicado (tras normalizar en [0, 100]). */
  appliedImpact: MetricImpact;
  resolvedAt: number;
  /** Tiempo de respuesta en milisegundos. */
  responseTimeMs: number;
}
