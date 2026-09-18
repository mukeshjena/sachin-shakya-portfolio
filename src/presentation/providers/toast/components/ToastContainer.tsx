// presentation/providers/toast/components/ToastContainer.tsx
// Viewport container rendering active telemetry toasts.
// Fixed positioning with safe areas, zero box-shadows.

import type { ToastItemData } from "../toastContext";
import { ToastItem } from "./ToastItem";

export interface ToastContainerProps {
  readonly toasts: readonly ToastItemData[];
  readonly onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <section
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </section>
  );
}
