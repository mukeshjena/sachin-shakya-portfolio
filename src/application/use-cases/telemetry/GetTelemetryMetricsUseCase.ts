// application/use-cases/telemetry/GetTelemetryMetricsUseCase.ts
// Use-case for querying and subscribing to FinOps curves and telemetry metrics.
// Clean Architecture: zero UI framework dependencies.

import type { ITelemetryRepository } from "../../../domain/repositories/telemetry/ITelemetryRepository";

export interface IGetTelemetryMetricsUseCase {
  execute(): Promise<Record<string, unknown> | null>;
  subscribe(callback: (data: Record<string, unknown> | null) => void): () => void;
}

export class GetTelemetryMetricsUseCase implements IGetTelemetryMetricsUseCase {
  private readonly telemetryRepo: ITelemetryRepository;

  constructor(telemetryRepo: ITelemetryRepository) {
    this.telemetryRepo = telemetryRepo;
  }

  async execute(): Promise<Record<string, unknown> | null> {
    return this.telemetryRepo.getFinOpsMetrics();
  }

  subscribe(callback: (data: Record<string, unknown> | null) => void): () => void {
    return this.telemetryRepo.subscribeFinOpsMetrics(callback);
  }
}
