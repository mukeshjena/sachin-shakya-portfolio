// presentation/admin/content/sections/fields/ExperienceFields.tsx
// Pure declarative sub-editor for career experience milestones.
// Strictly adheres to shadow-free surfaces, token colors, and zero emojis (Rule 13).

import { IoAddOutline, IoBriefcaseOutline, IoTrashOutline } from "react-icons/io5";
import type { ExperienceRole } from "../../../../sections/experience/constants/experience.constants";

interface ExperienceFieldsProps {
  readonly roles: readonly ExperienceRole[];
  readonly onChange: (roles: readonly ExperienceRole[]) => void;
}

export function ExperienceFields({ roles, onChange }: ExperienceFieldsProps) {
  const handleAddRole = () => {
    const newRole: ExperienceRole = {
      id: `role-${Date.now()}`,
      company: "New Organization",
      roleTitle: "Lead Cloud Architect",
      period: "2024 — PRESENT",
      location: "Enterprise Multi-Cloud Infrastructure",
      headlineMetric: "$50K/mo Savings",
      bullets: ["Architected enterprise infrastructure and automated CI/CD pipelines."],
      techStack: ["AWS", "Azure", "Kubernetes", "Terraform"],
    };
    onChange([newRole, ...roles]);
  };

  const handleUpdateRole = (index: number, updated: Partial<ExperienceRole>) => {
    const next = [...roles];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const handleRemoveRole = (index: number) => {
    const next = roles.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="space-y-4 p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IoBriefcaseOutline className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--cyan)] font-semibold">
            Career Experience Milestones ({roles.length})
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddRole}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ink-700)] hover:bg-[var(--ink-600)] text-[var(--paper)] text-[11px] font-mono border border-[var(--line)] cursor-pointer transition-colors"
        >
          <IoAddOutline className="w-3.5 h-3.5 text-[var(--amber)]" aria-hidden="true" />
          <span>Add Role</span>
        </button>
      </div>

      <div className="space-y-3">
        {roles.map((role, idx) => (
          <div
            key={role.id || idx}
            className="p-3.5 rounded-xl bg-[var(--ink-850)] border border-[var(--line)] space-y-3"
          >
            <div className="flex items-center justify-between gap-2 border-b border-[var(--line-soft)] pb-2">
              <span className="text-[11px] font-mono font-semibold text-[var(--amber)]">
                Role #{idx + 1}: {role.company || "Untitled Company"}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveRole(idx)}
                aria-label={`Remove ${role.company}`}
                className="p-1 rounded text-[var(--mist-dim)] hover:text-red-400 cursor-pointer transition-colors"
              >
                <IoTrashOutline className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor={`exp-company-${idx}`}
                  className="block text-[10px] font-mono uppercase text-[var(--mist-dim)] mb-1"
                >
                  Company
                </label>
                <input
                  id={`exp-company-${idx}`}
                  type="text"
                  value={role.company}
                  onChange={(e) => handleUpdateRole(idx, { company: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                />
              </div>

              <div>
                <label
                  htmlFor={`exp-role-${idx}`}
                  className="block text-[10px] font-mono uppercase text-[var(--mist-dim)] mb-1"
                >
                  Role Title
                </label>
                <input
                  id={`exp-role-${idx}`}
                  type="text"
                  value={role.roleTitle}
                  onChange={(e) => handleUpdateRole(idx, { roleTitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                />
              </div>

              <div>
                <label
                  htmlFor={`exp-period-${idx}`}
                  className="block text-[10px] font-mono uppercase text-[var(--mist-dim)] mb-1"
                >
                  Period / Dates
                </label>
                <input
                  id={`exp-period-${idx}`}
                  type="text"
                  value={role.period}
                  onChange={(e) => handleUpdateRole(idx, { period: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                />
              </div>

              <div>
                <label
                  htmlFor={`exp-metric-${idx}`}
                  className="block text-[10px] font-mono uppercase text-[var(--mist-dim)] mb-1"
                >
                  Headline Metric
                </label>
                <input
                  id={`exp-metric-${idx}`}
                  type="text"
                  value={role.headlineMetric || ""}
                  placeholder="e.g. $170K/mo Cloud Savings"
                  onChange={(e) => handleUpdateRole(idx, { headlineMetric: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor={`exp-location-${idx}`}
                className="block text-[10px] font-mono uppercase text-[var(--mist-dim)] mb-1"
              >
                Location & Scope Context
              </label>
              <input
                id={`exp-location-${idx}`}
                type="text"
                value={role.location}
                onChange={(e) => handleUpdateRole(idx, { location: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
              />
            </div>

            <div>
              <label
                htmlFor={`exp-bullets-${idx}`}
                className="block text-[10px] font-mono uppercase text-[var(--mist-dim)] mb-1"
              >
                Accomplishments / Bullet Points (One per line)
              </label>
              <textarea
                id={`exp-bullets-${idx}`}
                rows={3}
                value={role.bullets.join("\n")}
                onChange={(e) =>
                  handleUpdateRole(idx, {
                    bullets: e.target.value
                      .split("\n")
                      .map((b) => b.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--mist)] border border-[var(--line)] outline-none focus:border-[var(--amber)] resize-y"
              />
            </div>

            <div>
              <label
                htmlFor={`exp-tech-${idx}`}
                className="block text-[10px] font-mono uppercase text-[var(--mist-dim)] mb-1"
              >
                Tech Stack Tags (Comma separated)
              </label>
              <input
                id={`exp-tech-${idx}`}
                type="text"
                value={role.techStack.join(", ")}
                onChange={(e) =>
                  handleUpdateRole(idx, {
                    techStack: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--cyan)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
