// presentation/promo/PromoPopupModal.hooks.ts
// Custom hook managing PromoPopupModal state, lifecycle, validation, and DI container integration.
// Strictly zero debounced inputs (Rule 4 / Rule 12): validate on blur and submit only.

import { useCallback, useEffect, useRef, useState } from "react";
import type { PromoPopupDTO } from "../../application/dto/promo/PromoPopupDTO";
import type { IGetPromoPopupUseCase } from "../../application/use-cases/promo/GetPromoPopupUseCase";
import type { ISubmitPromoInquiryUseCase } from "../../application/use-cases/promo/SubmitPromoInquiryUseCase";
import { DI_TOKENS } from "../../infrastructure/di/tokens";
import { notificationService } from "../shared/notifications/notification.service";
import { useContainer } from "../shared/useContainer";
import {
  CONSULTATION_INTEREST_OPTIONS,
  PROMO_DEFAULTS,
  PROMO_STORAGE_KEYS,
} from "./constants/promo.constants";
import type {
  PromoFormErrors,
  PromoFormValues,
  PromoModalStatus,
  PromoModalViewModel,
} from "./PromoPopupModal.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_VALUES: PromoFormValues = {
  name: "",
  email: "",
  interestArea: CONSULTATION_INTEREST_OPTIONS[0].value,
  message: "",
};

export function usePromoPopupModal(): PromoModalViewModel {
  const getPromoPopup = useContainer<IGetPromoPopupUseCase>(DI_TOKENS.GetPromoPopup);
  const submitPromoInquiry = useContainer<ISubmitPromoInquiryUseCase>(DI_TOKENS.SubmitPromoInquiry);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [promoConfig, setPromoConfig] = useState<PromoPopupDTO | null>(null);
  const [status, setStatus] = useState<PromoModalStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [values, setValues] = useState<PromoFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<PromoFormErrors>({});
  const [_touched, setTouched] = useState<Record<keyof PromoFormValues, boolean>>({
    name: false,
    email: false,
    interestArea: false,
    message: false,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Dwell time activation & Session Frequency Guard
  useEffect(() => {
    let isMounted = true;

    async function loadConfigAndSchedule() {
      try {
        const config = await getPromoPopup.execute();
        if (!isMounted || !config?.isEnabled) {
          return;
        }

        setPromoConfig(config);

        // If configured for 'session', check if already dismissed or submitted
        const isSessionOnly = config.frequency !== "always";
        if (isSessionOnly) {
          try {
            const isDismissed = sessionStorage.getItem(PROMO_STORAGE_KEYS.DISMISSED_SESSION);
            const isSubmitted = sessionStorage.getItem(PROMO_STORAGE_KEYS.SUBMITTED_SESSION);
            if (isDismissed || isSubmitted) {
              return;
            }
          } catch {
            // In private browsing, proceed safely
          }
        }

        const delaySeconds =
          typeof config.displayDelaySeconds === "number" && config.displayDelaySeconds >= 0
            ? config.displayDelaySeconds
            : PROMO_DEFAULTS.FALLBACK_DELAY_SECONDS;

        timerRef.current = setTimeout(() => {
          if (!isMounted) return;
          if (isSessionOnly) {
            try {
              const dismissed = sessionStorage.getItem(PROMO_STORAGE_KEYS.DISMISSED_SESSION);
              const submitted = sessionStorage.getItem(PROMO_STORAGE_KEYS.SUBMITTED_SESSION);
              if (!dismissed && !submitted) {
                setIsOpen(true);
              }
            } catch {
              setIsOpen(true);
            }
          } else {
            setIsOpen(true);
          }
        }, delaySeconds * 1000);
      } catch (err) {
        console.warn("[usePromoPopupModal] Unable to load promo configuration:", err);
      }
    }

    loadConfigAndSchedule();

    return () => {
      isMounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    };
  }, [getPromoPopup]);

  // 2. Dismiss handler (persists session dismissal if session mode)
  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (promoConfig?.frequency !== "always") {
      try {
        sessionStorage.setItem(PROMO_STORAGE_KEYS.DISMISSED_SESSION, "true");
      } catch {
        // safe fallback
      }
    }
  }, [promoConfig?.frequency]);

  // 3. Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // 4. Input change handler — zero debounce (immediate state update)
  const handleChange = useCallback((field: keyof PromoFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  // 5. Blur validation (Rule 4 / Rule 12: strictly on blur and on submit)
  const validateField = useCallback(
    (field: keyof PromoFormValues, currentValues: PromoFormValues): string | undefined => {
      if (field === "name") {
        if (currentValues.name.trim().length < 2) {
          return "Full name must be at least 2 characters.";
        }
      }
      if (field === "email") {
        if (!EMAIL_REGEX.test(currentValues.email.trim())) {
          return "Please enter a valid corporate or personal email.";
        }
      }
      return undefined;
    },
    []
  );

  const handleBlur = useCallback(
    (field: keyof PromoFormValues) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field, values);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [validateField, values]
  );

  // 6. Submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const nameError = validateField("name", values);
      const emailError = validateField("email", values);

      if (nameError || emailError) {
        setTouched({ name: true, email: true, interestArea: true, message: true });
        setErrors({ name: nameError, email: emailError });
        return;
      }

      setStatus("submitting");
      setErrorMessage(null);

      try {
        await submitPromoInquiry.execute({
          name: values.name,
          email: values.email,
          interestArea: values.interestArea,
          message: values.message,
        });

        notificationService.success(
          "Consultation inquiry received! Expect a direct response within 24 hours."
        );
        setStatus("success");
        try {
          sessionStorage.setItem(PROMO_STORAGE_KEYS.SUBMITTED_SESSION, "true");
        } catch {
          // safe fallback
        }

        // Auto close after brief success confirmation window
        autoCloseTimerRef.current = setTimeout(() => {
          setIsOpen(false);
        }, PROMO_DEFAULTS.AUTO_CLOSE_SUCCESS_MS);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Unable to submit your inquiry at this moment. Please reach out via sachinshakya69@gmail.com.";
        setStatus("error");
        setErrorMessage(msg);
        notificationService.error(msg);
      }
    },
    [submitPromoInquiry, validateField, values]
  );

  return {
    isOpen,
    status,
    errorMessage,
    values,
    errors,
    promoConfig,
    handleClose,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
