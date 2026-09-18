// presentation/admin/content/promo/PromoPopupEditor.hooks.ts
// Hook managing PromoPopupEditor state, Firestore mutation, and Notyf notification feedback.
// Universal Separation of Concerns (Rule 13) — zero JSX markup or styling.

import { useCallback, useEffect, useState } from "react";
import type { IGetPromoPopupUseCase } from "../../../../application/use-cases/promo/GetPromoPopupUseCase";
import type { IUpdatePromoPopupUseCase } from "../../../../application/use-cases/promo/UpdatePromoPopupUseCase";
import { DI_TOKENS } from "../../../../infrastructure/di/tokens";
import { notificationService } from "../../../shared/notifications/notification.service";
import { useContainer } from "../../../shared/useContainer";
import type { PromoPopupEditorViewModel, PromoPopupFormState } from "./PromoPopupEditor.types";

const DEFAULT_PROMO_STATE: PromoPopupFormState = {
  isEnabled: true,
  heading: "Accelerate Your Cloud Architecture",
  subheading:
    "Book a confidential 30-minute infrastructure audit with Sachin Shakya. We will analyze your monthly cloud bill, MTTR metrics, and automation potential.",
  badgeText: "Direct CloudOps Advisory",
  ctaText: "Request Architecture Audit",
  displayDelaySeconds: 5,
  frequency: "session",
};

export function usePromoPopupEditor(): PromoPopupEditorViewModel {
  const getPromoPopup = useContainer<IGetPromoPopupUseCase>(DI_TOKENS.GetPromoPopup);
  const updatePromoPopup = useContainer<IUpdatePromoPopupUseCase>(DI_TOKENS.UpdatePromoPopup);

  const [formData, setFormData] = useState<PromoPopupFormState>(DEFAULT_PROMO_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadConfig(): Promise<void> {
      try {
        const config = await getPromoPopup.execute(true);
        if (config && isMounted) {
          setFormData({
            isEnabled: config.isEnabled,
            heading: config.heading,
            subheading: config.subheading,
            badgeText: config.badgeText || DEFAULT_PROMO_STATE.badgeText,
            ctaText: config.ctaText || DEFAULT_PROMO_STATE.ctaText,
            displayDelaySeconds: config.displayDelaySeconds,
            frequency: config.frequency || "session",
          });
        }
      } catch (err) {
        console.error("[usePromoPopupEditor] Failed to load promo configuration:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadConfig();

    return () => {
      isMounted = false;
    };
  }, [getPromoPopup]);

  const handleChange = useCallback(
    <K extends keyof PromoPopupFormState>(field: K, value: PromoPopupFormState[K]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      setStatusMessage(null);

      try {
        await updatePromoPopup.execute({
          isEnabled: formData.isEnabled,
          heading: formData.heading.trim(),
          subheading: formData.subheading.trim(),
          badgeText: formData.badgeText.trim(),
          ctaText: formData.ctaText.trim(),
          displayDelaySeconds: Number(formData.displayDelaySeconds) || 5,
          frequency: formData.frequency,
        });

        notificationService.success("Promo popup configuration saved successfully.");
        setStatusMessage("Configuration updated.");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update configuration.";
        notificationService.error(message);
        setStatusMessage(message);
      } finally {
        setIsSaving(false);
      }
    },
    [formData, updatePromoPopup]
  );

  return {
    formData,
    isLoading,
    isSaving,
    statusMessage,
    handleChange,
    handleSave,
  };
}
