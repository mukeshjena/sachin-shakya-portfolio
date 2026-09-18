// presentation/promo/PromoPopupModal.tsx
// Consultative Cloud Architecture Review Promo Popup.
// Split-panel desktop layout and sleek mobile sheet.
// Strictly shadow-free (Rule 12), emoji-free, and zero debounced inputs.

import {
  IoArrowForwardOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { CONSULTATION_INTEREST_OPTIONS, PROMO_COPY } from "./constants/promo.constants";
import { usePromoPopupModal } from "./PromoPopupModal.hooks";

export function PromoPopupModal() {
  const {
    isOpen,
    status,
    errorMessage,
    values,
    errors,
    promoConfig,
    handleClose,
    handleChange,
    handleBlur,
    handleSubmit,
  } = usePromoPopupModal();

  if (!isOpen) {
    return null;
  }

  const badgeText = promoConfig?.badgeText || PROMO_COPY.DEFAULT_BADGE;
  const headingText = promoConfig?.heading || PROMO_COPY.DEFAULT_HEADING;
  const subheadingText = promoConfig?.subheading || PROMO_COPY.DEFAULT_SUBHEADING;
  const ctaText = promoConfig?.ctaText || PROMO_COPY.CTA_BUTTON;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      {/* Backdrop click interceptor */}
      <button
        type="button"
        aria-label={PROMO_COPY.CLOSE_ARIA}
        onClick={handleClose}
        className="absolute inset-0 w-full h-full cursor-default bg-transparent border-0"
      />

      {/* Main Dialog Surface */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto md:overflow-visible bg-[var(--ink-850)] border border-[var(--line)] rounded-2xl flex flex-col md:flex-row">
        {/* Close Button (Affordance) */}
        <button
          type="button"
          aria-label={PROMO_COPY.CLOSE_ARIA}
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-lg text-[var(--mist-dim)] hover:text-[var(--paper)] bg-[var(--ink-800)] hover:bg-[var(--ink-700)] border border-[var(--line)] transition-colors cursor-pointer"
        >
          <IoCloseOutline className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Left Column: Sachin's Portrait & Verification Telemetry (Desktop Only) */}
        <div className="hidden md:flex flex-col justify-between w-5/12 relative overflow-hidden bg-[var(--ink-900)] border-r border-[var(--line)] rounded-l-2xl min-h-[480px]">
          {/* Background Portrait */}
          <img
            src="/assets/sachin-two.png"
            alt="Sachin Shakya — Technical Lead — CloudOps"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink-900)] via-[var(--ink-900)]/40 to-[var(--ink-900)]/60" />

          {/* Top Pill */}
          <div className="relative z-10 p-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ink-900)]/80 backdrop-blur-md border border-[var(--line)] text-[10px] font-mono uppercase tracking-widest text-[var(--amber)]">
              <IoShieldCheckmarkOutline
                className="w-3.5 h-3.5 text-[var(--amber)]"
                aria-hidden="true"
              />
              <span>{badgeText}</span>
            </div>
          </div>

          {/* Bottom Telemetry Card Overlay */}
          <div className="relative z-10 p-6 space-y-3">
            <div className="p-4 rounded-xl bg-[var(--ink-900)]/90 backdrop-blur-md border border-[var(--line)] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--paper)]">Sachin Shakya</span>
                <span className="w-2 h-2 rounded-full bg-[var(--live)]" aria-hidden="true" />
              </div>
              <div className="text-[11px] font-mono text-[var(--cyan)]">
                Technical Lead — CloudOps
              </div>
              <div className="pt-2 border-t border-[var(--line-soft)] flex items-center justify-between text-[10px] font-mono">
                <span className="text-[var(--mist-dim)]">VERIFIED IMPACT</span>
                <span className="text-[var(--amber)] font-bold tabular-nums">$170K/MO SAVED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Consultation Desk */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
          {status === "success" ? (
            <div className="py-8 text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--live)]/10 border border-[var(--live)]/30 text-[var(--live)] mb-4">
                <IoCheckmarkCircleOutline className="w-8 h-8" aria-hidden="true" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-[var(--ink-800)] border border-[var(--line)] text-[10px] font-mono uppercase tracking-widest text-[var(--live)] mb-2">
                {PROMO_COPY.SUCCESS_BADGE}
              </div>
              <h4 className="text-xl font-bold tracking-tight text-[var(--paper)]">
                {PROMO_COPY.SUCCESS_TITLE}
              </h4>
              <p className="mt-3 text-xs text-[var(--mist)] max-w-md mx-auto leading-relaxed">
                {PROMO_COPY.SUCCESS_MESSAGE}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-[var(--ink-700)] hover:bg-[var(--ink-600)] text-[var(--paper)] text-xs font-mono font-medium border border-[var(--line)] transition-colors cursor-pointer"
                >
                  Return to Portfolio
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="md:hidden inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[var(--ink-800)] border border-[var(--line)] text-[10px] font-mono uppercase tracking-widest text-[var(--amber)] mb-3">
                <IoShieldCheckmarkOutline
                  className="w-3 h-3 text-[var(--amber)]"
                  aria-hidden="true"
                />
                <span>{badgeText}</span>
              </div>

              <h3
                id="promo-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--paper)]"
              >
                {headingText}
              </h3>
              <p className="mt-2 text-xs text-[var(--mist)] leading-relaxed">{subheadingText}</p>

              {errorMessage && (
                <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {/* Full Name Field */}
                <div>
                  <label
                    htmlFor="promo-name"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1.5"
                  >
                    {PROMO_COPY.NAME_LABEL} <span className="text-[var(--amber)]">*</span>
                  </label>
                  <input
                    id="promo-name"
                    type="text"
                    required
                    value={values.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    placeholder={PROMO_COPY.NAME_PLACEHOLDER}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] text-sm text-[var(--paper)] placeholder-[var(--mist-dim)]/50 border transition-colors outline-none focus:border-[var(--amber)] ${
                      errors.name ? "border-red-500/50" : "border-[var(--line)]"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-[11px] font-mono text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="promo-email"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1.5"
                  >
                    {PROMO_COPY.EMAIL_LABEL} <span className="text-[var(--amber)]">*</span>
                  </label>
                  <input
                    id="promo-email"
                    type="email"
                    required
                    value={values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder={PROMO_COPY.EMAIL_PLACEHOLDER}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] text-sm text-[var(--paper)] placeholder-[var(--mist-dim)]/50 border transition-colors outline-none focus:border-[var(--amber)] ${
                      errors.email ? "border-red-500/50" : "border-[var(--line)]"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-[11px] font-mono text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Consultation Focus Selector */}
                <div>
                  <label
                    htmlFor="promo-interest"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1.5"
                  >
                    {PROMO_COPY.FOCUS_LABEL}
                  </label>
                  <select
                    id="promo-interest"
                    value={values.interestArea}
                    onChange={(e) => handleChange("interestArea", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] text-xs text-[var(--paper)] border border-[var(--line)] outline-none focus:border-[var(--amber)] transition-colors cursor-pointer"
                  >
                    {CONSULTATION_INTEREST_OPTIONS.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="bg-[var(--ink-900)] text-[var(--paper)]"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Message / Scope Field */}
                <div>
                  <label
                    htmlFor="promo-message"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1.5"
                  >
                    {PROMO_COPY.MESSAGE_LABEL}
                  </label>
                  <textarea
                    id="promo-message"
                    rows={2}
                    value={values.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder={PROMO_COPY.MESSAGE_PLACEHOLDER}
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--ink-800)] text-xs text-[var(--paper)] placeholder-[var(--mist-dim)]/50 border border-[var(--line)] outline-none focus:border-[var(--amber)] transition-colors resize-none"
                  />
                </div>

                {/* Action Controls */}
                <div className="pt-2 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-xs font-mono text-[var(--mist-dim)] hover:text-[var(--mist)] transition-colors cursor-pointer"
                  >
                    {PROMO_COPY.DISMISS_BUTTON}
                  </button>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--amber)] hover:bg-[var(--amber-deep)] text-[#06121a] text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--amber)] select-none"
                  >
                    <span>{status === "submitting" ? PROMO_COPY.SUBMITTING : ctaText}</span>
                    <IoArrowForwardOutline className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
