// presentation/admin/content/sections/core-fields/HeroFields.tsx
// Pure declarative sub-editor for Blackhole Hero section controls.
// Strictly adheres to shadow-free surfaces, token colors, and zero emojis (Rule 13).

import type { SectionEditorFormData } from "../SectionEditorModal.types";

interface HeroFieldsProps {
  readonly formData: SectionEditorFormData;
  readonly onChange: (field: keyof SectionEditorFormData, value: unknown) => void;
}

export function HeroFields({ formData, onChange }: HeroFieldsProps) {
  return (
    <div className="p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] space-y-4">
      <span className="text-xs font-mono uppercase tracking-wider text-[var(--cyan)] font-semibold block">
        Hero Section Controls
      </span>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="hero-eyebrow"
            className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
          >
            Eyebrow Badge
          </label>
          <input
            id="hero-eyebrow"
            type="text"
            value={formData.eyebrow || ""}
            onChange={(e) => onChange("eyebrow", e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
          />
        </div>

        <div>
          <label
            htmlFor="hero-subheadline"
            className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
          >
            Subheadline Narrative
          </label>
          <textarea
            id="hero-subheadline"
            rows={2}
            value={formData.subheadline || ""}
            onChange={(e) => onChange("subheadline", e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="hero-cta-primary"
              className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
            >
              Primary CTA Text
            </label>
            <input
              id="hero-cta-primary"
              type="text"
              value={formData.ctaPrimary || ""}
              onChange={(e) => onChange("ctaPrimary", e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
            />
          </div>

          <div>
            <label
              htmlFor="hero-cta-secondary"
              className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
            >
              Secondary CTA Text
            </label>
            <input
              id="hero-cta-secondary"
              type="text"
              value={formData.ctaSecondary || ""}
              onChange={(e) => onChange("ctaSecondary", e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="hero-photo"
            className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
          >
            Hero Photo URL
          </label>
          <div className="flex items-center gap-2">
            {formData.heroPhotoUrl && (
              <img
                src={formData.heroPhotoUrl}
                alt="Hero preview"
                className="w-8 h-8 rounded-lg object-cover border border-[var(--line)] bg-[var(--ink-900)] shrink-0"
              />
            )}
            <input
              id="hero-photo"
              type="text"
              value={formData.heroPhotoUrl || ""}
              onChange={(e) => onChange("heroPhotoUrl", e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
