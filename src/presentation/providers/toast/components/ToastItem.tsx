// presentation/providers/toast/components/ToastItem.tsx
// Individual telemetry toast item.
// Strict design adherence: flat surface, zero box-shadows, Cupertino outline icons, zero emojis.

import { useEffect } from "react";
import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoCloseOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import type { ToastType } from "../toastContext";
import type { ToastItemProps } from "./ToastItem.types";

function getToastIcon(type: ToastType = "info") {
  switch (type) {
    case "success":
      return <IoCheckmarkCircleOutline className="w-5 h-5 text-[var(--live)]" aria-hidden="true" />;
    case "warning":
      return <IoAlertCircleOutline className="w-5 h-5 text-[var(--amber)]" aria-hidden="true" />;
    case "error":
      return <IoCloseCircleOutline className="w-5 h-5 text-rose-400" aria-hidden="true" />;
    default:
      return (
        <IoInformationCircleOutline className="w-5 h-5 text-[var(--cyan)]" aria-hidden="true" />
      );
  }
}

function getBadgeColorClass(type: ToastType = "info"): string {
  switch (type) {
    case "success":
      return "border-[var(--live)]/30 bg-[var(--live)]/10 text-[var(--live)]";
    case "warning":
      return "border-[var(--amber)]/30 bg-[var(--amber)]/10 text-[var(--amber)]";
    case "error":
      return "border-rose-500/30 bg-rose-500/10 text-rose-400";
    default:
      return "border-[var(--cyan)]/30 bg-[var(--cyan)]/10 text-[var(--cyan)]";
  }
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { id, title, message, type = "info", duration = 5000 } = toast;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-sm pointer-events-auto bg-[var(--ink-850)]/95 backdrop-blur-xl border border-[var(--line)] rounded-xl p-4 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-lg border flex-shrink-0 ${getBadgeColorClass(type)}`}>
          {getToastIcon(type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--mist-dim)] font-semibold">
              {`TELEMETRY // ${type}`}
            </span>
            <button
              type="button"
              onClick={() => onDismiss(id)}
              aria-label="Dismiss notification"
              className="text-[var(--mist-dim)] hover:text-[var(--paper)] transition-colors p-0.5 rounded cursor-pointer"
            >
              <IoCloseOutline className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <h4 className="text-sm font-semibold text-[var(--paper)] mt-0.5 leading-snug">{title}</h4>
          {message && <p className="text-xs text-[var(--mist)] mt-1 leading-relaxed">{message}</p>}
        </div>
      </div>
    </div>
  );
}
