// presentation/admin/content/sections/SectionEditorModal.tsx
// Declarative modal dialog for editing section content blocks.
// Shadow-free surfaces with hairline borders and zero emojis.
// All logic and use-cases live in SectionEditorModal.hooks.ts (Rule 13).

import { IoCloseOutline, IoLayersOutline, IoSaveOutline } from "react-icons/io5";
import { useSectionEditorModal } from "./SectionEditorModal.hooks";
import type { SectionEditorModalProps } from "./SectionEditorModal.types";

export function SectionEditorModal(props: SectionEditorModalProps) {
  const { isOpen, onClose, sectionToEdit } = props;
  const { formData, isSaving, errors, handleChange, handleBlur, handleSubmit } =
    useSectionEditorModal(props);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--ink-900)]/80 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="section-modal-title"
        className="w-full max-w-lg bg-[var(--ink-850)] border border-[var(--line)] rounded-2xl p-6 sm:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] text-[var(--amber)]">
              <IoLayersOutline className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h3
                id="section-modal-title"
                className="text-base font-bold tracking-tight text-[var(--paper)]"
              >
                {sectionToEdit ? "Edit Content Section" : "Configure Section"}
              </h3>
              <p className="text-[11px] font-mono text-[var(--mist-dim)] mt-0.5">
                Type: {formData.type.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--mist-dim)] hover:text-[var(--paper)] bg-[var(--ink-800)] border border-[var(--line)] cursor-pointer transition-colors"
          >
            <IoCloseOutline className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Error Alert */}
        {errors.general && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
            {errors.general}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="section-title"
              className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
            >
              Section Title <span className="text-[var(--amber)]">*</span>
            </label>
            <input
              id="section-title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              placeholder="e.g. Cloud Security Architecture"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] placeholder-[var(--mist-dim)]/50 border outline-none focus:border-[var(--amber)] transition-colors ${
                errors.title ? "border-red-500/50" : "border-[var(--line)]"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-[11px] font-mono text-red-400">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="section-headline"
              className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
            >
              Section Headline / Subtitle
            </label>
            <input
              id="section-headline"
              type="text"
              value={formData.headline}
              onChange={(e) => handleChange("headline", e.target.value)}
              placeholder="Primary section focus heading"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] placeholder-[var(--mist-dim)]/50 border border-[var(--line)] outline-none focus:border-[var(--amber)] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="section-description"
              className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
            >
              Section Content Description
            </label>
            <textarea
              id="section-description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Detailed descriptive copy for this section block"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] placeholder-[var(--mist-dim)]/50 border border-[var(--line)] outline-none focus:border-[var(--amber)] transition-colors resize-none"
            />
          </div>

          {/* Visibility Toggle */}
          <div className="p-3.5 bg-[var(--ink-900)] border border-[var(--line)] rounded-xl">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-mono text-[var(--paper)]">Display on Live Site</span>
                <p className="text-[10px] font-mono text-[var(--mist-dim)] mt-0.5">
                  Toggle to hide or display without deleting data
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) => handleChange("isVisible", e.target.checked)}
                className="w-4 h-4 rounded border-[var(--line)] accent-[var(--amber)] cursor-pointer"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-800)] border border-[var(--line)] cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-[var(--amber)] hover:bg-[var(--amber-deep)] text-[var(--ink-900)] text-xs font-mono font-semibold tracking-wide transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoSaveOutline className="w-4 h-4" aria-hidden="true" />
              <span>{isSaving ? "Saving..." : "Save Section"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
