// presentation/admin/dashboard/tabs/content/ContentTab.tsx
// Section ordering, content editing, and CloudOps telemetry configuration panel.
// Clean 3-dot menus, zero shadows, hairline borders, and zero emojis.

import type React from "react";
import { IoCreateOutline, IoLayersOutline, IoTrendingUpOutline } from "react-icons/io5";
import type { Section } from "../../../../../domain/entities/content/Section";
import { ThreeDotMenu } from "../../../../shared/menu/ThreeDotMenu";

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
  const getSectionSummary = (section: Section): string => {
    const c = section.content || {};
    if (typeof c.headline === "string" && c.headline) return c.headline;
    if (typeof c.heading === "string" && c.heading) return c.heading;
    switch (section.type) {
      case "hero":
        return "Headline, Subheadline, CTA controls & background shader";
      case "telemetry":
        return "Animated spend curve, MTTR resolution, & fleet stats";
      case "impact":
        return "Enterprise accountability highlights & core metrics";
      case "experience":
        return "Professional roles timeline, achievements & enterprise clients";
      case "capabilities":
        return "Competencies matrix, cloud platforms & tooling filters";
      case "credentials":
        return "Formal certifications, university degrees & enterprise honors";
      case "contact":
        return "Inquiry form, portrait card & direct communication channels";
      default:
        return typeof c.description === "string" && c.description
          ? c.description.slice(0, 80)
          : "Custom section content payload";
    }
  };

  return (
    <div className="space-y-6">
      {/* Architecture & Cost Metrics Module */}
      <div className="p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--amber)]">
            <IoTrendingUpOutline className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--paper)]">
              Cloud Architecture & Cost Metrics
            </h3>
            <p className="text-xs text-[var(--mist)] mt-0.5">
              12-month cloud cost curve ($170K/mo target), MTTR reduction %, and fleet metrics.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenTelemetry}
          className="px-4 py-2 rounded-xl bg-[var(--ink-800)] hover:bg-[var(--ink-750)] border border-[var(--line)] hover:border-[var(--amber)] text-xs font-mono font-medium text-[var(--amber)] transition-colors cursor-pointer shrink-0"
        >
          Configure Metrics &rarr;
        </button>
      </div>

      {/* Sections List Header */}
      <div className="p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
        <div className="flex items-center gap-2.5 mb-1">
          <IoLayersOutline className="w-4 h-4 text-[var(--cyan)]" />
          <h3 className="text-lg font-bold tracking-tight text-[var(--paper)]">
            Section Management & Visibility
          </h3>
        </div>
        <p className="text-xs text-[var(--mist)]">
          Reorder sections, toggle live visibility, and edit all section contents directly.
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
              className="flex items-center justify-between p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] hover:border-[var(--line-soft)] transition-colors gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-[var(--ink-700)] border border-[var(--line)] flex items-center justify-center text-xs font-mono font-semibold text-[var(--cyan)] shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[var(--paper)]">
                      {section.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-[var(--ink-700)] border border-[var(--line)] text-[var(--cyan)]">
                      {section.type}
                    </span>
                    <span
                      className={`text-[10px] font-mono ${
                        section.isVisible ? "text-[var(--live)]" : "text-[var(--mist-dim)]"
                      }`}
                    >
                      &bull; {section.isVisible ? "Live on Site" : "Hidden"}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--mist)] mt-1 truncate">
                    {getSectionSummary(section)}
                  </div>
                </div>
              </div>

              {/* 3-Dot Options Menu */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onEditSection(section)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ink-700)] border border-[var(--line)] hover:border-[var(--amber)] text-xs font-mono text-[var(--paper)] hover:text-[var(--amber)] transition-colors cursor-pointer"
                >
                  <IoCreateOutline className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <ThreeDotMenu
                  actions={[
                    {
                      id: `edit-${section.id}`,
                      label: "Edit Section Content",
                      onClick: () => onEditSection(section),
                    },
                    {
                      id: `up-${section.id}`,
                      label: "Move Up",
                      disabled: isFirst,
                      onClick: () => onMoveSection(section.id, "up"),
                    },
                    {
                      id: `down-${section.id}`,
                      label: "Move Down",
                      disabled: isLast,
                      onClick: () => onMoveSection(section.id, "down"),
                    },
                    {
                      id: `vis-${section.id}`,
                      label: section.isVisible ? "Hide from Site" : "Show on Site",
                      onClick: () => onToggleVisibility(section),
                    },
                  ]}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
