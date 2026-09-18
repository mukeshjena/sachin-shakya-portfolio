// presentation/sections/telemetry/TelemetrySection.hooks.ts
// State logic, realtime telemetry synchronization, and tab switcher management.
// Universal Separation of Concerns (Rule 13).

import { useEffect, useState } from "react";
import type { IGetTelemetryMetricsUseCase } from "../../../application/use-cases/telemetry/GetTelemetryMetricsUseCase";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { useContainer } from "../../shared/useContainer";
import { MONTHLY_SPEND_SERIES } from "./constants/telemetry.constants";
import type {
  TelemetryMetricsData,
  TelemetrySectionState,
  TelemetryTabKey,
} from "./TelemetrySection.types";

const DEFAULT_METRICS_DATA: TelemetryMetricsData = {
  annualSavingsHeadline: "$170K/mo",
  monthlyTarget: "$170K/month Cloud Cost Savings",
  mttrReductionPercent: 40,
  managedResourcesCount: 2000,
  points: MONTHLY_SPEND_SERIES,
};

export function useTelemetrySectionLogic(): TelemetrySectionState {
  const [activeTab, setActiveTab] = useState<TelemetryTabKey>("spend");
  const [metricsData, setMetricsData] = useState<TelemetryMetricsData>(DEFAULT_METRICS_DATA);
  const getTelemetryUseCase = useContainer<IGetTelemetryMetricsUseCase>(
    DI_TOKENS.GetTelemetryMetrics
  );

  useEffect(() => {
    let isMounted = true;

    // 1. Subscribe to real-time updates from Firestore
    const unsubscribe = getTelemetryUseCase.subscribe((raw) => {
      if (!isMounted) return;

      if (!raw) {
        setMetricsData(DEFAULT_METRICS_DATA);
        return;
      }

      setMetricsData({
        annualSavingsHeadline:
          typeof raw.annualSavingsHeadline === "string" && raw.annualSavingsHeadline.trim()
            ? raw.annualSavingsHeadline
            : DEFAULT_METRICS_DATA.annualSavingsHeadline,
        monthlyTarget:
          typeof raw.monthlyTarget === "string" && raw.monthlyTarget.trim()
            ? raw.monthlyTarget
            : DEFAULT_METRICS_DATA.monthlyTarget,
        mttrReductionPercent:
          typeof raw.mttrReductionPercent === "number"
            ? raw.mttrReductionPercent
            : DEFAULT_METRICS_DATA.mttrReductionPercent,
        managedResourcesCount:
          typeof raw.managedResourcesCount === "number"
            ? raw.managedResourcesCount
            : DEFAULT_METRICS_DATA.managedResourcesCount,
        points:
          Array.isArray(raw.points) && raw.points.length > 0
            ? raw.points
            : DEFAULT_METRICS_DATA.points,
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [getTelemetryUseCase]);

  return {
    activeTab,
    setActiveTab,
    metricsData,
  };
}
