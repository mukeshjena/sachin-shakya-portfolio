// presentation/admin/content/sections/SectionEditorModal.hooks.ts
// Hook managing section editing state and persistence.

import { useCallback, useEffect, useState } from "react";
import type { ISaveSectionUseCase } from "../../../../application/use-cases/sections/SaveSectionUseCase";
import type { SectionType } from "../../../../domain/entities/content/Section";
import { DI_TOKENS } from "../../../../infrastructure/di/tokens";
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
};

export function useSectionEditorModal({
  sectionToEdit,
  pageId,
  onClose,
  onSuccess,
}: SectionEditorModalProps): SectionEditorViewModel {
  const saveSection = useContainer<ISaveSectionUseCase>(DI_TOKENS.SaveSection);

  const [formData, setFormData] = useState<SectionEditorFormData>(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sectionToEdit) {
      const content = sectionToEdit.content || {};
      setFormData({
        title: sectionToEdit.title || "",
        type: sectionToEdit.type || "custom",
        isVisible: Boolean(sectionToEdit.isVisible),
        headline: typeof content.headline === "string" ? content.headline : "",
        description: typeof content.description === "string" ? content.description : "",
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
        await saveSection.execute({
          id: sectionToEdit?.id,
          pageId: pageId || "home",
          type: (formData.type as SectionType) || "custom",
          title: formData.title.trim(),
          isVisible: formData.isVisible,
          content: {
            headline: formData.headline.trim(),
            description: formData.description.trim(),
          },
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
    [formData, sectionToEdit?.id, pageId, saveSection, onSuccess, onClose]
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
