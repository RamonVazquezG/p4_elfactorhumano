import type { MetricKey } from "./metrics";

/**
 * Contratos de datos para las condiciones de fin de partida.
 */

/** Tipos de final posibles. */
export type EndingType = "BURNOUT" | "CORRUPTION" | "FIRED" | "SURVIVED";

/** Desenlace narrativo mostrado en la pantalla final. */
export interface Ending {
  type: EndingType;
  /** `true` si el final se considera victoria (aunque sea amarga). */
  isVictory: boolean;
  /** Disparador resumido, p. ej. "Burnout Extremo". */
  trigger: string;
  /** Título del final, p. ej. "Renuncia por Colapso Mental". */
  title: string;
  /** Texto narrativo completo (español). */
  description: string;
  /** Distintivo corto mostrado como insignia. */
  badge: string;
  /** Indicador que provocó el final (si aplica). */
  metric: MetricKey | null;
}
