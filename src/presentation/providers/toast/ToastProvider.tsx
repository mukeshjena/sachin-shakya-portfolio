// presentation/providers/toast/ToastProvider.tsx
// Manages telemetry toast notifications and renders the container.

import { type ReactNode, useCallback, useMemo, useState } from "react";
import { ToastContainer } from "./components/ToastContainer";
import {
  ToastContext,
  type ToastContextValue,
  type ToastItemData,
  type ToastOptions,
} from "./toastContext";

export interface ToastProviderProps {
  readonly children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<readonly ToastItemData[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((options: ToastOptions): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastItemData = {
      ...options,
      id,
      createdAt: Date.now(),
    };

    setToasts((current) => [...current, newToast]);
    return id;
  }, []);

  const contextValue: ToastContextValue = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
    }),
    [toasts, showToast, dismissToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}
