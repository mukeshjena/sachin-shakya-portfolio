// presentation/admin/login/components/OtpInput.types.ts
// Interfaces and types for the 6-box OtpInput component.
// Pure types — zero framework imports or JSX markup.

import type React from "react";

export interface OtpInputProps {
  readonly value: string[];
  readonly onChange: (digits: string[]) => void;
  readonly onComplete: (code: string) => void;
  readonly disabled?: boolean;
  readonly hasError?: boolean;
}

export interface OtpInputViewModel {
  readonly inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  readonly handleKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  readonly handleChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}
