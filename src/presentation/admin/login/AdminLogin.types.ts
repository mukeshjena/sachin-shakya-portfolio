// presentation/admin/login/AdminLogin.types.ts
// Types and view model interface for the AdminLogin component.
// Pure TypeScript — zero framework or JSX markup.

import type React from "react";

export type AdminLoginStep = "email" | "otp" | "authenticated";

export interface AdminLoginViewModel {
  readonly step: AdminLoginStep;
  readonly email: string;
  readonly otpDigits: string[];
  readonly cooldown: number;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly currentUserEmail: string | null;
  readonly handleEmailChange: (value: string) => void;
  readonly handleEmailSubmit: (e: React.FormEvent) => void;
  readonly handleOtpChange: (digits: string[]) => void;
  readonly handleOtpComplete: (code: string) => void;
  readonly handleOtpSubmit: (e?: React.FormEvent) => void;
  readonly handleResendCode: () => void;
  readonly handleChangeEmail: () => void;
  readonly handleLogout: () => void;
}
