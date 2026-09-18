// presentation/admin/content/sections/SectionEditorModal.types.ts
// Type contracts for the section configuration modal.

export interface SectionEditorFormData {
  readonly title: string;
  readonly type: string;
  readonly isVisible: boolean;
  readonly headline: string;
  readonly description: string;
}

export interface SectionEditTarget {
  readonly id: string;
  readonly title: string;
  readonly type: string;
  readonly isVisible: boolean;
  readonly content?: Record<string, unknown>;
}

export interface SectionEditorModalProps {
  readonly isOpen: boolean;
  readonly sectionToEdit?: SectionEditTarget | null;
  readonly pageId: string;
  readonly onClose: () => void;
  readonly onSuccess?: () => void;
}

export interface SectionEditorViewModel {
  readonly formData: SectionEditorFormData;
  readonly isSaving: boolean;
  readonly errors: Record<string, string>;
  readonly handleChange: (field: keyof SectionEditorFormData, value: unknown) => void;
  readonly handleBlur: (field: keyof SectionEditorFormData) => void;
  readonly handleSubmit: (e: React.FormEvent) => Promise<void>;
}
