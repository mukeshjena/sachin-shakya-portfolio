// presentation/admin/content/settings/SiteSettingsEditor.hooks.ts
// Hook managing global site configuration, identity metadata, and social links.

import { useCallback, useEffect, useState } from "react";
import type { IGetSiteSettingsUseCase } from "../../../../application/use-cases/settings/GetSiteSettingsUseCase";
import type { IUpdateSiteSettingsUseCase } from "../../../../application/use-cases/settings/UpdateSiteSettingsUseCase";
import type { SocialLink } from "../../../../domain/entities/admin/SiteSettings";
import { DI_TOKENS } from "../../../../infrastructure/di/tokens";
import { useContainer } from "../../../shared/useContainer";
import type { SiteSettingsEditorViewModel, SiteSettingsFormData } from "./SiteSettingsEditor.types";

const INITIAL_FORM: SiteSettingsFormData = {
  fullName: "Sachin Shakya",
  headline: "Technical Lead — CloudOps // Cloud & DevOps Architect",
  shortBio:
    "Lead Cloud Architect managing 2,000+ multi-cloud resources with $170K/month verified cost optimization and 40% MTTR reduction across AWS, Microsoft Azure, and Kubernetes.",
  email: "sachin.shakya@live.com",
  phone: "+91 99530 60735",
  location: "Faridabad, Haryana 121005, India",
  logoUrl: "/assets/sachin-logo.png",
  socialLinks: [
    {
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com/in/sachinshakya",
      isVisible: true,
      order: 1,
    },
    {
      platform: "github",
      label: "GitHub",
      url: "https://github.com/sachinshakya",
      isVisible: true,
      order: 2,
    },
    {
      platform: "email",
      label: "Email",
      url: "mailto:sachin.shakya@live.com",
      isVisible: true,
      order: 3,
    },
  ],
};

export function useSiteSettingsEditor(): SiteSettingsEditorViewModel {
  const getSiteSettings = useContainer<IGetSiteSettingsUseCase>(DI_TOKENS.GetSiteSettings);
  const updateSiteSettings = useContainer<IUpdateSiteSettingsUseCase>(DI_TOKENS.UpdateSiteSettings);

  const [formData, setFormData] = useState<SiteSettingsFormData>(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getSiteSettings
      .execute()
      .then((settings) => {
        if (!isMounted || !settings) return;
        setFormData({
          fullName: settings.fullName || INITIAL_FORM.fullName,
          headline: settings.headline || INITIAL_FORM.headline,
          shortBio: settings.shortBio || INITIAL_FORM.shortBio,
          email: settings.email || INITIAL_FORM.email,
          phone: settings.phone || INITIAL_FORM.phone,
          location: settings.location || INITIAL_FORM.location,
          logoUrl: settings.logoUrl || INITIAL_FORM.logoUrl,
          socialLinks:
            settings.socialLinks && settings.socialLinks.length > 0
              ? settings.socialLinks
              : INITIAL_FORM.socialLinks,
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [getSiteSettings]);

  const handleChange = useCallback((field: keyof SiteSettingsFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsSuccess(false);
    setErrorMessage(null);
  }, []);

  const handleSocialLinkChange = useCallback(
    (index: number, field: keyof SocialLink, value: unknown) => {
      setFormData((prev) => {
        const updated = [...prev.socialLinks];
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
        return {
          ...prev,
          socialLinks: updated,
        };
      });
      setIsSuccess(false);
      setErrorMessage(null);
    },
    []
  );

  const handleAddSocialLink = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        {
          platform: "custom",
          label: "Platform",
          url: "https://",
          isVisible: true,
          order: prev.socialLinks.length + 1,
        },
      ],
    }));
  }, []);

  const handleRemoveSocialLink = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      setErrorMessage(null);
      setIsSuccess(false);

      try {
        await updateSiteSettings.execute({
          fullName: formData.fullName.trim(),
          headline: formData.headline.trim(),
          shortBio: formData.shortBio.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          location: formData.location.trim(),
          logoUrl: formData.logoUrl.trim(),
          socialLinks: formData.socialLinks,
        });

        setIsSuccess(true);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to update site settings.");
      } finally {
        setIsSaving(false);
      }
    },
    [formData, updateSiteSettings]
  );

  return {
    formData,
    isSaving,
    isSuccess,
    errorMessage,
    handleChange,
    handleSocialLinkChange,
    handleAddSocialLink,
    handleRemoveSocialLink,
    handleSubmit,
  };
}
