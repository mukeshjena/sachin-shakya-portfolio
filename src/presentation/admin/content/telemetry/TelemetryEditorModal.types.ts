// presentation/admin/content/telemetry/TelemetryEditorModal.types.ts
// Type contracts for the FinOps telemetry and MTTR benchmark editor.

export interface FinOpsPoint {
  readonly month: string;
  readonly baseline: number;
  readonly optimized: number;
  readonly milestone?: string;
}

export interface TelemetryEditorFormData {
  readonly annualSavingsHeadline: string;
  readonly monthlyTarget: string;
  readonly mttrReductionPercent: number;
  readonly managedResourcesCount: number;
  readonly points: readonly FinOpsPoint[];
}

export interface TelemetryEditorModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess?: () => void;
}

export interface TelemetryEditorViewModel {
  readonly formData: TelemetryEditorFormData;
  readonly isSaving: boolean;
  readonly isSuccess: boolean;
  readonly errorMessage: string | null;
  readonly handleChange: (field: keyof TelemetryEditorFormData, value: unknown) => void;
  readonly handlePointChange: (index: number, field: keyof FinOpsPoint, value: unknown) => void;
  readonly handleSubmit: (e: React.FormEvent) => Promise<void>;
}
