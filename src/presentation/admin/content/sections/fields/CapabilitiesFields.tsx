// presentation/admin/content/sections/fields/CapabilitiesFields.tsx
// Pure declarative sub-editor for enterprise capability cards and skills.
// Strictly adheres to shadow-free surfaces, token colors, and zero emojis (Rule 13).

import { IoAddOutline, IoHardwareChipOutline, IoTrashOutline } from "react-icons/io5";
import type {
  CapabilityCardItem,
  CapabilityCategory,
} from "../../../../sections/capabilities/constants/capabilities.constants";

interface CapabilitiesFieldsProps {
  readonly cards: readonly CapabilityCardItem[];
  readonly onChange: (cards: readonly CapabilityCardItem[]) => void;
}

const CATEGORY_OPTIONS: { value: CapabilityCategory; label: string }[] = [
  { value: "cloud", label: "Cloud Platforms" },
  { value: "devops", label: "DevOps & IaC" },
  { value: "ai", label: "AI Tooling" },
  { value: "observability", label: "Observability" },
  { value: "containers", label: "Containers & K8s" },
  { value: "finops", label: "Cost Governance" },
  { value: "security", label: "Security & ITSM" },
];

export function CapabilitiesFields({ cards, onChange }: CapabilitiesFieldsProps) {
  const handleAddCard = () => {
    const newCard: CapabilityCardItem = {
      id: `cap-${Date.now()}`,
      category: "cloud",
      title: "New Capability Domain",
      subtitle: "TECHNICAL SPECIALIZATION",
      description: "Detailed description of architectural delivery and governance standards.",
      skills: ["Architecture", "Governance", "Automation"],
    };
    onChange([newCard, ...cards]);
  };

  const handleUpdateCard = (index: number, updated: Partial<CapabilityCardItem>) => {
    const next = [...cards];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const handleRemoveCard = (index: number) => {
    const next = cards.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="space-y-4 p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IoHardwareChipOutline className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--cyan)] font-semibold">
            Capability Cards ({cards.length})
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddCard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ink-700)] hover:bg-[var(--ink-600)] text-[var(--paper)] text-[11px] font-mono border border-[var(--line)] cursor-pointer transition-colors"
        >
          <IoAddOutline className="w-3.5 h-3.5 text-[var(--amber)]" aria-hidden="true" />
          <span>Add Card</span>
        </button>
      </div>

      <div className="space-y-3">
        {cards.map((card, idx) => (
          <div
            key={card.id || idx}
            className="p-3.5 rounded-xl bg-[var(--ink-850)] border border-[var(--line)] space-y-3"
          >
            <div className="flex items-center justify-between gap-2 border-b border-[var(--line-soft)] pb-2">
              <span className="text-[11px] font-mono font-semibold text-[var(--amber)]">
                Card #{idx + 1}: {card.title || "Untitled Capability"}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveCard(idx)}
                aria-label={`Remove ${card.title}`}
                className="p-1 rounded text-[var(--mist-dim)] hover:text-red-400 cursor-pointer transition-colors"
              >
                <IoTrashOutline className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor={`cap-title-${idx}`}
                  className="block text-[10px] font-mono uppercase text-[var(--mist-dim)] mb-1"
                >
                  Card Title
                </label>
                <input
                  id={`cap-title-${idx}`}
                  type="text"
                  value={card.title}
                  onChange={(e) => handleUpdateCard(idx, { title: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                />
              </div>

              <div>
                <label
                  htmlFor={`cap-category-${idx}`}
                  className="block text-[10px] font-mono uppercase text-[var(--mist-dim)] mb-1"
                >
                  Domain Category
                </label>
                <select
                  id={`cap-category-${idx}`}
                  value={card.category}
                  onChange={(e) =>
                    handleUpdateCard(idx, { category: e.target.value as CapabilityCategory })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--cyan)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor={`cap-subtitle-${idx}`}
                className="block text-[10px] font-mono uppercase text-[var(--mist-dim)] mb-1"
              >
                Eyebrow Subtitle (Uppercase descriptor)
              </label>
              <input
                id={`cap-subtitle-${idx}`}
                type="text"
                value={card.subtitle}
                onChange={(e) => handleUpdateCard(idx, { subtitle: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
              />
            </div>

            <div>
              <label
                htmlFor={`cap-desc-${idx}`}
                className="block text-[10px] font-mono uppercase text-[var(--mist-dim)] mb-1"
              >
                Description / Delivery Scope
              </label>
              <textarea
                id={`cap-desc-${idx}`}
                rows={2}
                value={card.description}
                onChange={(e) => handleUpdateCard(idx, { description: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--mist)] border border-[var(--line)] outline-none focus:border-[var(--amber)] resize-y"
              />
            </div>

            <div>
              <label
                htmlFor={`cap-skills-${idx}`}
                className="block text-[10px] font-mono uppercase text-[var(--mist-dim)] mb-1"
              >
                Skill Tags (Comma separated)
              </label>
              <input
                id={`cap-skills-${idx}`}
                type="text"
                value={card.skills.join(", ")}
                onChange={(e) =>
                  handleUpdateCard(idx, {
                    skills: e.target.value
                      .split(",")
                      .map((s) => s.trim())
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
