// presentation/sections/telemetry/TelemetrySection.hooks.ts
// State logic and tab switcher management for the Telemetry Command Center.
// Universal Separation of Concerns (Rule 13).

import { useState } from "react";
import type { TelemetrySectionState, TelemetryTabKey } from "./TelemetrySection.types";

export function useTelemetrySectionLogic(): TelemetrySectionState {
  const [activeTab, setActiveTab] = useState<TelemetryTabKey>("spend");

  return {
    activeTab,
    setActiveTab,
  };
}
