// presentation/sections/contact/ContactSection.types.ts
// Type definitions for the contact section view state, inputs, and validation errors.
// Universal Separation of Concerns (Rule 13).

import type React from "react";

export interface ContactFormValues {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
}

export interface ContactFormErrors {
  readonly name?: string;
  readonly email?: string;
  readonly subject?: string;
  readonly message?: string;
  readonly general?: string;
}

export interface ContactInfo {
  readonly email: string;
  readonly phone: string;
  readonly linkedinUrl: string;
  readonly locationUrl: string;
  readonly resumePdfUrl: string;
  readonly photoUrl: string;
  readonly fullName: string;
  readonly headline: string;
}

export interface ContactSectionState {
  readonly values: ContactFormValues;
  readonly errors: ContactFormErrors;
  readonly isSubmitting: boolean;
  readonly isSubmitted: boolean;
  readonly generalError: string | null;
  readonly contactInfo: ContactInfo;
  readonly handleFieldChange: (field: keyof ContactFormValues, value: string) => void;
  readonly handleFieldBlur: (field: keyof ContactFormValues) => void;
  readonly handleSubmit: (e: React.FormEvent) => void;
  readonly handleReset: () => void;
}
