// presentation/admin/login/AdminLogin.hooks.ts
// Hook coordinating AdminLogin states, 60s cooldown timer, code generation, and verification.
// Resolves RequestAccessCodeUseCase via useContainer and AuthContext.login().

import { useCallback, useEffect, useRef, useState } from "react";
import type { IRequestAccessCodeUseCase } from "../../../application/use-cases/auth/RequestAccessCodeUseCase";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { useAuth } from "../../providers/auth/useAuth";
import { useContainer } from "../../shared/useContainer";
import type { AdminLoginStep, AdminLoginViewModel } from "./AdminLogin.types";
import { OTP_CONFIG } from "./constants/otp.constants";

const EMPTY_DIGITS = Array.from({ length: OTP_CONFIG.CODE_LENGTH }, () => "");

export function useAdminLogin(): AdminLoginViewModel {
  const requestAccessCode = useContainer<IRequestAccessCodeUseCase>(DI_TOKENS.RequestAccessCode);
  const { login, isAuthenticated } = useAuth();

  const [step, setStep] = useState<AdminLoginStep>(() =>
    isAuthenticated ? "authenticated" : "email"
  );
  const [email, setEmail] = useState<string>("");
  const [otpDigits, setOtpDigits] = useState<string[]>(EMPTY_DIGITS);
  const [cooldown, setCooldown] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync authenticated status
  useEffect(() => {
    if (isAuthenticated) {
      setStep("authenticated");
    }
  }, [isAuthenticated]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      cooldownTimerRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, [cooldown]);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setErrorMessage(null);
  }, []);

  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = email.trim();
      if (!trimmed) {
        setErrorMessage("Please enter your administrator email address.");
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const result = await requestAccessCode.execute({ email: trimmed });
        setStep("otp");
        setCooldown(result.cooldownSeconds);
        setOtpDigits(EMPTY_DIGITS);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Failed to generate access code. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [email, requestAccessCode]
  );

  const handleOtpChange = useCallback((digits: string[]) => {
    setOtpDigits(digits);
    setErrorMessage(null);
  }, []);

  const verifyCode = useCallback(
    async (codeToVerify: string) => {
      if (codeToVerify.length !== OTP_CONFIG.CODE_LENGTH) {
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const success = await login(email.trim(), codeToVerify);
        if (success) {
          setStep("authenticated");
        } else {
          setErrorMessage("Verification failed. Please check the 6 digits and try again.");
        }
      } catch (err) {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Verification rejected. Code may be invalid or expired."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [email, login]
  );

  const handleOtpComplete = useCallback(
    (code: string) => {
      setTimeout(() => {
        verifyCode(code);
      }, OTP_CONFIG.AUTO_SUBMIT_DELAY_MS);
    },
    [verifyCode]
  );

  const handleOtpSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const code = otpDigits.join("");
      verifyCode(code);
    },
    [otpDigits, verifyCode]
  );

  const handleResendCode = useCallback(async () => {
    if (cooldown > 0 || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await requestAccessCode.execute({ email: email.trim() });
      setCooldown(result.cooldownSeconds);
      setOtpDigits(EMPTY_DIGITS);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to resend access code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [cooldown, email, isLoading, requestAccessCode]);

  const handleChangeEmail = useCallback(() => {
    setStep("email");
    setOtpDigits(EMPTY_DIGITS);
    setErrorMessage(null);
  }, []);

  return {
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
  };
}
