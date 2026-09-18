// presentation/sections/contact/ContactSection.tsx
// Executive Consultation Desk and Cloud Architecture Advisory Form.
// Strictly shadow-free surfaces, outline Cupertino icons, and zero emojis.
// Adheres to Universal Separation of Concerns (Rule 13).

import {
  IoAlertCircleOutline,
  IoCallOutline,
  IoCheckmarkCircleOutline,
  IoDocumentTextOutline,
  IoLocationOutline,
  IoLogoLinkedin,
  IoMailOutline,
  IoPaperPlaneOutline,
} from "react-icons/io5";
import { useContactSectionLogic } from "./ContactSection.hooks";
import { CONTACT_COPY, CONTACT_FIELD_CONFIG } from "./constants/contact.constants";

export function ContactSection() {
  const {
    values,
    errors,
    isSubmitting,
    isSubmitted,
    generalError,
    contactInfo,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    handleReset,
  } = useContactSectionLogic();

  return (
    <section
      id="contact"
      aria-label="Consultation Desk"
      className="relative w-full py-20 md:py-28 border-t border-[var(--line)] scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--paper)] leading-tight">
            {CONTACT_COPY.headline}
          </h2>

          <p className="text-sm sm:text-base text-[var(--mist)] leading-relaxed font-sans">
            {CONTACT_COPY.subheadline}
          </p>
        </div>

        {/* 2-Column Command Desk Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column (5 cols): Full-Bleed Portrait Card with Bottom Vintage Overlay */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="relative flex-1 min-h-[480px] lg:min-h-[560px] w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[#050508] flex flex-col justify-end">
              {/* Full-Bleed Portrait Image */}
              <img
                src={contactInfo.photoUrl}
                alt={`${contactInfo.fullName} — ${contactInfo.headline}`}
                className="absolute inset-0 w-full h-full object-cover object-top"
                loading="lazy"
              />

              {/* Experience Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="text-[10px] font-mono text-[var(--amber)] bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 font-bold select-none">
                  ~9 YRS EXP
                </span>
              </div>

              {/* Bottom Gradient Overlay with Identity and Icons */}
              <div className="relative z-10 w-full bg-gradient-to-t from-black via-black/85 to-transparent pt-24 pb-6 px-6 space-y-4">
                {/* Direct Identity */}
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-[var(--paper)]">
                    {contactInfo.fullName}
                  </h3>
                  <p className="text-xs text-[var(--cyan)] font-mono mt-0.5">
                    {contactInfo.headline}
                  </p>
                </div>

                {/* Direct Channels Icon Bar */}
                <div className="flex items-center gap-2.5 pt-3 border-t border-[var(--line-soft)]">
                  <a
                    href={`mailto:${contactInfo.email}`}
                    title={`Direct Email (${contactInfo.email})`}
                    className="w-11 h-11 rounded-xl bg-[var(--ink-800)]/90 backdrop-blur-md border border-[var(--line)] hover:border-[var(--amber)] text-[var(--cyan)] hover:text-[var(--paper)] flex items-center justify-center transition-all cursor-pointer"
                    aria-label={`Email ${contactInfo.fullName}`}
                  >
                    <IoMailOutline className="w-5 h-5" aria-hidden="true" />
                  </a>

                  <a
                    href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                    title={`Direct Phone / WhatsApp (${contactInfo.phone})`}
                    className="w-11 h-11 rounded-xl bg-[var(--ink-800)]/90 backdrop-blur-md border border-[var(--line)] hover:border-[var(--amber)] text-[var(--cyan)] hover:text-[var(--paper)] flex items-center justify-center transition-all cursor-pointer"
                    aria-label={`Call ${contactInfo.fullName}`}
                  >
                    <IoCallOutline className="w-5 h-5" aria-hidden="true" />
                  </a>

                  <a
                    href={contactInfo.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn Profile"
                    className="w-11 h-11 rounded-xl bg-[var(--ink-800)]/90 backdrop-blur-md border border-[var(--line)] hover:border-[var(--amber)] text-[var(--cyan)] hover:text-[var(--paper)] flex items-center justify-center transition-all cursor-pointer"
                    aria-label={`${contactInfo.fullName} LinkedIn Profile`}
                  >
                    <IoLogoLinkedin className="w-5 h-5" aria-hidden="true" />
                  </a>

                  <a
                    href={contactInfo.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Location (Faridabad / Delhi NCR, India)"
                    className="w-11 h-11 rounded-xl bg-[var(--ink-800)]/90 backdrop-blur-md border border-[var(--line)] hover:border-[var(--amber)] text-[var(--cyan)] hover:text-[var(--paper)] flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Location Map"
                  >
                    <IoLocationOutline className="w-5 h-5" aria-hidden="true" />
                  </a>

                  <a
                    href={contactInfo.resumePdfUrl}
                    download
                    title="Download Verified CV (PDF)"
                    className="w-11 h-11 rounded-xl bg-[var(--ink-800)]/90 backdrop-blur-md border border-[var(--line)] hover:border-[var(--amber)] text-[var(--amber)] hover:text-[var(--paper)] flex items-center justify-center transition-all cursor-pointer ml-auto"
                    aria-label="Download Verified Résumé PDF"
                  >
                    <IoDocumentTextOutline className="w-5 h-5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Consultation Inquiry Form */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--ink-850)]/90 backdrop-blur-md border border-[var(--line)] flex-1 flex flex-col justify-between">
              {isSubmitted ? (
                <div className="py-8 space-y-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--ink-800)] border border-[var(--live)]/50 mx-auto flex items-center justify-center text-[var(--live)]">
                    <IoCheckmarkCircleOutline className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <div className="space-y-2 max-w-lg mx-auto">
                    <h3 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-[var(--paper)] uppercase">
                      {CONTACT_COPY.successTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--mist)] leading-relaxed">
                      {CONTACT_COPY.successMessage}
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-2.5 rounded-full bg-[var(--ink-800)] border border-[var(--line)] hover:border-[var(--cyan)] text-xs font-mono font-semibold uppercase tracking-wider text-[var(--paper)] transition-colors cursor-pointer"
                    >
                      {CONTACT_COPY.sendAnotherButton}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--paper)] block">
                      {CONTACT_COPY.formTitle}
                    </span>
                    <p className="text-xs text-[var(--mist-dim)] mt-1">
                      {CONTACT_COPY.formSubtitle}
                    </p>
                  </div>

                  {generalError && (
                    <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-2.5 text-xs text-red-200">
                      <IoAlertCircleOutline
                        className="w-4 h-4 shrink-0 text-red-400"
                        aria-hidden="true"
                      />
                      <span>{generalError}</span>
                    </div>
                  )}

                  {/* Name Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-[11px] font-mono uppercase tracking-wider text-[var(--mist)] block"
                    >
                      {CONTACT_FIELD_CONFIG.name.label} *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={values.name}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      onBlur={() => handleFieldBlur("name")}
                      placeholder={CONTACT_FIELD_CONFIG.name.placeholder}
                      className={`w-full px-4 py-2.5 rounded-xl bg-[var(--ink-900)] border text-xs sm:text-sm text-[var(--paper)] placeholder:text-[var(--mist-dim)]/50 focus:outline-none transition-colors ${
                        errors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-[var(--line)] focus:border-[var(--cyan)]"
                      }`}
                    />
                    {errors.name && (
                      <span className="text-[11px] text-red-400 block font-mono">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-[11px] font-mono uppercase tracking-wider text-[var(--mist)] block"
                    >
                      {CONTACT_FIELD_CONFIG.email.label} *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={values.email}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      onBlur={() => handleFieldBlur("email")}
                      placeholder={CONTACT_FIELD_CONFIG.email.placeholder}
                      className={`w-full px-4 py-2.5 rounded-xl bg-[var(--ink-900)] border text-xs sm:text-sm text-[var(--paper)] placeholder:text-[var(--mist-dim)]/50 focus:outline-none transition-colors ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-[var(--line)] focus:border-[var(--cyan)]"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-red-400 block font-mono">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-subject"
                      className="text-[11px] font-mono uppercase tracking-wider text-[var(--mist)] block"
                    >
                      {CONTACT_FIELD_CONFIG.subject.label}
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={values.subject}
                      onChange={(e) => handleFieldChange("subject", e.target.value)}
                      onBlur={() => handleFieldBlur("subject")}
                      placeholder={CONTACT_FIELD_CONFIG.subject.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--ink-900)] border border-[var(--line)] text-xs sm:text-sm text-[var(--paper)] placeholder:text-[var(--mist-dim)]/50 focus:outline-none focus:border-[var(--cyan)] transition-colors"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-message"
                      className="text-[11px] font-mono uppercase tracking-wider text-[var(--mist)] block"
                    >
                      {CONTACT_FIELD_CONFIG.message.label} *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={values.message}
                      onChange={(e) => handleFieldChange("message", e.target.value)}
                      onBlur={() => handleFieldBlur("message")}
                      placeholder={CONTACT_FIELD_CONFIG.message.placeholder}
                      className={`w-full px-4 py-2.5 rounded-xl bg-[var(--ink-900)] border text-xs sm:text-sm text-[var(--paper)] placeholder:text-[var(--mist-dim)]/50 focus:outline-none transition-colors resize-y ${
                        errors.message
                          ? "border-red-500 focus:border-red-500"
                          : "border-[var(--line)] focus:border-[var(--cyan)]"
                      }`}
                    />
                    {errors.message && (
                      <span className="text-[11px] text-red-400 block font-mono">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  {/* Submit Action */}
                  <div className="pt-4 border-t border-[var(--line-soft)] mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--amber)] text-[#06121a] font-bold text-xs sm:text-sm font-mono uppercase tracking-wider hover:bg-[var(--amber-deep)] active:translate-y-px transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 select-none border border-[var(--amber)]"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#06121a]/30 border-t-[#06121a] animate-spin" />
                          <span>{CONTACT_COPY.submittingText}</span>
                        </>
                      ) : (
                        <>
                          <span>{CONTACT_COPY.submitButtonText}</span>
                          <IoPaperPlaneOutline className="w-4 h-4" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
