// presentation/admin/login/components/OtpInput.tsx
// Declarative 6-box OTP entry component with hairline styling and zero shadows.
// All interaction logic lives in OtpInput.hooks.ts.

import { OTP_COPY } from "../constants/otp.constants";
import { useOtpInput } from "./OtpInput.hooks";
import type { OtpInputProps } from "./OtpInput.types";

const OTP_SLOT_KEYS = [
  "otp-slot-1",
  "otp-slot-2",
  "otp-slot-3",
  "otp-slot-4",
  "otp-slot-5",
  "otp-slot-6",
] as const;

export function OtpInput(props: OtpInputProps) {
  const { value, disabled, hasError } = props;
  const { inputRefs, handleKeyDown, handleChange, handlePaste } = useOtpInput(props);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3.5 my-6" onPaste={handlePaste}>
      {OTP_SLOT_KEYS.map((slotKey, index) => {
        const digit = value[index] || "";
        const isFilled = Boolean(digit);

        return (
          <input
            key={slotKey}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            aria-label={`${OTP_COPY.OTP_INPUT_ARIA} ${index + 1}`}
            className={`w-11 h-13 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold tabular-nums rounded-xl outline-none transition-colors duration-150 ${
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"
            } ${
              hasError
                ? "border border-red-500/50 bg-red-950/20 text-red-200 focus:border-red-400"
                : isFilled
                  ? "border border-[var(--cyan)]/60 bg-[var(--ink-800)] text-[var(--paper)]"
                  : "border border-[var(--line)] bg-[var(--ink-800)] text-[var(--paper)] focus:border-[var(--amber)] focus:bg-[var(--ink-700)]"
            }`}
          />
        );
      })}
    </div>
  );
}
