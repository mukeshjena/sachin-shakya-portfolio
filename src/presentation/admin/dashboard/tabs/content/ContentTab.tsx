// presentation/admin/dashboard/tabs/content/ContentTab.tsx
// Section ordering, content editing, and FinOps telemetry configuration panel.
// Zero shadows, hairline borders, and zero emojis.

import type React from "react";
import {
  IoArrowDownOutline,
  IoArrowUpOutline,
  IoCreateOutline,
  IoEyeOffOutline,
  IoEyeOutline,
  IoLayersOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import type { Section } from "../../../../../domain/entities/content/Section";

export interface ContentTabProps {
  readonly sections: readonly Section[];
  readonly onEditSection: (section: Section) => void;
  readonly onMoveSection: (sectionId: string, direction: "up" | "down") => void;
  readonly onToggleVisibility: (section: Section) => void;
  readonly onOpenTelemetry: () => void;
}

export const ContentTab: React.FC<ContentTabProps> = ({
  sections,
  onEditSection,
  onMoveSection,
  onToggleVisibility,
  onOpenTelemetry,
}) => {
  return (
    <div className="space-y-6">
      {/* FinOps Telemetry Executive Module */}
      <div className="p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--amber)]">
            <IoTrendingUpOutline className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--paper)]">
              CloudOps & Cost Optimization Telemetry
            </h3>
            <p className="text-xs text-[var(--mist)] mt-0.5">
              12-month cloud cost curve ($170K/mo target), MTTR reduction %, and fleet stats.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenTelemetry}
          className="px-4 py-2.5 rounded-xl bg-[var(--ink-800)] hover:bg-[var(--ink-750)] border border-[var(--line)] hover:border-[var(--amber)] text-xs font-mono font-medium text-[var(--amber)] transition-colors cursor-pointer shrink-0"
        >
          Edit Telemetry Benchmarks &rarr;
        </button>
      </div>

      {/* Sections List Header */}
      <div className="p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
        <div className="flex items-center gap-2.5 mb-1">
          <IoLayersOutline className="w-4 h-4 text-[var(--cyan)]" />
          <h3 className="text-lg font-bold tracking-tight text-[var(--paper)]">
            Section Arrangement & Visibility
          </h3>
        </div>
        <p className="text-xs text-[var(--mist)]">
          Reorder sections sequentially and customize content payloads across homepage modules.
        </p>
      </div>

      {/* Reorderable Section Items */}
      <div className="p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] space-y-3">
        {sections.map((section, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === sections.length - 1;

          return (
            <div
              key={section.id}
              className="flex items-center justify-between p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] hover:border-[var(--line-soft)] transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-[var(--ink-700)] border border-[var(--line)] flex items-center justify-center text-xs font-mono font-semibold text-[var(--cyan)]">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[var(--paper)] truncate">
                    {section.title}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--mist-dim)] mt-0.5">
                    <span className="uppercase text-[var(--cyan)]">{section.type}</span>
                    <span>&bull;</span>
                    <span>{section.isVisible ? "Visible on Site" : "Hidden from Public"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Move Up */}
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={() => onMoveSection(section.id, "up")}
                  className="p-2 rounded-lg bg-[var(--ink-850)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--cyan)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label={`Move ${section.title} up`}
                >
                  <IoArrowUpOutline className="w-3.5 h-3.5" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={isLast}
                  onClick={() => onMoveSection(section.id, "down")}
                  className="p-2 rounded-lg bg-[var(--ink-850)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--cyan)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label={`Move ${section.title} down`}
                >
                  <IoArrowDownOutline className="w-3.5 h-3.5" />
                </button>

                {/* Toggle Visibility */}
                <button
                  type="button"
                  onClick={() => onToggleVisibility(section)}
                  className="p-2 rounded-lg bg-[var(--ink-850)] border border-[var(--line)] text-[var(--mist)] hover:text-[var(--paper)] hover:border-[var(--amber)] transition-colors"
                  aria-label={`Toggle visibility of ${section.title}`}
                >
                  {section.isVisible ? (
                    <IoEyeOutline className="w-3.5 h-3.5 text-[var(--live)]" />
                  ) : (
                    <IoEyeOffOutline className="w-3.5 h-3.5 text-[var(--mist-dim)]" />
                  )}
                </button>

                {/* Edit Content */}
                <button
                  type="button"
                  onClick={() => onEditSection(section)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ink-700)] border border-[var(--line)] hover:border-[var(--amber)] text-xs font-mono text-[var(--paper)] hover:text-[var(--amber)] transition-colors cursor-pointer"
                >
                  <IoCreateOutline className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
