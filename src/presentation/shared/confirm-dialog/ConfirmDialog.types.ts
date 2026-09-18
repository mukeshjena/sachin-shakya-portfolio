// presentation/shared/confirm-dialog/ConfirmDialog.types.ts
// Contract and props for the universal confirmation modal.
// Strictly adheres to Clean Architecture and Rule 13.

export interface ConfirmDialogProps {
  readonly isOpen: boolean;
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly isDestructive?: boolean;
  readonly isLoading?: boolean;
  readonly onConfirm: () => void | Promise<void>;
  readonly onCancel: () => void;
}
