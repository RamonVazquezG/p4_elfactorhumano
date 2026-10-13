import type { GameMetrics, MetricDefinition } from "@/types/metrics";
import { MetricCard } from "../cards/MetricCard";
import { ColumnShell } from "./ColumnShell";

/**
 * Columna 1: Indicadores Críticos.
 */
interface MetricsColumnProps {
  metrics: GameMetrics;
  definitions: readonly MetricDefinition[];
}

export function MetricsColumn({ metrics, definitions }: MetricsColumnProps) {
  return (
    <ColumnShell title="Indicadores Críticos">
      {definitions.map((def) => (
        <MetricCard key={def.key} definition={def} value={metrics[def.key]} />
      ))}
    </ColumnShell>
  );
}
