// presentation/admin/content/promo/PromoPopupEditor.tsx
// Pure declarative admin component to manage promo popup lifecycle, copy, frequency, and display triggers.
// Strictly adheres to shadow-free surfaces, outline Cupertino icons, and zero emojis.

import type React from "react";
import {
  IoCheckmarkCircleOutline,
  IoMegaphoneOutline,
  IoSaveOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { usePromoPopupEditor } from "./PromoPopupEditor.hooks";

export const PromoPopupEditor: React.FC = () => {
  const { formData, isLoading, isSaving, statusMessage, handleChange, handleSave } =
    usePromoPopupEditor();

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] flex items-center justify-center">
        <span className="text-xs font-mono text-[var(--mist-dim)]">
          Loading promo popup configuration...
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--amber)]">
            <IoMegaphoneOutline className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--paper)] tracking-tight">
              Promo Popup Management
            </h3>
            <p className="text-xs font-mono text-[var(--mist-dim)] mt-0.5">
              Configure consulting invitation modal, trigger latency, and display frequency
            </p>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--ink-800)] border border-[var(--line)]">
          <span
            className={`w-2 h-2 rounded-full ${formData.isEnabled ? "bg-[var(--live)]" : "bg-[var(--mist-dim)]"}`}
            aria-hidden="true"
          />
          <span className="text-[11px] font-mono text-[var(--mist)] uppercase tracking-wider">
            {formData.isEnabled ? "Active on Live Site" : "Disabled"}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 space-y-6">
        {/* Toggle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Active Switch */}
          <div className="p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[var(--paper)]">Enable Promo Popup</span>
              <p className="text-[11px] font-mono text-[var(--mist-dim)] mt-0.5">
                Display automatic modal to prospective clients
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.isEnabled}
              onChange={(e) => handleChange("isEnabled", e.target.checked)}
              className="w-4 h-4 rounded border-[var(--line)] accent-[var(--amber)] cursor-pointer"
            />
          </div>

          {/* Frequency Control */}
          <div className="p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] space-y-2">
            <div>
              <span className="text-xs font-semibold text-[var(--paper)]">Display Frequency</span>
              <p className="text-[11px] font-mono text-[var(--mist-dim)] mt-0.5">
                Control session repetition behavior
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-xs font-mono text-[var(--mist)] cursor-pointer">
                <input
                  type="radio"
                  name="frequency"
                  value="session"
                  checked={formData.frequency === "session"}
                  onChange={() => handleChange("frequency", "session")}
                  className="accent-[var(--amber)]"
                />
                Once per session
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-mono text-[var(--mist)] cursor-pointer">
                <input
                  type="radio"
                  name="frequency"
                  value="always"
                  checked={formData.frequency === "always"}
                  onChange={() => handleChange("frequency", "always")}
                  className="accent-[var(--amber)]"
                />
                Each time
              </label>
            </div>
          </div>
        </div>

        {/* Text Fields */}
        <div className="space-y-4">
          {/* Badge & Delay */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label
                htmlFor="promo-badge-text"
                className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)]"
              >
                Eyebrow Badge Text
              </label>
              <input
                id="promo-badge-text"
                type="text"
                value={formData.badgeText}
                onChange={(e) => handleChange("badgeText", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] text-xs font-mono text-[var(--paper)] placeholder-[var(--mist-dim)] focus:border-[var(--amber)] outline-none"
                placeholder="Direct CloudOps Advisory"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="promo-delay"
                className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] flex items-center gap-1.5"
              >
                <IoTimeOutline className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Display Delay (s)</span>
              </label>
              <input
                id="promo-delay"
                type="number"
                min="0"
                max="60"
                value={formData.displayDelaySeconds}
                onChange={(e) =>
                  handleChange("displayDelaySeconds", Number.parseInt(e.target.value, 10) || 0)
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] text-xs font-mono text-[var(--paper)] focus:border-[var(--amber)] outline-none"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <label
              htmlFor="promo-heading-input"
              className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)]"
            >
              Modal Main Heading
            </label>
            <input
              id="promo-heading-input"
              type="text"
              value={formData.heading}
              onChange={(e) => handleChange("heading", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] text-xs font-mono text-[var(--paper)] placeholder-[var(--mist-dim)] focus:border-[var(--amber)] outline-none"
              placeholder="Accelerate Your Cloud Architecture"
            />
          </div>

          {/* Subheading / Value Proposition */}
          <div className="space-y-1.5">
            <label
              htmlFor="promo-subheading-input"
              className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)]"
            >
              Value Proposition Copy
            </label>
            <textarea
              id="promo-subheading-input"
              rows={3}
              value={formData.subheading}
              onChange={(e) => handleChange("subheading", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] text-xs font-mono text-[var(--paper)] placeholder-[var(--mist-dim)] focus:border-[var(--amber)] outline-none resize-none"
              placeholder="Book a confidential 30-minute infrastructure audit with Sachin Shakya..."
            />
          </div>

          {/* CTA Button Text */}
          <div className="space-y-1.5">
            <label
              htmlFor="promo-cta-input"
              className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)]"
            >
              Call To Action Button Text
            </label>
            <input
              id="promo-cta-input"
              type="text"
              value={formData.ctaText}
              onChange={(e) => handleChange("ctaText", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] text-xs font-mono text-[var(--paper)] placeholder-[var(--mist-dim)] focus:border-[var(--amber)] outline-none"
              placeholder="Request Architecture Audit"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {statusMessage ? (
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--amber)]">
              <IoCheckmarkCircleOutline className="w-4 h-4 text-[var(--live)]" />
              <span>{statusMessage}</span>
            </div>
          ) : (
            <div />
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[var(--amber)] text-[#06121a] font-bold text-xs uppercase tracking-wider hover:bg-[var(--amber-deep)] active:translate-y-px transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            <IoSaveOutline className="w-4 h-4" aria-hidden="true" />
            <span>{isSaving ? "Saving..." : "Save Promo Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
