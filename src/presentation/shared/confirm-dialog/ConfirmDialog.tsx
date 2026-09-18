// presentation/shared/confirm-dialog/ConfirmDialog.tsx
// Pure declarative confirmation modal replacing native browser window.confirm().
// Strictly shadow-free (Rule 2), emoji-free (Rule 3), with hairline borders and theme tokens.

import type React from "react";
import { useEffect } from "react";
import { IoAlertCircleOutline, IoCloseOutline, IoTrashOutline } from "react-icons/io5";
import type { ConfirmDialogProps } from "./ConfirmDialog.types";

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--ink-900)]/80 backdrop-blur-sm animate-fade-in"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cancel confirmation"
        onClick={isLoading ? undefined : onCancel}
        className="fixed inset-0 w-full h-full bg-black/60 cursor-default border-none"
        tabIndex={-1}
      />

      {/* Dialog Surface */}
      <div className="relative z-10 w-full max-w-md bg-[var(--ink-850)] border border-[var(--line)] rounded-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                isDestructive
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-[var(--amber)]/10 border-[var(--amber)]/20 text-[var(--amber)]"
              }`}
            >
              {isDestructive ? (
                <IoTrashOutline className="w-5 h-5" aria-hidden="true" />
              ) : (
                <IoAlertCircleOutline className="w-5 h-5" aria-hidden="true" />
              )}
            </div>
            <div>
              <h3
                id="confirm-dialog-title"
                className="text-base font-bold tracking-tight text-[var(--paper)]"
              >
                {title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close dialog"
            onClick={isLoading ? undefined : onCancel}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-[var(--mist-dim)] hover:text-[var(--paper)] bg-[var(--ink-800)] border border-[var(--line)] cursor-pointer transition-colors disabled:opacity-50"
          >
            <IoCloseOutline className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Message */}
        <p
          id="confirm-dialog-desc"
          className="text-xs text-[var(--mist)] leading-relaxed whitespace-pre-line"
        >
          {message}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--line-soft)]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-mono text-[var(--mist)] hover:text-[var(--paper)] bg-[var(--ink-800)] border border-[var(--line)] hover:border-[var(--line-soft)] cursor-pointer transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 rounded-xl text-xs font-mono font-semibold tracking-wide transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              isDestructive
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-[var(--amber)] hover:bg-[var(--amber-deep)] text-[var(--ink-950)]"
            }`}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
