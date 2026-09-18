// presentation/providers/toast/useToast.ts
// Consumer hook for displaying telemetry toasts.

import { useContext } from "react";
import { ToastContext, type ToastContextValue } from "./toastContext";

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("[useToast] Hook must be used within a <ToastProvider>");
  }
  return context;
}
