// presentation/admin/content/settings/SiteSettingsEditor.tsx
// Declarative site configuration and social link management panel.
// Flat instrument styling with zero box-shadows and zero emojis.
// All logic lives in SiteSettingsEditor.hooks.ts (Rule 13).

import {
  IoAddOutline,
  IoCheckmarkCircleOutline,
  IoSaveOutline,
  IoSettingsOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useSiteSettingsEditor } from "./SiteSettingsEditor.hooks";

export function SiteSettingsEditor() {
  const {
    formData,
    isSaving,
    isSuccess,
    errorMessage,
    handleChange,
    handleSocialLinkChange,
    handleAddSocialLink,
    handleRemoveSocialLink,
    handleSubmit,
  } = useSiteSettingsEditor();

  return (
    <div className="w-full max-w-3xl mx-auto bg-[var(--ink-850)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] text-[var(--amber)]">
            <IoSettingsOutline className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-[var(--paper)]">
              Site Identity & Metadata
            </h3>
            <p className="text-[11px] font-mono text-[var(--mist-dim)] mt-0.5">
              Global title, headline, executive bio, and public social links
            </p>
          </div>
        </div>

        {isSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--live)]/10 border border-[var(--live)]/30 text-[10px] font-mono text-[var(--live)]">
            <IoCheckmarkCircleOutline className="w-3.5 h-3.5" aria-hidden="true" />
            <span>SAVED TO LIVE SITE</span>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Identity */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="settings-fullname"
                className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
              >
                Executive Name
              </label>
              <input
                id="settings-fullname"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="settings-email"
                className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
              >
                Public Contact Email
              </label>
              <input
                id="settings-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)] transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="settings-headline"
              className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
            >
              Professional Headline
            </label>
            <input
              id="settings-headline"
              type="text"
              required
              value={formData.headline}
              onChange={(e) => handleChange("headline", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="settings-bio"
              className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
            >
              Executive Summary Bio
            </label>
            <textarea
              id="settings-bio"
              rows={3}
              value={formData.shortBio}
              onChange={(e) => handleChange("shortBio", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)] transition-colors resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Social Links CRUD */}
        <div className="p-4 bg-[var(--ink-900)] border border-[var(--line)] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)]">
              External Social & Professional Profiles
            </span>
            <button
              type="button"
              onClick={handleAddSocialLink}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--ink-800)] hover:bg-[var(--ink-700)] text-[10px] font-mono text-[var(--cyan)] border border-[var(--line)] transition-colors cursor-pointer"
            >
              <IoAddOutline className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {formData.socialLinks.map((link, idx) => (
              <div
                key={`${link.platform}:${link.label}:${link.url}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--ink-800)] border border-[var(--line)]"
              >
                <input
                  type="text"
                  value={link.label}
                  placeholder="Label"
                  onChange={(e) => handleSocialLinkChange(idx, "label", e.target.value)}
                  className="w-28 px-2.5 py-1.5 rounded-lg bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                />

                <input
                  type="url"
                  value={link.url}
                  placeholder="https://..."
                  onChange={(e) => handleSocialLinkChange(idx, "url", e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-[var(--ink-850)] text-xs font-mono text-[var(--cyan)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                />

                <label className="flex items-center gap-1.5 px-2 text-[10px] font-mono text-[var(--mist-dim)] cursor-pointer">
                  <span>Show</span>
                  <input
                    type="checkbox"
                    checked={link.isVisible}
                    onChange={(e) => handleSocialLinkChange(idx, "isVisible", e.target.checked)}
                    className="w-3.5 h-3.5 accent-[var(--amber)]"
                  />
                </label>

                <button
                  type="button"
                  aria-label={`Remove link ${link.label}`}
                  onClick={() => handleRemoveSocialLink(idx)}
                  className="p-1.5 rounded-lg text-[var(--mist-dim)] hover:text-red-400 bg-[var(--ink-850)] border border-[var(--line)] transition-colors cursor-pointer"
                >
                  <IoTrashOutline className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--amber)] hover:bg-[var(--amber-deep)] text-[var(--ink-900)] text-xs font-mono font-semibold tracking-wide transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoSaveOutline className="w-4 h-4" aria-hidden="true" />
            <span>{isSaving ? "Saving Configuration..." : "Save Site Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
