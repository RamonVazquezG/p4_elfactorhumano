import type { GameMetrics, MetricDefinition } from "@/types/metrics";
import type { TaskUrgency } from "@/types/tasks";

/**
 * Valores iniciales de los indicadores al comenzar la simulación.
 */
export const INITIAL_METRICS: Readonly<GameMetrics> = {
  mentalHealth: 100,
  ethicalIntegrity: 100,
  firingRisk: 0,
};

/** Límites del rango válido para cualquier indicador. */
export const METRIC_MIN = 0;
export const METRIC_MAX = 100;

/**
 * Metadatos de presentación de cada indicador (textos en español).
 */
export const METRIC_DEFINITIONS: readonly MetricDefinition[] = [
  {
    key: "mentalHealth",
    label: "Salud Mental",
    description: "Se agota con guardias nocturnas, bugs imposibles y presión constante.",
    higherIsWorse: false,
  },
  {
    key: "ethicalIntegrity",
    label: "Integridad Ética",
    description: "Se erosiona al encubrir fallas, mentir a la gerencia o explotar a terceros.",
    higherIsWorse: false,
  },
  {
    key: "firingRisk",
    label: "Riesgo de Despido",
    description: "Sube al desafiar órdenes, negarte a capacitar o demorar tickets.",
    higherIsWorse: true,
  },
];

/**
 * Parámetros de calibración de la simulación en tiempo real.
 * Ajustar aquí la curva de dificultad sin tocar el motor.
 */
export const SIMULATION_TUNING = {
  /** Intervalo del reloj principal (ms). */
  tickIntervalMs: 500,

  /** Retraso de llegada de tareas al inicio de la partida (ms). */
  spawnDelayStartMs: { min: 11_000, max: 15_000 },
  /** Retraso de llegada de tareas con dificultad máxima (ms). */
  spawnDelayEndMs: { min: 6_000, max: 9_000 },
  /** Tiempo (ms) para alcanzar la dificultad máxima. */
  difficultyRampMs: 240_000,
  /** Retraso de la primera tarea tras iniciar (ms). */
  firstTaskDelayMs: 1_500,
  /** Retraso de la siguiente tarea cuando la cola queda vacía (ms). */
  emptyQueueSpawnDelayMs: 2_000,
  /** Máximo de tareas simultáneas en la cola. */
  maxQueueSize: 6,
  /** Número de plantillas recientes que no se repiten. */
  recentTemplateMemory: 5,

  /** Cada cuántos ms de demora se cobra penalización por tarea. */
  inactivityIntervalMs: 5_000,
  /** Riesgo de Despido sumado por intervalo de demora y por tarea. */
  inactivityPenaltyPerInterval: 2,
  /** Periodo de gracia (ms) antes de que una tarea empiece a penalizar, según urgencia. */
  gracePeriodMsByUrgency: {
    critical: 6_000,
    high: 10_000,
    medium: 15_000,
    low: 20_000,
  } satisfies Record<TaskUrgency, number>,

  /** Tickets resueltos necesarios para sobrevivir a la transición (victoria). */
  ticketsToSurvive: 20,
} as const;
