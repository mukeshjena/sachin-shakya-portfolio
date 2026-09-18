// presentation/admin/login/AdminLogin.tsx
// Executive OTP Authentication Terminal.
// Flat instrument panel layout with hairline boundaries and zero shadows.
// All state and DI use-cases live in AdminLogin.hooks.ts (Rule 13).

import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoKeyOutline,
  IoMailOutline,
  IoRefreshOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { DashboardShell } from "../dashboard/DashboardShell";
import { useAdminLogin } from "./AdminLogin.hooks";
import { OtpInput } from "./components/OtpInput";
import { OTP_COPY } from "./constants/otp.constants";

export function AdminLogin() {
  const {
    step,
    email,
    otpDigits,
    cooldown,
    isLoading,
    errorMessage,
    handleEmailChange,
    handleEmailSubmit,
    handleOtpChange,
    handleOtpComplete,
    handleOtpSubmit,
    handleResendCode,
    handleChangeEmail,
  } = useAdminLogin();

  if (step === "authenticated") {
    return <DashboardShell />;
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-[var(--ink-850)] border border-[var(--line)] rounded-2xl p-6 sm:p-8">
        {/* Terminal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ink-800)] border border-[var(--line)] text-[10px] font-mono uppercase tracking-widest text-[var(--amber)] mb-3">
            <IoShieldCheckmarkOutline
              className="w-3.5 h-3.5 text-[var(--amber)]"
              aria-hidden="true"
            />
            <span>{OTP_COPY.BADGE}</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-[var(--paper)]">
            {OTP_COPY.TITLE}
          </h2>
          <p className="mt-1.5 text-xs text-[var(--mist)] leading-relaxed">{OTP_COPY.SUBTITLE}</p>
        </div>

        {/* Inline Error Telemetry */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono leading-relaxed">
            {errorMessage}
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-[11px] font-mono uppercase tracking-wider text-[var(--mist-dim)] mb-1.5"
              >
                {OTP_COPY.EMAIL_LABEL} <span className="text-[var(--amber)]">*</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--mist-dim)]">
                  <IoMailOutline className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder={OTP_COPY.EMAIL_PLACEHOLDER}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] text-sm text-[var(--paper)] placeholder-[var(--mist-dim)]/50 border border-[var(--line)] outline-none focus:border-[var(--amber)] transition-colors"
                />
              </div>
              <p className="mt-1.5 text-[10px] font-mono text-[var(--mist-dim)]">
                {OTP_COPY.ROOT_HINT}
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--amber)] hover:bg-[var(--amber-deep)] text-[var(--ink-900)] text-xs font-mono font-semibold tracking-wide transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <span>{isLoading ? OTP_COPY.EMAIL_SUBMITTING : OTP_COPY.EMAIL_SUBMIT_BUTTON}</span>
              <IoArrowForwardOutline className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        )}

        {/* Step 2: 6-Box OTP Verification */}
        {step === "otp" && (
          <div>
            <div className="p-3 bg-[var(--ink-900)] border border-[var(--line)] rounded-xl mb-4 text-center">
              <div className="text-[11px] font-mono text-[var(--mist-dim)] uppercase tracking-wider">
                Verification Code Sent To:
              </div>
              <div className="text-xs font-mono font-semibold text-[var(--cyan)] mt-0.5">
                {email}
              </div>
            </div>

            <OtpInput
              value={otpDigits}
              onChange={handleOtpChange}
              onComplete={handleOtpComplete}
              disabled={isLoading}
              hasError={Boolean(errorMessage)}
            />

            <button
              type="button"
              onClick={handleOtpSubmit}
              disabled={isLoading || otpDigits.some((d) => !d)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--amber)] hover:bg-[var(--amber-deep)] text-[var(--ink-900)] text-xs font-mono font-semibold tracking-wide transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoKeyOutline className="w-4 h-4" aria-hidden="true" />
              <span>{isLoading ? OTP_COPY.VERIFYING : OTP_COPY.VERIFY_BUTTON}</span>
            </button>

            {/* Sub-actions */}
            <div className="mt-5 flex items-center justify-between text-xs font-mono">
              <button
                type="button"
                onClick={handleChangeEmail}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-[var(--mist-dim)] hover:text-[var(--mist)] transition-colors cursor-pointer"
              >
                <IoArrowBackOutline className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{OTP_COPY.BACK_BUTTON}</span>
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={cooldown > 0 || isLoading}
                className={`inline-flex items-center gap-1.5 transition-colors ${
                  cooldown > 0
                    ? "text-[var(--mist-dim)] cursor-not-allowed"
                    : "text-[var(--cyan)] hover:text-[var(--paper)] cursor-pointer"
                }`}
              >
                <IoRefreshOutline
                  className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                <span>
                  {cooldown > 0
                    ? `${OTP_COPY.RESEND_COOLDOWN_PREFIX} ${cooldown}s`
                    : OTP_COPY.RESEND_BUTTON}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
