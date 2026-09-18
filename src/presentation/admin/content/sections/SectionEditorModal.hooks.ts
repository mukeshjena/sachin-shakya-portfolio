// presentation/admin/content/sections/SectionEditorModal.hooks.ts
// Hook managing section editing state, type-aware fields, and persistence.

import { useCallback, useEffect, useState } from "react";
import type { ISaveSectionUseCase } from "../../../../application/use-cases/sections/SaveSectionUseCase";
import type { IUpdateSiteSettingsUseCase } from "../../../../application/use-cases/settings/UpdateSiteSettingsUseCase";
import type { SectionType } from "../../../../domain/entities/content/Section";
import { DI_TOKENS } from "../../../../infrastructure/di/tokens";
import { CAPABILITY_CARDS } from "../../../sections/capabilities/constants/capabilities.constants";
import {
  CERTIFICATIONS,
  EDUCATION_RECORDS,
  HONORS_AWARDS,
} from "../../../sections/credentials/constants/credentials.constants";
import { EXPERIENCE_ROLES } from "../../../sections/experience/constants/experience.constants";
import { useContainer } from "../../../shared/useContainer";
import type {
  SectionEditorFormData,
  SectionEditorModalProps,
  SectionEditorViewModel,
} from "./SectionEditorModal.types";

const INITIAL_FORM: SectionEditorFormData = {
  title: "",
  type: "custom",
  isVisible: true,
  headline: "",
  description: "",
  eyebrow: "TECHNICAL LEAD — CLOUDOPS",
  titleLine1: "Architecting Resilient Multi-Cloud Platforms",
  subheadline:
    "Engineering enterprise multi-cloud architectures, mission-critical Kubernetes clusters, and automated DevOps delivery with $170K/month in verified cloud efficiency.",
  ctaPrimary: "Explore Architecture",
  ctaSecondary: "Download CV",
  heroPhotoUrl: "/assets/sachin-one.png",
  fullName: "Sachin Shakya",
  role: "Technical Lead — CloudOps",
  email: "sachin.shakya@live.com",
  phone: "+91 99530 60735",
  linkedinUrl: "https://linkedin.com/in/sachinshakya",
  locationUrl: "https://maps.google.com/?q=Faridabad,+Haryana+121005,+India",
  resumePdfUrl: "/Sachin_Shakya_Resume.pdf",
  photoUrl: "/assets/sachin-three.png",
  metric1Value: "$170K/MO",
  metric1Label: "Verified Cloud Savings",
  metric2Value: "40%",
  metric2Label: "Incident MTTR Reduction",
  metric3Value: "2,000+",
  metric3Label: "Active Cloud Resources",
  metric4Value: "3 Clouds",
  metric4Label: "AWS, Azure, GCP",
  targetSavings: "$170K/mo",
  mttrImprovement: "40%",
  fleetManaged: "2,000+",
  roles: EXPERIENCE_ROLES,
  cards: CAPABILITY_CARDS,
  certifications: CERTIFICATIONS,
  education: EDUCATION_RECORDS,
  awards: HONORS_AWARDS,
};

export function useSectionEditorModal({
  sectionToEdit,
  pageId,
  onClose,
  onSuccess,
}: SectionEditorModalProps): SectionEditorViewModel {
  const saveSection = useContainer<ISaveSectionUseCase>(DI_TOKENS.SaveSection);
  const updateSiteSettings = useContainer<IUpdateSiteSettingsUseCase>(DI_TOKENS.UpdateSiteSettings);

  const [formData, setFormData] = useState<SectionEditorFormData>(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sectionToEdit) {
      const c = (sectionToEdit.content || {}) as Record<string, unknown>;
      const existingText =
        typeof c.description === "string"
          ? c.description
          : typeof c.body === "string"
            ? c.body
            : "";

      setFormData({
        title: sectionToEdit.title || "",
        type: sectionToEdit.type || "custom",
        isVisible: Boolean(sectionToEdit.isVisible),
        headline:
          typeof c.headline === "string"
            ? c.headline
            : typeof c.heading === "string"
              ? c.heading
              : "",
        description: existingText,
        eyebrow: typeof c.eyebrow === "string" ? c.eyebrow : INITIAL_FORM.eyebrow,
        titleLine1:
          typeof c.titleLine1 === "string"
            ? c.titleLine1
            : typeof c.headline === "string"
              ? c.headline
              : INITIAL_FORM.titleLine1,
        subheadline:
          typeof c.subheadline === "string"
            ? c.subheadline
            : typeof c.subheading === "string"
              ? c.subheading
              : INITIAL_FORM.subheadline,
        ctaPrimary: typeof c.ctaPrimary === "string" ? c.ctaPrimary : INITIAL_FORM.ctaPrimary,
        ctaSecondary:
          typeof c.ctaSecondary === "string" ? c.ctaSecondary : INITIAL_FORM.ctaSecondary,
        heroPhotoUrl:
          typeof c.heroPhotoUrl === "string" ? c.heroPhotoUrl : INITIAL_FORM.heroPhotoUrl,
        fullName: typeof c.fullName === "string" ? c.fullName : INITIAL_FORM.fullName,
        role:
          typeof c.role === "string"
            ? c.role
            : typeof c.headline === "string"
              ? c.headline
              : INITIAL_FORM.role,
        email: typeof c.email === "string" ? c.email : INITIAL_FORM.email,
        phone: typeof c.phone === "string" ? c.phone : INITIAL_FORM.phone,
        linkedinUrl: typeof c.linkedinUrl === "string" ? c.linkedinUrl : INITIAL_FORM.linkedinUrl,
        locationUrl: typeof c.locationUrl === "string" ? c.locationUrl : INITIAL_FORM.locationUrl,
        resumePdfUrl:
          typeof c.resumePdfUrl === "string" ? c.resumePdfUrl : INITIAL_FORM.resumePdfUrl,
        photoUrl: typeof c.photoUrl === "string" ? c.photoUrl : INITIAL_FORM.photoUrl,
        metric1Value:
          typeof c.metric1Value === "string" ? c.metric1Value : INITIAL_FORM.metric1Value,
        metric1Label:
          typeof c.metric1Label === "string" ? c.metric1Label : INITIAL_FORM.metric1Label,
        metric2Value:
          typeof c.metric2Value === "string" ? c.metric2Value : INITIAL_FORM.metric2Value,
        metric2Label:
          typeof c.metric2Label === "string" ? c.metric2Label : INITIAL_FORM.metric2Label,
        metric3Value:
          typeof c.metric3Value === "string" ? c.metric3Value : INITIAL_FORM.metric3Value,
        metric3Label:
          typeof c.metric3Label === "string" ? c.metric3Label : INITIAL_FORM.metric3Label,
        metric4Value:
          typeof c.metric4Value === "string" ? c.metric4Value : INITIAL_FORM.metric4Value,
        metric4Label:
          typeof c.metric4Label === "string" ? c.metric4Label : INITIAL_FORM.metric4Label,
        targetSavings:
          typeof c.targetSavings === "string" ? c.targetSavings : INITIAL_FORM.targetSavings,
        mttrImprovement:
          typeof c.mttrImprovement === "string" ? c.mttrImprovement : INITIAL_FORM.mttrImprovement,
        fleetManaged:
          typeof c.fleetManaged === "string" ? c.fleetManaged : INITIAL_FORM.fleetManaged,
        roles: Array.isArray(c.roles) && c.roles.length > 0 ? c.roles : INITIAL_FORM.roles,
        cards: Array.isArray(c.cards) && c.cards.length > 0 ? c.cards : INITIAL_FORM.cards,
        certifications:
          Array.isArray(c.certifications) && c.certifications.length > 0
            ? c.certifications
            : INITIAL_FORM.certifications,
        education:
          Array.isArray(c.education) && c.education.length > 0
            ? c.education
            : INITIAL_FORM.education,
        awards: Array.isArray(c.awards) && c.awards.length > 0 ? c.awards : INITIAL_FORM.awards,
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [sectionToEdit]);

  const handleChange = useCallback((field: keyof SectionEditorFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleBlur = useCallback(
    (field: keyof SectionEditorFormData) => {
      if (field === "title" && !formData.title.trim()) {
        setErrors((prev) => ({ ...prev, title: "Title cannot be empty." }));
      }
    },
    [formData.title]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.title.trim()) {
        setErrors({ title: "Section title is required." });
        return;
      }

      setIsSaving(true);
      try {
        const rawContent = (sectionToEdit?.content || {}) as Record<string, unknown>;

        const updatedContent: Record<string, unknown> = {
          ...rawContent,
          headline: formData.headline.trim(),
          description: formData.description.trim(),
          body: formData.description.trim(),
        };

        if (formData.type === "experience") {
          updatedContent.roles = formData.roles || EXPERIENCE_ROLES;
        } else if (formData.type === "capabilities") {
          updatedContent.cards = formData.cards || CAPABILITY_CARDS;
        } else if (formData.type === "credentials") {
          updatedContent.certifications = formData.certifications || CERTIFICATIONS;
          updatedContent.education = formData.education || EDUCATION_RECORDS;
          updatedContent.awards = formData.awards || HONORS_AWARDS;
        } else if (formData.type === "contact") {
          updatedContent.fullName = formData.fullName?.trim() || "";
          updatedContent.headline = formData.role?.trim() || "";
          updatedContent.email = formData.email?.trim() || "";
          updatedContent.phone = formData.phone?.trim() || "";
          updatedContent.linkedinUrl = formData.linkedinUrl?.trim() || "";
          updatedContent.locationUrl = formData.locationUrl?.trim() || "";
          updatedContent.resumePdfUrl = formData.resumePdfUrl?.trim() || "";
          updatedContent.photoUrl = formData.photoUrl?.trim() || "";

          // Also synchronize global site settings
          try {
            await updateSiteSettings.execute({
              fullName: formData.fullName?.trim(),
              headline: formData.role?.trim(),
              email: formData.email?.trim(),
              phone: formData.phone?.trim(),
              resumePdfUrl: formData.resumePdfUrl?.trim(),
              avatarUrl: formData.photoUrl?.trim(),
            });
          } catch {
            // Non-blocking: section save succeeds even if site settings update fails
          }
        } else if (formData.type === "hero") {
          updatedContent.eyebrow = formData.eyebrow?.trim() || "";
          updatedContent.titleLine1 = formData.titleLine1?.trim() || "";
          updatedContent.headline = formData.titleLine1?.trim() || formData.headline.trim();
          updatedContent.subheadline = formData.subheadline?.trim() || "";
          updatedContent.ctaPrimary = formData.ctaPrimary?.trim() || "";
          updatedContent.ctaSecondary = formData.ctaSecondary?.trim() || "";
          updatedContent.heroPhotoUrl = formData.heroPhotoUrl?.trim() || "";
        } else if (formData.type === "impact") {
          updatedContent.heading = formData.headline.trim();
          updatedContent.subheading = formData.description.trim();
          updatedContent.metric1Value = formData.metric1Value?.trim();
          updatedContent.metric1Label = formData.metric1Label?.trim();
          updatedContent.metric2Value = formData.metric2Value?.trim();
          updatedContent.metric2Label = formData.metric2Label?.trim();
          updatedContent.metric3Value = formData.metric3Value?.trim();
          updatedContent.metric3Label = formData.metric3Label?.trim();
          updatedContent.metric4Value = formData.metric4Value?.trim();
          updatedContent.metric4Label = formData.metric4Label?.trim();
        } else if (formData.type === "telemetry") {
          updatedContent.heading = formData.headline.trim();
          updatedContent.subheading = formData.description.trim();
          updatedContent.targetSavings = formData.targetSavings?.trim();
          updatedContent.mttrImprovement = formData.mttrImprovement?.trim();
          updatedContent.fleetManaged = formData.fleetManaged?.trim();
        }

        await saveSection.execute({
          id: sectionToEdit?.id,
          pageId: pageId || "home",
          type: (formData.type as SectionType) || "custom",
          title: formData.title.trim(),
          isVisible: formData.isVisible,
          content: updatedContent,
        });

        onSuccess?.();
        onClose();
      } catch (err) {
        setErrors({
          general: err instanceof Error ? err.message : "Failed to save section.",
        });
      } finally {
        setIsSaving(false);
      }
    },
    [formData, sectionToEdit, pageId, saveSection, updateSiteSettings, onSuccess, onClose]
  );

  return {
    formData,
    isSaving,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
