// presentation/admin/content/telemetry/TelemetryEditorModal.hooks.ts
// Hook managing FinOps cost points and infrastructure telemetry metric editing.

import { useCallback, useEffect, useState } from "react";
import type { ISaveTelemetryMetricsUseCase } from "../../../../application/use-cases/telemetry/SaveTelemetryMetricsUseCase";
import type { ITelemetryRepository } from "../../../../domain/repositories/telemetry/ITelemetryRepository";
import { DI_TOKENS } from "../../../../infrastructure/di/tokens";
import {
  MONTHLY_SPEND_SERIES,
  type MonthlySpendPoint,
} from "../../../sections/telemetry/constants/telemetry.constants";
import { useContainer } from "../../../shared/useContainer";
import type {
  FinOpsPoint,
  TelemetryEditorFormData,
  TelemetryEditorModalProps,
  TelemetryEditorViewModel,
} from "./TelemetryEditorModal.types";

const INITIAL_POINTS: readonly FinOpsPoint[] = MONTHLY_SPEND_SERIES.map(
  (pt: MonthlySpendPoint) => ({
    month: pt.month,
    baseline: pt.baseline,
    optimized: pt.optimized,
    milestone: pt.milestone,
  })
);

const INITIAL_FORM: TelemetryEditorFormData = {
  annualSavingsHeadline: "$170K/mo",
  monthlyTarget: "$170K/month Cloud Cost Savings",
  mttrReductionPercent: 40,
  managedResourcesCount: 2000,
  points: INITIAL_POINTS,
};

export function useTelemetryEditorModal({
  isOpen,
  onClose,
  onSuccess,
}: TelemetryEditorModalProps): TelemetryEditorViewModel {
  const saveTelemetry = useContainer<ISaveTelemetryMetricsUseCase>(DI_TOKENS.SaveTelemetryMetrics);
  const telemetryRepo = useContainer<ITelemetryRepository>(DI_TOKENS.TelemetryRepository);

  const [formData, setFormData] = useState<TelemetryEditorFormData>(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load existing data when modal opens
  useEffect(() => {
    if (!isOpen) {
      setIsSuccess(false);
      setErrorMessage(null);
      return;
    }

    let active = true;
    const fetchExisting = async () => {
      try {
        const existing = await telemetryRepo.getFinOpsMetrics();
        if (existing && active) {
          setFormData({
            annualSavingsHeadline:
              typeof existing.annualSavingsHeadline === "string"
                ? existing.annualSavingsHeadline
                : INITIAL_FORM.annualSavingsHeadline,
            monthlyTarget:
              typeof existing.monthlyTarget === "string"
                ? existing.monthlyTarget
                : INITIAL_FORM.monthlyTarget,
            mttrReductionPercent:
              typeof existing.mttrReductionPercent === "number"
                ? existing.mttrReductionPercent
                : INITIAL_FORM.mttrReductionPercent,
            managedResourcesCount:
              typeof existing.managedResourcesCount === "number"
                ? existing.managedResourcesCount
                : INITIAL_FORM.managedResourcesCount,
            points: Array.isArray(existing.points)
              ? (existing.points as FinOpsPoint[])
              : INITIAL_FORM.points,
          });
        }
      } catch {
        // Fallback to initial form data if not found or offline
      }
    };

    fetchExisting();

    return () => {
      active = false;
    };
  }, [isOpen, telemetryRepo]);

  const handleChange = useCallback((field: keyof TelemetryEditorFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrorMessage(null);
  }, []);

  const handlePointChange = useCallback(
    (index: number, field: keyof FinOpsPoint, value: unknown) => {
      setFormData((prev) => {
        const nextPoints = [...prev.points];
        const current = nextPoints[index];
        if (!current) return prev;

        nextPoints[index] = {
          ...current,
          [field]: value,
        };

        return {
          ...prev,
          points: nextPoints,
        };
      });
      setErrorMessage(null);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      setErrorMessage(null);

      try {
        await saveTelemetry.execute({
          annualSavingsHeadline: formData.annualSavingsHeadline.trim(),
          monthlyTarget: formData.monthlyTarget.trim(),
          mttrReductionPercent: Number(formData.mttrReductionPercent),
          managedResourcesCount: Number(formData.managedResourcesCount),
          points: formData.points,
        });

        setIsSuccess(true);
        onSuccess?.();
        setTimeout(() => {
          onClose();
        }, 800);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to update telemetry metrics.");
      } finally {
        setIsSaving(false);
      }
    },
    [formData, saveTelemetry, onSuccess, onClose]
  );

  return {
    formData,
    isSaving,
    isSuccess,
    errorMessage,
    handleChange,
    handlePointChange,
    handleSubmit,
  };
}
