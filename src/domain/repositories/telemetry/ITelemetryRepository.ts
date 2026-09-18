// domain/repositories/telemetry/ITelemetryRepository.ts
// Pure domain contract for persisting and retrieving FinOps and infrastructure telemetry metrics.
// Zero UI framework dependencies.

export interface ITelemetryRepository {
  saveFinOpsMetrics(data: Record<string, unknown>): Promise<void>;
  getFinOpsMetrics(): Promise<Record<string, unknown> | null>;
}
