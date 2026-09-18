// presentation/sections/telemetry/TelemetrySection.types.ts
// Contract types and UI state definition for the TelemetrySection component.

import type { FinOpsPointData } from "./charts/finops/CostTrajectoryChart.utils";

export type TelemetryTabKey = "spend" | "mttr" | "automation" | "fleet";

export interface TelemetryMetricsData {
  readonly annualSavingsHeadline: string;
  readonly monthlyTarget: string;
  readonly mttrReductionPercent: number;
  readonly managedResourcesCount: number;
  readonly points: readonly FinOpsPointData[];
}

export interface TelemetrySectionState {
  readonly activeTab: TelemetryTabKey;
  readonly setActiveTab: (tab: TelemetryTabKey) => void;
  readonly metricsData: TelemetryMetricsData;
}
