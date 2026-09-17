// domain/entities/telemetry/MTTRBenchmark.ts
// Pure domain entity modeling incident response benchmarks and cloud fleet distribution.
// Backs the MTTR telemetry ladders and multi-cloud fleet distribution charts.

export interface MTTRTier {
  readonly tier: "P1" | "P2" | "P3";
  readonly tierName: string;
  readonly preAutomationMinutes: number;
  readonly postAutomationMinutes: number;
  readonly improvementPercent: number;
  readonly sampleSize: number;
  readonly primaryAutomations: readonly string[];
}

export interface ResourceDistributionPoint {
  readonly platform: "azure" | "aws" | "gcp" | "hybrid";
  readonly platformLabel: string;
  readonly resourceCount: number;
  readonly percentage: number;
  readonly keyServices: readonly string[];
}

export interface MTTRBenchmark {
  /** Deterministic Firestore document ID (e.g. "benchmark-mttr-fleet") */
  readonly id: string;
  readonly overallReductionPercent: number;
  readonly tiers: readonly MTTRTier[];
  readonly resourceDistribution: readonly ResourceDistributionPoint[];
  /** Manual sysadmin hours before automation (e.g. 35 hrs/wk) */
  readonly manualWeeklyHoursBefore: number;
  /** Automated IaC pipeline hours after optimization (e.g. 8 hrs/wk) */
  readonly automatedWeeklyHoursAfter: number;
  /** Percentage of routine maintenance toil eliminated (e.g. 30–40%) */
  readonly manualEffortReductionPercent: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type CreateMTTRBenchmarkInput = Omit<MTTRBenchmark, "id" | "createdAt" | "updatedAt">;
export type UpdateMTTRBenchmarkInput = Partial<
  Omit<MTTRBenchmark, "id" | "createdAt" | "updatedAt">
>;
