// presentation/admin/content/sections/SectionEditorModal.tsx
// Declarative modal dialog for editing section content blocks.
// Shadow-free surfaces with hairline borders and zero emojis.
// All logic and use-cases live in SectionEditorModal.hooks.ts (Rule 13).

import {
  IoCallOutline,
  IoCloseOutline,
  IoDocumentTextOutline,
  IoImageOutline,
  IoLayersOutline,
  IoLocationOutline,
  IoLogoLinkedin,
  IoMailOutline,
  IoPersonOutline,
  IoSaveOutline,
} from "react-icons/io5";
import { RichEditor } from "../../shared/rich-editor/RichEditor";
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
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--ink-850)] border border-[var(--line)] rounded-2xl p-6 sm:p-8"
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
                {sectionToEdit ? `Edit ${sectionToEdit.title}` : "Configure Section"}
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
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Universal Section Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className={`w-full px-3.5 py-2 rounded-xl bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border outline-none focus:border-[var(--amber)] transition-colors ${
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
                Primary Headline / Subtitle
              </label>
              <input
                id="section-headline"
                type="text"
                value={formData.headline}
                onChange={(e) => handleChange("headline", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)] transition-colors"
              />
            </div>
          </div>

          {/* CONTACT SECTION EDITING */}
          {formData.type === "contact" && (
            <div className="p-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--cyan)] font-semibold block">
                Direct Contact Channels & Identity
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-fullname"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="contact-fullname"
                      type="text"
                      value={formData.fullName || ""}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                    />
                    <IoPersonOutline className="w-4 h-4 text-[var(--mist-dim)] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-role"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
                  >
                    Professional Role
                  </label>
                  <input
                    id="contact-role"
                    type="text"
                    value={formData.role || ""}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
                  >
                    Contact Email
                  </label>
                  <div className="relative">
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                    />
                    <IoMailOutline className="w-4 h-4 text-[var(--mist-dim)] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
                  >
                    Direct Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <input
                      id="contact-phone"
                      type="text"
                      value={formData.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                    />
                    <IoCallOutline className="w-4 h-4 text-[var(--mist-dim)] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-linkedin"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
                  >
                    LinkedIn Profile URL
                  </label>
                  <div className="relative">
                    <input
                      id="contact-linkedin"
                      type="url"
                      value={formData.linkedinUrl || ""}
                      onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--cyan)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                    />
                    <IoLogoLinkedin className="w-4 h-4 text-[var(--mist-dim)] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-location"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
                  >
                    Location Map URL
                  </label>
                  <div className="relative">
                    <input
                      id="contact-location"
                      type="text"
                      value={formData.locationUrl || ""}
                      onChange={(e) => handleChange("locationUrl", e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                    />
                    <IoLocationOutline className="w-4 h-4 text-[var(--mist-dim)] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-resume"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
                  >
                    CV / Résumé PDF URL
                  </label>
                  <div className="relative">
                    <input
                      id="contact-resume"
                      type="text"
                      value={formData.resumePdfUrl || ""}
                      onChange={(e) => handleChange("resumePdfUrl", e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                    />
                    <IoDocumentTextOutline className="w-4 h-4 text-[var(--mist-dim)] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-photo"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1"
                  >
                    Portrait Card Photo URL
                  </label>
                  <div className="flex items-center gap-2">
                    {formData.photoUrl && (
                      <img
                        src={formData.photoUrl}
                        alt="Portrait preview"
                        className="w-8 h-8 rounded-lg object-cover border border-[var(--line)] bg-[var(--ink-900)] shrink-0"
                      />
                    )}
                    <div className="relative flex-1">
                      <input
                        id="contact-photo"
                        type="text"
                        value={formData.photoUrl || ""}
                        onChange={(e) => handleChange("photoUrl", e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                      />
                      <IoImageOutline className="w-4 h-4 text-[var(--mist-dim)] absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HERO SECTION EDITING */}
          {formData.type === "hero" && (
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
                    onChange={(e) => handleChange("eyebrow", e.target.value)}
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
                    onChange={(e) => handleChange("subheadline", e.target.value)}
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
                      onChange={(e) => handleChange("ctaPrimary", e.target.value)}
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
                      onChange={(e) => handleChange("ctaSecondary", e.target.value)}
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
                      onChange={(e) => handleChange("heroPhotoUrl", e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* IMPACT / OVERVIEW METRICS EDITING */}
          {formData.type === "impact" && (
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
                    onChange={(e) => handleChange("metric1Value", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                  />
                  <input
                    type="text"
                    value={formData.metric1Label || ""}
                    placeholder="Label (e.g. Verified Cloud Savings)"
                    onChange={(e) => handleChange("metric1Label", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--mist)] border border-[var(--line)]"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[var(--ink-850)] border border-[var(--line)] space-y-2">
                  <span className="text-[10px] font-mono text-[var(--cyan)]">Metric 2</span>
                  <input
                    type="text"
                    value={formData.metric2Value || ""}
                    placeholder="Value (e.g. 40%)"
                    onChange={(e) => handleChange("metric2Value", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                  />
                  <input
                    type="text"
                    value={formData.metric2Label || ""}
                    placeholder="Label (e.g. Incident MTTR Reduction)"
                    onChange={(e) => handleChange("metric2Label", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--mist)] border border-[var(--line)]"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[var(--ink-850)] border border-[var(--line)] space-y-2">
                  <span className="text-[10px] font-mono text-[var(--live)]">Metric 3</span>
                  <input
                    type="text"
                    value={formData.metric3Value || ""}
                    placeholder="Value (e.g. 2,000+)"
                    onChange={(e) => handleChange("metric3Value", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                  />
                  <input
                    type="text"
                    value={formData.metric3Label || ""}
                    placeholder="Label (e.g. Active Cloud Resources)"
                    onChange={(e) => handleChange("metric3Label", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--mist)] border border-[var(--line)]"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[var(--ink-850)] border border-[var(--line)] space-y-2">
                  <span className="text-[10px] font-mono text-[var(--mist)]">Metric 4</span>
                  <input
                    type="text"
                    value={formData.metric4Value || ""}
                    placeholder="Value (e.g. 3 Clouds)"
                    onChange={(e) => handleChange("metric4Value", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                  />
                  <input
                    type="text"
                    value={formData.metric4Label || ""}
                    placeholder="Label (e.g. AWS, Azure, GCP)"
                    onChange={(e) => handleChange("metric4Label", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--ink-800)] text-xs font-mono text-[var(--mist)] border border-[var(--line)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TELEMETRY SECTION EDITING */}
          {formData.type === "telemetry" && (
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
                    onChange={(e) => handleChange("targetSavings", e.target.value)}
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
                    onChange={(e) => handleChange("mttrImprovement", e.target.value)}
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
                    onChange={(e) => handleChange("fleetManaged", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[var(--ink-850)] text-xs font-mono text-[var(--paper)] border border-[var(--line)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* NARRATIVE & MARKDOWN EDITOR (For Custom, Experience, Capabilities, Credentials) */}
          {(formData.type === "custom" ||
            formData.type === "experience" ||
            formData.type === "capabilities" ||
            formData.type === "credentials") && (
            <div>
              <RichEditor
                label="Section Content & Narrative"
                value={formData.description}
                onChange={(val) => handleChange("description", val)}
                placeholder="Write Markdown, HTML, tables, lists, or scoped <style> CSS blocks..."
                minHeight="180px"
                helperText="Full Markdown, HTML markup, tables, and CSS style tags are rendered live with theme tokens."
              />
            </div>
          )}

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
