// presentation/shared/notifications/notification.service.ts
// Robust Notyf toast telemetry service.
// Universal Separation of Concerns (Rule 13).

import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import "./notification.css";
import type { INotificationService } from "./notification.types";

let notyfInstance: Notyf | null = null;

function getNotyf(): Notyf | null {
  if (typeof window === "undefined") return null;
  if (!notyfInstance) {
    notyfInstance = new Notyf({
      duration: 4000,
      position: { x: "right", y: "top" },
      dismissible: true,
      ripple: false,
      types: [
        {
          type: "success",
          background: "var(--ink-850)",
          className: "notyf-clean-toast notyf-clean-success",
          icon: false,
        },
        {
          type: "error",
          background: "var(--ink-850)",
          className: "notyf-clean-toast notyf-clean-error",
          icon: false,
        },
        {
          type: "info",
          background: "var(--ink-850)",
          className: "notyf-clean-toast notyf-clean-info",
          icon: false,
        },
      ],
    });
  }
  return notyfInstance;
}

export const notificationService: INotificationService = {
  success(message: string): void {
    const inst = getNotyf();
    if (inst) {
      inst.success(message);
    }
  },
  error(message: string): void {
    const inst = getNotyf();
    if (inst) {
      inst.error(message);
    }
  },
  info(message: string): void {
    const inst = getNotyf();
    if (inst) {
      inst.open({
        type: "info",
        message,
      });
    }
  },
};
