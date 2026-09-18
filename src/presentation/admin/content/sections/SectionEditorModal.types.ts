// presentation/admin/content/sections/SectionEditorModal.types.ts
// Type contracts for the section configuration modal supporting full type-aware editing.

export interface SectionEditorFormData {
  readonly title: string;
  readonly type: string;
  readonly isVisible: boolean;
  readonly headline: string;
  readonly description: string;
  // Hero section fields
  readonly eyebrow?: string;
  readonly titleLine1?: string;
  readonly subheadline?: string;
  readonly ctaPrimary?: string;
  readonly ctaSecondary?: string;
  readonly heroPhotoUrl?: string;
  // Contact section fields
  readonly fullName?: string;
  readonly role?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly linkedinUrl?: string;
  readonly locationUrl?: string;
  readonly resumePdfUrl?: string;
  readonly photoUrl?: string;
  // Overview / Impact fields
  readonly metric1Value?: string;
  readonly metric1Label?: string;
  readonly metric2Value?: string;
  readonly metric2Label?: string;
  readonly metric3Value?: string;
  readonly metric3Label?: string;
  readonly metric4Value?: string;
  readonly metric4Label?: string;
  // Telemetry fields
  readonly targetSavings?: string;
  readonly mttrImprovement?: string;
  readonly fleetManaged?: string;
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
