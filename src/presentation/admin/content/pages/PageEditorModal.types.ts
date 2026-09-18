// presentation/admin/content/pages/PageEditorModal.types.ts
// Type contracts for the dynamic page editor modal.

import type { DashboardPageItem } from "../../dashboard/DashboardShell.types";

export interface PageEditorFormData {
  readonly title: string;
  readonly slug: string;
  readonly subtitle: string;
  readonly richContent: string;
  readonly category: string;
  readonly order: number;
  readonly isPublished: boolean;
  readonly showInHeader: boolean;
  readonly showInFooter: boolean;
  readonly seoTitle: string;
  readonly seoDescription: string;
}

export interface PageEditorModalProps {
  readonly isOpen: boolean;
  readonly pageToEdit?: DashboardPageItem | null;
  readonly onClose: () => void;
  readonly onSuccess?: () => void;
}

export interface PageEditorViewModel {
  readonly formData: PageEditorFormData;
  readonly isSaving: boolean;
  readonly errors: Record<string, string>;
  readonly isEditMode: boolean;
  readonly handleChange: (field: keyof PageEditorFormData, value: unknown) => void;
  readonly handleBlur: (field: keyof PageEditorFormData) => void;
  readonly handleSubmit: (e: React.FormEvent) => Promise<void>;
}
