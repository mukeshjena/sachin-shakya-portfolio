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
  IoShieldCheckmarkOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { useContactSectionLogic } from "./ContactSection.hooks";
import {
  CONTACT_COPY,
  CONTACT_DIRECT_CHANNELS,
  CONTACT_FIELD_CONFIG,
} from "./constants/contact.constants";

export function ContactSection() {
  const {
    values,
    errors,
    isSubmitting,
    isSubmitted,
    generalError,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    handleReset,
  } = useContactSectionLogic();

  return (
    <section
      id="contact"
      aria-label="Executive Consultation Desk"
      className="relative w-full py-20 md:py-28 bg-[var(--ink-900)] border-t border-[var(--line)] scroll-mt-20 overflow-hidden"
    >
      {/* Background Subtle Hairline Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(130,180,200,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(130,180,200,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--ink-850)] border border-[var(--line)] select-none">
            <span className="w-2 h-2 rounded-full bg-[var(--live)]" aria-hidden="true" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--live)] font-semibold">
              {CONTACT_COPY.eyebrow}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--paper)] leading-tight">
            {CONTACT_COPY.headline}
          </h2>

          <p className="text-sm sm:text-base text-[var(--mist)] leading-relaxed font-sans">
            {CONTACT_COPY.subheadline}
          </p>
        </div>

        {/* 2-Column Command Desk Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (5 cols): Executive Portrait & Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--ink-850)]/90 backdrop-blur-md">
              {/* Sachin Shakya Portrait */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[var(--ink-900)]">
                <img
                  src="/assets/sachin-three.png"
                  alt="Sachin Shakya — Technical Lead — CloudOps"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink-850)] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--ink-900)]/90 backdrop-blur-md border border-[var(--line)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--live)]" aria-hidden="true" />
                    <span className="text-[10px] font-mono text-[var(--live)] font-semibold uppercase tracking-wider">
                      AVAILABLE FOR ADVISORY
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--amber)] bg-[var(--ink-900)]/90 px-2 py-0.5 rounded border border-[var(--line)] font-bold">
                    ~9 YRS EXP
                  </span>
                </div>
              </div>

              {/* Direct Details & Channels */}
              <div className="p-6 space-y-5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--mist-dim)] block">
                    {CONTACT_COPY.directChannelsHeader}
                  </span>
                  <h3 className="text-lg font-bold text-[var(--paper)] mt-0.5">Sachin Shakya</h3>
                  <p className="text-xs text-[var(--cyan)] font-mono">Technical Lead — CloudOps</p>
                </div>

                {/* Direct Channels Cards */}
                <div className="space-y-2.5">
                  {CONTACT_DIRECT_CHANNELS.map((channel) => (
                    <a
                      key={channel.id}
                      href={channel.href}
                      target={channel.href.startsWith("http") ? "_blank" : undefined}
                      rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="p-3 rounded-xl bg-[var(--ink-800)]/80 border border-[var(--line)] hover:border-[var(--cyan)] hover:bg-[var(--ink-800)] transition-colors flex items-start gap-3 group cursor-pointer block"
                    >
                      <span className="w-8 h-8 rounded-lg bg-[var(--ink-700)] border border-[var(--line)] flex items-center justify-center text-[var(--cyan)] shrink-0 group-hover:border-[var(--cyan)] transition-colors">
                        {channel.id === "email" && (
                          <IoMailOutline className="w-4 h-4" aria-hidden="true" />
                        )}
                        {channel.id === "phone" && (
                          <IoCallOutline className="w-4 h-4" aria-hidden="true" />
                        )}
                        {channel.id === "linkedin" && (
                          <IoLogoLinkedin className="w-4 h-4" aria-hidden="true" />
                        )}
                        {channel.id === "location" && (
                          <IoLocationOutline className="w-4 h-4" aria-hidden="true" />
                        )}
                      </span>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--mist-dim)] block">
                          {channel.label}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-[var(--paper)] group-hover:text-[var(--cyan)] transition-colors block truncate">
                          {channel.value}
                        </span>
                        <span className="text-[10px] text-[var(--mist-dim)] block leading-snug">
                          {channel.caption}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Download Résumé Action */}
                <a
                  href="/Sachin_Shakya_Resume.pdf"
                  download
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] hover:border-[var(--amber)] text-[var(--paper)] hover:text-[var(--amber)] text-xs font-mono font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
                >
                  <IoDocumentTextOutline
                    className="w-4 h-4 text-[var(--amber)]"
                    aria-hidden="true"
                  />
                  <span>Download Verified Résumé (PDF)</span>
                </a>

                {/* SLA & Security Beacon */}
                <div className="pt-2 border-t border-[var(--line-soft)] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--amber)]">
                    <IoTimeOutline className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="text-[10px] tracking-wider uppercase font-semibold">
                      {CONTACT_COPY.responseSla}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--mist-dim)]">
                    <IoShieldCheckmarkOutline
                      className="w-3.5 h-3.5 text-[var(--live)] shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-[10px] tracking-wider uppercase">
                      CONFIDENTIAL {"//"} DIRECT ARCHITECT HANDSHAKE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Consultation Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--ink-850)]/90 backdrop-blur-md border border-[var(--line)]">
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
