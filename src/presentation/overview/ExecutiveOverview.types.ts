// presentation/overview/ExecutiveOverview.types.ts
// Contract and state types for the ExecutiveOverview component.

export interface OverviewContentData {
  readonly eyebrow: string;
  readonly headline: string;
  readonly subheadline: string;
  readonly ctaPrimary: string;
  readonly ctaSecondary: string;
  readonly heroPhotoUrl: string;
  readonly resumePdfUrl?: string;
}

export interface ExecutiveOverviewState {
  readonly content: OverviewContentData;
}
