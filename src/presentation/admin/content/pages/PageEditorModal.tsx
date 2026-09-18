// presentation/admin/content/pages/PageEditorModal.tsx
// Pure declarative modal dialog for creating and editing dynamic pages.
// Shadow-free surfaces with hairline borders and zero emojis.
// All logic, validation, and use-cases live in PageEditorModal.hooks.ts (Rule 13).

import { IoCloseOutline, IoDocumentTextOutline, IoSaveOutline } from "react-icons/io5";
import { usePageEditorModal } from "./PageEditorModal.hooks";
import type { PageEditorModalProps } from "./PageEditorModal.types";

export function PageEditorModal(props: PageEditorModalProps) {
  const { isOpen, onClose } = props;
  const { formData, isSaving, errors, isEditMode, handleChange, handleBlur, handleSubmit } =
    usePageEditorModal(props);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--ink-900)]/80 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="page-modal-title"
        className="w-full max-w-lg bg-[var(--ink-850)] border border-[var(--line)] rounded-2xl p-6 sm:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] text-[var(--cyan)]">
              <IoDocumentTextOutline className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h3
                id="page-modal-title"
                className="text-base font-bold tracking-tight text-[var(--paper)]"
              >
                {isEditMode ? "Edit Page Properties" : "Create New Dynamic Page"}
              </h3>
              <p className="text-[11px] font-mono text-[var(--mist-dim)] mt-0.5">
                Dynamic routing & navigation controls
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

        {/* General Error Banner */}
        {errors.general && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
            {errors.general}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="page-title"
              className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
            >
              Page Title <span className="text-[var(--amber)]">*</span>
            </label>
            <input
              id="page-title"
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
              htmlFor="page-slug"
              className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
            >
              URL Slug <span className="text-[var(--amber)]">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-mono text-[var(--mist-dim)]">
                /
              </span>
              <input
                id="page-slug"
                type="text"
                required
                disabled={isEditMode && formData.slug === "home"}
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                onBlur={() => handleBlur("slug")}
                placeholder="cloud-security-architecture"
                className={`w-full pl-7 pr-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] placeholder-[var(--mist-dim)]/50 border outline-none focus:border-[var(--amber)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.slug ? "border-red-500/50" : "border-[var(--line)]"
                }`}
              />
            </div>
            {errors.slug && (
              <p className="mt-1 text-[11px] font-mono text-red-400">{errors.slug}</p>
            )}
          </div>

          {/* Visibility & Nav Toggles */}
          <div className="p-3.5 bg-[var(--ink-900)] border border-[var(--line)] rounded-xl space-y-2.5">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--mist-dim)]">
              Publishing Options
            </div>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-mono text-[var(--paper)]">Publish live on site</span>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => handleChange("isPublished", e.target.checked)}
                className="w-4 h-4 rounded border-[var(--line)] accent-[var(--amber)] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-mono text-[var(--paper)]">
                Show link in Header Navigation
              </span>
              <input
                type="checkbox"
                checked={formData.showInHeader}
                onChange={(e) => handleChange("showInHeader", e.target.checked)}
                className="w-4 h-4 rounded border-[var(--line)] accent-[var(--amber)] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-mono text-[var(--paper)]">
                Show link in Footer Navigation
              </span>
              <input
                type="checkbox"
                checked={formData.showInFooter}
                onChange={(e) => handleChange("showInFooter", e.target.checked)}
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
              <span>{isSaving ? "Saving..." : isEditMode ? "Update Page" : "Create Page"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
