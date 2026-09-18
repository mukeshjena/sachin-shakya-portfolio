// presentation/hero/cursor/useCustomCursor.ts
// Hook managing precision avionics cursor tracking, interactive element hover, and device capability.
// Disabled on touch devices and for users who prefer reduced motion.

import { useEffect, useState } from "react";
import type { CustomCursorState } from "./CustomCursor.types";

export function useCustomCursor(): CustomCursorState {
  const [state, setState] = useState<CustomCursorState>({
    isVisible: false,
    isHovered: false,
    x: -100,
    y: -100,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Guard: Only enable on fine pointer devices (desktop mouse/trackpad)
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || prefersReducedMotion) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Check if hovering over an interactive element
      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest(
          "a, button, input, textarea, select, [role='button'], [data-cursor-interactive]"
        )
      );

      setState({
        isVisible: true,
        isHovered: isInteractive,
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleMouseLeave = () => {
      setState((prev) => ({ ...prev, isVisible: false }));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return state;
}
