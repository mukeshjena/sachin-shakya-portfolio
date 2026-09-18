// presentation/promo/PromoPopupModal.types.ts
// Strict TypeScript types for the PromoPopupModal component.
// Pure interfaces and types — zero framework or JSX markup.

import type React from "react";
import type { PromoPopupDTO } from "../../application/dto/promo/PromoPopupDTO";

export interface PromoFormValues {
  readonly name: string;
  readonly email: string;
  readonly interestArea: string;
  readonly message: string;
}

export interface PromoFormErrors {
  readonly name?: string;
  readonly email?: string;
  readonly general?: string;
}

export type PromoModalStatus = "idle" | "submitting" | "success" | "error";

export interface PromoModalViewModel {
  readonly isOpen: boolean;
  readonly status: PromoModalStatus;
  readonly errorMessage: string | null;
  readonly values: PromoFormValues;
  readonly errors: PromoFormErrors;
  readonly promoConfig: PromoPopupDTO | null;
  readonly handleClose: () => void;
  readonly handleChange: (field: keyof PromoFormValues, value: string) => void;
  readonly handleBlur: (field: keyof PromoFormValues) => void;
  readonly handleSubmit: (e: React.FormEvent) => void;
}
