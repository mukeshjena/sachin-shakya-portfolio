// presentation/admin/login/components/OtpInput.hooks.ts
// Hook managing individual box focus, auto-advance, backspace retreat, and clipboard paste splitting.
// Pure React hook without JSX.

import { useCallback, useEffect, useRef } from "react";
import { OTP_CONFIG } from "../constants/otp.constants";
import type { OtpInputProps, OtpInputViewModel } from "./OtpInput.types";

export function useOtpInput({
  value,
  onChange,
  onComplete,
  disabled,
}: OtpInputProps): OtpInputViewModel {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first box on mount if not disabled
  useEffect(() => {
    if (!disabled && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      if (!raw && e.target.value) {
        return; // Non-digit input ignored
      }

      const digit = raw.slice(-1); // Take latest digit entered
      const next = [...value];
      next[index] = digit;
      onChange(next);

      if (digit && index < OTP_CONFIG.CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // If all slots are filled, trigger completion callback
      if (next.every((d) => Boolean(d) && d.length === 1)) {
        onComplete(next.join(""));
      }
    },
    [value, onChange, onComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (!value[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < OTP_CONFIG.CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [value]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, OTP_CONFIG.CODE_LENGTH);
      if (!pasted) return;

      const next = [...value];
      for (let i = 0; i < OTP_CONFIG.CODE_LENGTH; i++) {
        next[i] = pasted[i] || "";
      }
      onChange(next);

      const nextFocusIndex = Math.min(pasted.length, OTP_CONFIG.CODE_LENGTH - 1);
      inputRefs.current[nextFocusIndex]?.focus();

      if (pasted.length === OTP_CONFIG.CODE_LENGTH) {
        onComplete(pasted);
      }
    },
    [value, onChange, onComplete]
  );

  return {
    inputRefs,
    handleKeyDown,
    handleChange,
    handlePaste,
  };
}
