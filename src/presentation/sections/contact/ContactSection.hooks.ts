// presentation/sections/contact/ContactSection.hooks.ts
// Form lifecycle, blur-only validation (zero debounce per Rule 4), and DI submission orchestration.
// Adheres strictly to Universal Separation of Concerns (Rule 13).

import type React from "react";
import { useCallback, useState } from "react";
import type { ISubmitContactFormUseCase } from "../../../application/use-cases/contact/SubmitContactFormUseCase";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { useSiteConfig } from "../../providers/site-config/useSiteConfig";
import { notificationService } from "../../shared/notifications/notification.service";
import { useContainer } from "../../shared/useContainer";
import type {
  ContactFormErrors,
  ContactFormValues,
  ContactSectionState,
} from "./ContactSection.types";

const INITIAL_VALUES: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field: keyof ContactFormValues, value: string): string | undefined {
  const trimmed = value.trim();
  switch (field) {
    case "name":
      if (!trimmed) return "Full name is required.";
      if (trimmed.length < 2) return "Name must be at least 2 characters.";
      return undefined;
    case "email":
      if (!trimmed) return "Business email is required.";
      if (!EMAIL_REGEX.test(trimmed)) return "Please enter a valid email address.";
      return undefined;
    case "message":
      if (!trimmed) return "Message is required.";
      if (trimmed.length < 10) return "Message must be at least 10 characters.";
      return undefined;
    default:
      return undefined;
  }
}

export function useContactSectionLogic(): ContactSectionState {
  const submitUseCase = useContainer<ISubmitContactFormUseCase>(DI_TOKENS.SubmitContactForm);

  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Field change updates state immediately with zero latency (NO debouncing)
  const handleFieldChange = useCallback((field: keyof ContactFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear error on edit if present
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // Validation strictly on blur per Rule 4
  const handleFieldBlur = useCallback(
    (field: keyof ContactFormValues) => {
      const err = validateField(field, values[field]);
      setErrors((prev) => ({ ...prev, [field]: err }));
    },
    [values]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setGeneralError(null);

      // Validate all fields on submit
      const nameErr = validateField("name", values.name);
      const emailErr = validateField("email", values.email);
      const messageErr = validateField("message", values.message);

      if (nameErr || emailErr || messageErr) {
        setErrors({
          name: nameErr,
          email: emailErr,
          message: messageErr,
        });
        return;
      }

      setIsSubmitting(true);

      try {
        await submitUseCase.execute({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim() || undefined,
          message: values.message.trim(),
          source: "contact-form",
        });

        notificationService.success(
          "Consultation inquiry dispatched successfully! Expect a direct technical reply within 24 hours."
        );
        setIsSubmitted(true);
        setValues(INITIAL_VALUES);
        setErrors({});
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Message dispatch failed. Please check your network or try direct email.";
        setGeneralError(msg);
        notificationService.error(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, submitUseCase]
  );

  const { siteSettings } = useSiteConfig();
  const linkedinUrl =
    siteSettings?.socialLinks?.find((s) => s.platform === "linkedin")?.url ||
    "https://linkedin.com/in/sachin-shakya0782";

  const contactInfo = {
    email: siteSettings?.email || "sachinshakya69@gmail.com",
    phone: siteSettings?.phone || "+91 99530 60735",
    linkedinUrl,
    locationUrl: "https://maps.google.com/?q=Faridabad,+Haryana+121005,+India",
    resumePdfUrl: siteSettings?.resumePdfUrl || "/Sachin_Shakya_Resume.pdf",
    photoUrl: siteSettings?.avatarUrl || "/assets/sachin-three.png",
    fullName: siteSettings?.fullName || "Sachin Shakya",
    headline: siteSettings?.headline || "Technical Lead — CloudOps",
  };

  const handleReset = useCallback(() => {
    setIsSubmitted(false);
    setGeneralError(null);
    setErrors({});
    setValues(INITIAL_VALUES);
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    isSubmitted,
    generalError,
    contactInfo,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    handleReset,
  };
}
