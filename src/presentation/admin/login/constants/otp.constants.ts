// presentation/admin/login/constants/otp.constants.ts
// Static copy, aria labels, and timing constants for the Admin OTP login flow.
// Zero JSX or business logic (Universal Separation of Concerns — Rule 13).

export const OTP_CONFIG = {
  CODE_LENGTH: 6,
  COOLDOWN_SECONDS: 60,
  AUTO_SUBMIT_DELAY_MS: 300,
} as const;

export const OTP_COPY = {
  TITLE: "Mission Control // Access Terminal",
  SUBTITLE: "Zero-password cryptographic entry for authorized platform administrators.",
  BADGE: "RESTRICTED ACCESS LEVEL 0",
  EMAIL_STEP_HEADING: "Request Verification Key",
  EMAIL_STEP_DESC:
    "Enter your authorized administrator email to receive a single-use 6-digit access code.",
  EMAIL_LABEL: "Administrator Email",
  EMAIL_PLACEHOLDER: "sachin.shakya@live.com",
  EMAIL_SUBMIT_BUTTON: "Generate Access Key",
  EMAIL_SUBMITTING: "Transmitting Security Token...",
  OTP_STEP_HEADING: "Verify Access Key",
  OTP_STEP_DESC: "Enter the 6-digit verification key dispatched to your administrator inbox.",
  OTP_INPUT_ARIA: "Digit",
  VERIFY_BUTTON: "Authenticate Session",
  VERIFYING: "Verifying Cryptographic Hash...",
  RESEND_BUTTON: "Request New Code",
  RESEND_COOLDOWN_PREFIX: "Request new code in",
  BACK_BUTTON: "Change Email Address",
  SUCCESS_BADGE: "SESSION AUTHENTICATED",
  SUCCESS_HEADING: "Access Granted",
  SUCCESS_DESC: "Cryptographic credentials verified. Redirecting to executive control panel...",
  ROOT_HINT: "Authorized root: sachin.shakya@live.com",
} as const;
