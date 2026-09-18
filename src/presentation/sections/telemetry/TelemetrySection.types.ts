// presentation/sections/telemetry/TelemetrySection.types.ts
// Contract types and UI state definition for the TelemetrySection component.

export type TelemetryTabKey = "spend" | "mttr" | "automation" | "fleet";

export interface TelemetrySectionState {
  readonly activeTab: TelemetryTabKey;
  readonly setActiveTab: (tab: TelemetryTabKey) => void;
}
