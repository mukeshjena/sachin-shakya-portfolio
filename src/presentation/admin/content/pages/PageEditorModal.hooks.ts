// presentation/admin/content/pages/PageEditorModal.hooks.ts
// Hook managing page creation and editing state with zero-debounce blur validation.

import { useCallback, useEffect, useState } from "react";
import type { ISavePageUseCase } from "../../../../application/use-cases/pages/mutation/SavePageUseCase";
import { DI_TOKENS } from "../../../../infrastructure/di/tokens";
import { useContainer } from "../../../shared/useContainer";
import type {
  PageEditorFormData,
  PageEditorModalProps,
  PageEditorViewModel,
} from "./PageEditorModal.types";

const INITIAL_FORM: PageEditorFormData = {
  title: "",
  slug: "",
  subtitle: "",
  richContent: "",
  category: "architecture",
  order: 1,
  isPublished: true,
  showInHeader: true,
  showInFooter: true,
  seoTitle: "",
  seoDescription: "",
};

export function usePageEditorModal({
  pageToEdit,
  onClose,
  onSuccess,
}: PageEditorModalProps): PageEditorViewModel {
  const savePage = useContainer<ISavePageUseCase>(DI_TOKENS.SavePage);

  const [formData, setFormData] = useState<PageEditorFormData>(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = Boolean(pageToEdit?.id);

  // Sync form data with incoming pageToEdit prop
  useEffect(() => {
    if (pageToEdit) {
      setFormData({
        title: pageToEdit.title || "",
        slug: pageToEdit.slug || "",
        subtitle: pageToEdit.subtitle || "",
        richContent: pageToEdit.richContent || "",
        category: pageToEdit.category || "architecture",
        order: pageToEdit.order ?? 1,
        isPublished: Boolean(pageToEdit.isPublished),
        showInHeader: Boolean(pageToEdit.showInHeader),
        showInFooter: Boolean(pageToEdit.showInFooter),
        seoTitle: "",
        seoDescription: "",
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [pageToEdit]);

  const handleChange = useCallback((field: keyof PageEditorFormData, value: unknown) => {
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
    (field: keyof PageEditorFormData) => {
      if (field === "title" && !formData.title.trim()) {
        setErrors((prev) => ({ ...prev, title: "Title cannot be empty." }));
      }
      if (field === "slug") {
        const cleaned = formData.slug
          .trim()
          .toLowerCase()
          .replace(/^\/+|\/+$/g, "");
        if (!cleaned) {
          setErrors((prev) => ({ ...prev, slug: "Slug cannot be empty." }));
        } else if (!/^[a-z0-9-]+$/.test(cleaned)) {
          setErrors((prev) => ({
            ...prev,
            slug: "Slug can only contain lowercase letters, numbers, and dashes.",
          }));
        }
      }
    },
    [formData.title, formData.slug]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const newErrors: Record<string, string> = {};
      if (!formData.title.trim()) {
        newErrors.title = "Page title is required.";
      }
      const cleanedSlug = formData.slug
        .trim()
        .toLowerCase()
        .replace(/^\/+|\/+$/g, "");
      if (!cleanedSlug) {
        newErrors.slug = "Page URL slug is required.";
      } else if (!/^[a-z0-9-]+$/.test(cleanedSlug)) {
        newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsSaving(true);
      try {
        await savePage.execute({
          id: pageToEdit?.id,
          title: formData.title.trim(),
          slug: cleanedSlug,
          subtitle: formData.subtitle.trim() || undefined,
          richContent: formData.richContent || undefined,
          category: formData.category.trim() || undefined,
          order: formData.order,
          isPublished: formData.isPublished,
          showInHeader: formData.showInHeader,
          showInFooter: formData.showInFooter,
          seoTitle: formData.seoTitle.trim() || undefined,
          seoDescription: formData.seoDescription.trim() || undefined,
        });

        onSuccess?.();
        onClose();
      } catch (err) {
        setErrors({
          general: err instanceof Error ? err.message : "Failed to save page.",
        });
      } finally {
        setIsSaving(false);
      }
    },
    [formData, pageToEdit?.id, savePage, onSuccess, onClose]
  );

  return {
    formData,
    isSaving,
    errors,
    isEditMode,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
