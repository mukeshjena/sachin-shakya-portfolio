// application/use-cases/telemetry/SaveTelemetryMetricsUseCase.ts
// Use-case for updating FinOps cost comparison trajectories and MTTR benchmarks.
// Clean Architecture: zero UI framework dependencies.

import type { ITelemetryRepository } from "../../../domain/repositories/telemetry/ITelemetryRepository";

export interface ISaveTelemetryMetricsUseCase {
  execute(data: Record<string, unknown>): Promise<void>;
}

export class SaveTelemetryMetricsUseCase implements ISaveTelemetryMetricsUseCase {
  private readonly telemetryRepo: ITelemetryRepository;

  constructor(telemetryRepo: ITelemetryRepository) {
    this.telemetryRepo = telemetryRepo;
  }

  async execute(data: Record<string, unknown>): Promise<void> {
    await this.telemetryRepo.saveFinOpsMetrics(data);
  }
}
