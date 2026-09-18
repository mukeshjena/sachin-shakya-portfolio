// presentation/admin/content/sections/core-fields/MetricsFields.tsx
// Pure declarative sub-editor for impact overview metrics and telemetry KPI targets.
// Strictly adheres to shadow-free surfaces, token colors, and zero emojis (Rule 13).

import type { SectionEditorFormData } from "../SectionEditorModal.types";

interface MetricsFieldsProps {
  readonly formData: SectionEditorFormData;
  readonly onChange: (field: keyof SectionEditorFormData, value: unknown) => void;
}

export function MetricsFields({ formData, onChange }: MetricsFieldsProps) {
  if (formData.type === "impact") {
    return (
      <div className="p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--cyan)] font-semibold block">
          Executive Accountability Metrics
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-[var(--ink-850)] border border-[var(--line)] space-y-2">
            <span className="text-[10px] font-mono text-[var(--amber)]">Metric 1</span>
            <input
              type="text"
              value={formData.metric1Value || ""}
              placeholder="Value (e.g. $170K/MO)"
              onChange={(e) => onChange("metric1Value", e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
            />
            <input
              type="text"
              value={formData.metric1Label || ""}
              placeholder="Label (e.g. Verified Cloud Savings)"
              onChange={(e) => onChange("metric1Label", e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--mist)] border border-[var(--line)]"
            />
          </div>

          <div className="p-3 rounded-lg bg-[var(--ink-850)] border border-[var(--line)] space-y-2">
            <span className="text-[10px] font-mono text-[var(--cyan)]">Metric 2</span>
            <input
              type="text"
              value={formData.metric2Value || ""}
              placeholder="Value (e.g. 40%)"
              onChange={(e) => onChange("metric2Value", e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
            />
            <input
              type="text"
              value={formData.metric2Label || ""}
              placeholder="Label (e.g. Incident MTTR Reduction)"
              onChange={(e) => onChange("metric2Label", e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--mist)] border border-[var(--line)]"
            />
          </div>

          <div className="p-3 rounded-lg bg-[var(--ink-850)] border border-[var(--line)] space-y-2">
            <span className="text-[10px] font-mono text-[var(--live)]">Metric 3</span>
            <input
              type="text"
              value={formData.metric3Value || ""}
              placeholder="Value (e.g. 2,000+)"
              onChange={(e) => onChange("metric3Value", e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
            />
            <input
              type="text"
              value={formData.metric3Label || ""}
              placeholder="Label (e.g. Active Cloud Resources)"
              onChange={(e) => onChange("metric3Label", e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--mist)] border border-[var(--line)]"
            />
          </div>

          <div className="p-3 rounded-lg bg-[var(--ink-850)] border border-[var(--line)] space-y-2">
            <span className="text-[10px] font-mono text-[var(--mist)]">Metric 4</span>
            <input
              type="text"
              value={formData.metric4Value || ""}
              placeholder="Value (e.g. 3 Clouds)"
              onChange={(e) => onChange("metric4Value", e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
            />
            <input
              type="text"
              value={formData.metric4Label || ""}
              placeholder="Label (e.g. AWS, Azure, GCP)"
              onChange={(e) => onChange("metric4Label", e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--mist)] border border-[var(--line)]"
            />
          </div>
        </div>
      </div>
    );
  }

  if (formData.type === "telemetry") {
    return (
      <div className="p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--cyan)] font-semibold block">
          Telemetry Targets
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label
              htmlFor="tel-savings"
              className="block text-[10px] font-mono text-[var(--mist-dim)] mb-1"
            >
              Target Savings
            </label>
            <input
              id="tel-savings"
              type="text"
              value={formData.targetSavings || ""}
              onChange={(e) => onChange("targetSavings", e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[var(--ink-850)] text-xs font-mono text-[var(--amber)] border border-[var(--line)]"
            />
          </div>
          <div>
            <label
              htmlFor="tel-mttr"
              className="block text-[10px] font-mono text-[var(--mist-dim)] mb-1"
            >
              MTTR Reduction
            </label>
            <input
              id="tel-mttr"
              type="text"
              value={formData.mttrImprovement || ""}
              onChange={(e) => onChange("mttrImprovement", e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[var(--ink-850)] text-xs font-mono text-[var(--cyan)] border border-[var(--line)]"
            />
          </div>
          <div>
            <label
              htmlFor="tel-fleet"
              className="block text-[10px] font-mono text-[var(--mist-dim)] mb-1"
            >
              Fleet Monitored
            </label>
            <input
              id="tel-fleet"
              type="text"
              value={formData.fleetManaged || ""}
              onChange={(e) => onChange("fleetManaged", e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
