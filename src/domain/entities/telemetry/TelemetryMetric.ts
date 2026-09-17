// domain/entities/telemetry/TelemetryMetric.ts
// Pure domain entity representing high-level executive telemetry indicators.
// Powers instrument panel KPIs, impact statistics, and live health badges.

export type TelemetryCategory = "finops" | "reliability" | "automation" | "scale" | "availability";

export interface TelemetryMetric {
  /** Deterministic Firestore document ID (e.g. "kpi-monthly-savings", "kpi-mttr-reduction") */
  readonly id: string;
  readonly category: TelemetryCategory;
  /** Primary label, e.g. "Cloud Cost Optimization" */
  readonly title: string;
  /** Technical context, e.g. "Monthly recurring infrastructure reduction" */
  readonly subtitle?: string;
  /** Formatted executive metric string, e.g. "$170K/mo", "40%", "2,000+" */
  readonly headlineValue: string;
  /** Unit descriptor, e.g. "USD / month", "minutes", "resources" */
  readonly unit?: string;
  /** Numerical baseline before automation / optimization */
  readonly baselineValue?: number;
  /** Numerical achieved / post-optimization value */
  readonly targetValue?: number;
  /** Numerical delta percentage, e.g. -37.8 or -40 */
  readonly changePercentage?: number;
  /** Visual indicator orientation */
  readonly direction?: "up" | "down" | "neutral";
  /** Scope of telemetry, e.g. "2023–Present", "L12M" */
  readonly timeframe?: string;
  /** Priority ordering in command center */
  readonly order: number;
  /** Highlighted on executive summary hero */
  readonly isFeatured: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type CreateTelemetryMetricInput = Omit<TelemetryMetric, "id" | "createdAt" | "updatedAt">;
export type UpdateTelemetryMetricInput = Partial<
  Omit<TelemetryMetric, "id" | "createdAt" | "updatedAt">
>;
