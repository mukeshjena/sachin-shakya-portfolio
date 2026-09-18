// presentation/admin/content/telemetry/TelemetryEditorModal.tsx
// Modal interface for configuring FinOps cost curves and cloud telemetry targets.
// Strictly shadow-free instrument panel aesthetic with zero emojis.

import type React from "react";
import { IoCheckmarkCircleOutline, IoCloseOutline, IoTrendingUpOutline } from "react-icons/io5";
import { useTelemetryEditorModal } from "./TelemetryEditorModal.hooks";
import type { TelemetryEditorModalProps } from "./TelemetryEditorModal.types";

export const TelemetryEditorModal: React.FC<TelemetryEditorModalProps> = (props) => {
  const { isOpen, onClose } = props;
  const {
    formData,
    isSaving,
    isSuccess,
    errorMessage,
    handleChange,
    handlePointChange,
    handleSubmit,
  } = useTelemetryEditorModal(props);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="telemetry-editor-title"
    >
      {/* Accessible Backdrop */}
      <button
        type="button"
        className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-default border-none p-0 w-full h-full"
        onClick={onClose}
        aria-label="Close modal overlay"
        tabIndex={-1}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[var(--ink-850)] border border-[var(--line)] rounded-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line-soft)] bg-[var(--ink-900)]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--amber)]">
              <IoTrendingUpOutline className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="telemetry-editor-title"
                className="text-base font-semibold text-[var(--paper)] tracking-tight"
              >
                FinOps Telemetry Configuration
              </h2>
              <p className="text-xs text-[var(--mist-dim)] font-mono">
                Realtime spend curve and operational benchmark points
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line)] transition-colors"
            aria-label="Close modal"
          >
            <IoCloseOutline className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
              <IoCheckmarkCircleOutline className="w-4 h-4 shrink-0" />
              <span>Telemetry benchmarks successfully persisted to Firestore!</span>
            </div>
          )}

          {/* Top-Level Operational Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="telemetry-headline"
                className="block text-xs font-medium text-[var(--mist)] mb-1.5"
              >
                Annual Savings Headline
              </label>
              <input
                id="telemetry-headline"
                type="text"
                value={formData.annualSavingsHeadline}
                onChange={(e) => handleChange("annualSavingsHeadline", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] text-sm text-[var(--paper)] font-mono focus:outline-none focus:border-[var(--amber)] transition-colors"
                placeholder="$170K/mo"
              />
            </div>

            <div>
              <label
                htmlFor="telemetry-monthly-target"
                className="block text-xs font-medium text-[var(--mist)] mb-1.5"
              >
                Monthly Target Label
              </label>
              <input
                id="telemetry-monthly-target"
                type="text"
                value={formData.monthlyTarget}
                onChange={(e) => handleChange("monthlyTarget", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] text-sm text-[var(--paper)] focus:outline-none focus:border-[var(--amber)] transition-colors"
                placeholder="$170K/month Cloud Cost Savings"
              />
            </div>

            <div>
              <label
                htmlFor="telemetry-mttr"
                className="block text-xs font-medium text-[var(--mist)] mb-1.5"
              >
                MTTR Reduction (%)
              </label>
              <input
                id="telemetry-mttr"
                type="number"
                value={formData.mttrReductionPercent}
                onChange={(e) => handleChange("mttrReductionPercent", Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] text-sm text-[var(--paper)] font-mono tabular-nums focus:outline-none focus:border-[var(--amber)] transition-colors"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label
                htmlFor="telemetry-resources"
                className="block text-xs font-medium text-[var(--mist)] mb-1.5"
              >
                Managed Cloud Resources
              </label>
              <input
                id="telemetry-resources"
                type="number"
                value={formData.managedResourcesCount}
                onChange={(e) => handleChange("managedResourcesCount", Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] text-sm text-[var(--paper)] font-mono tabular-nums focus:outline-none focus:border-[var(--amber)] transition-colors"
                min="0"
              />
            </div>
          </div>

          {/* 12-Month Trajectory Points */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[var(--mist)] tracking-wider uppercase">
                12-Month Trajectory Spend Points ($K/mo)
              </h3>
              <span className="text-[11px] font-mono text-[var(--mist-dim)]">12 data points</span>
            </div>

            <div className="space-y-2 border border-[var(--line-soft)] rounded-xl p-3 bg-[var(--ink-900)]/40 max-h-60 overflow-y-auto">
              {formData.points.map((pt, idx) => (
                <div
                  key={pt.month}
                  className="grid grid-cols-12 gap-2 items-center text-xs py-1 px-1.5 rounded-lg hover:bg-[var(--ink-800)] transition-colors"
                >
                  <div className="col-span-2 font-mono font-medium text-[var(--paper)]">
                    {pt.month}
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={pt.baseline}
                      onChange={(e) => handlePointChange(idx, "baseline", Number(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-[var(--ink-850)] border border-[var(--line)] text-xs text-[var(--cyan)] font-mono tabular-nums focus:outline-none focus:border-[var(--cyan)]"
                      placeholder="Baseline"
                      aria-label={`${pt.month} Baseline ($K)`}
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={pt.optimized}
                      onChange={(e) => handlePointChange(idx, "optimized", Number(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-[var(--ink-850)] border border-[var(--line)] text-xs text-[var(--amber)] font-mono tabular-nums focus:outline-none focus:border-[var(--amber)]"
                      placeholder="Optimized"
                      aria-label={`${pt.month} Optimized ($K)`}
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={pt.milestone || ""}
                      onChange={(e) => handlePointChange(idx, "milestone", e.target.value)}
                      className="w-full px-2 py-1 rounded bg-[var(--ink-850)] border border-[var(--line)] text-xs text-[var(--mist)] placeholder:text-[var(--mist-dim)] focus:outline-none focus:border-[var(--line)]"
                      placeholder="Milestone (optional)"
                      aria-label={`${pt.month} Milestone`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--line-soft)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-transparent border border-[var(--line)] text-xs font-medium text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--line)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-[var(--amber)] text-[var(--ink-950)] text-xs font-semibold hover:bg-[var(--amber-deep)] transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving Metrics..." : "Save Telemetry Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
