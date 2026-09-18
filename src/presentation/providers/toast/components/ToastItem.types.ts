// presentation/providers/toast/components/ToastItem.types.ts
// Props contract for individual telemetry toast notification.

import type { ToastItemData } from "../toastContext";

export interface ToastItemProps {
  readonly toast: ToastItemData;
  readonly onDismiss: (id: string) => void;
}
