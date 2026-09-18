// presentation/providers/toast/toastContext.ts
// Context definition for flat, shadow-free instrument panel toast notifications.

import { createContext } from "react";

export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastOptions {
  readonly title: string;
  readonly message?: string;
  readonly type?: ToastType;
  readonly duration?: number;
}

export interface ToastItemData extends ToastOptions {
  readonly id: string;
  readonly createdAt: number;
}

export interface ToastContextValue {
  readonly toasts: readonly ToastItemData[];
  readonly showToast: (options: ToastOptions) => string;
  readonly dismissToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue>({
  toasts: [],
  showToast: () => "",
  dismissToast: () => {},
});
