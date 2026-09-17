// domain/entities/telemetry/CostComparisonSeries.ts
// Pure domain entity modeling multi-month FinOps cloud spend reduction curves.
// Backs the interactive FinOps cloud telemetry graph ($170K/mo run-rate savings).

export interface CostComparisonPoint {
  /** Time period key, e.g. "Jan 23", "Feb 23" */
  readonly month: string;
  /** Projected or pre-optimization expenditure in USD */
  readonly baselineSpend: number;
  /** Actual post-optimization expenditure in USD */
  readonly optimizedSpend: number;
  /** Monthly net savings in USD (baselineSpend - optimizedSpend) */
  readonly savingsDelta: number;
  /** Cumulative run-rate savings to date in USD */
  readonly cumulativeSavings: number;
  /** Notable architectural or governance event */
  readonly milestone?: string;
}

export interface CostComparisonSeries {
  /** Deterministic Firestore document ID (e.g. "finops-cost-trajectory") */
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly currency: string;
  /** Annualized financial savings in USD (e.g. 2040000) */
  readonly annualRunRateSavings: number;
  /** Target percentage savings achieved (e.g. 37.8) */
  readonly targetSavingsPercent: number;
  /** Chronological data points for chart geometry */
  readonly points: readonly CostComparisonPoint[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type CreateCostComparisonSeriesInput = Omit<
  CostComparisonSeries,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateCostComparisonSeriesInput = Partial<
  Omit<CostComparisonSeries, "id" | "createdAt" | "updatedAt">
>;
