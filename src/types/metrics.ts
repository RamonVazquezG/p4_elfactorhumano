/**
 * Contratos de datos para los indicadores del jugador.
 * Todos los valores numéricos viven en el rango cerrado [0, 100].
 */

/** Claves de los tres indicadores críticos de la simulación. */
export type MetricKey = "mentalHealth" | "ethicalIntegrity" | "firingRisk";

/** Estado vigente de los indicadores del jugador. */
export interface GameMetrics {
  /** Salud Mental: inicia en 100. Derrota al llegar a 0. */
  mentalHealth: number;
  /** Integridad Ética: inicia en 100. Derrota al llegar a 0. */
  ethicalIntegrity: number;
  /** Riesgo de Despido: inicia en 0. Derrota al llegar a 100. */
  firingRisk: number;
}

/**
 * Modificadores (deltas) que una decisión aplica sobre los indicadores.
 * Los valores negativos restan y los positivos suman.
 */
export type MetricImpact = GameMetrics;

/** Metadatos de presentación de cada indicador. */
export interface MetricDefinition {
  key: MetricKey;
  /** Etiqueta visible en español. */
  label: string;
  /** Descripción corta en español. */
  description: string;
  /**
   * Si es `true`, un valor alto es peligroso (p. ej. Riesgo de Despido).
   * Si es `false`, un valor bajo es peligroso.
   */
  higherIsWorse: boolean;
}

/** Valores extremos registrados durante la partida para el reporte final. */
export interface MetricExtremes {
  lowestMentalHealth: number;
  lowestEthicalIntegrity: number;
  highestFiringRisk: number;
}
