// presentation/shared/select/Select.types.ts
// Type definitions for the high-prestige Searchable Combobox & Select component.
// Strictly adheres to Clean Architecture presentation layer and shadow-free surface rules.

import type React from "react";

export interface SelectOption {
  readonly value: string | number;
  readonly label: string;
  readonly disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  readonly label?: string;
  readonly error?: string;
  readonly helperText?: string;
  readonly options?: readonly SelectOption[];
  readonly containerClassName?: string;
  readonly allowCustom?: boolean;
  readonly customPlaceholder?: string;
  readonly onCustomValueChange?: (val: string) => void;
  readonly value?: string | number | readonly string[];
  readonly onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  readonly children?: React.ReactNode;
}
