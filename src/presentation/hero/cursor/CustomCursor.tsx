// presentation/hero/cursor/CustomCursor.tsx
// Desktop precision avionics cursor (ring + micro-dot).
// Strict adherence to shadow-free surfaces, Cupertino precision, and accessibility guards.

import { motion } from "framer-motion";
import { useCustomCursor } from "./useCustomCursor";

export function CustomCursor() {
  const { isVisible, isHovered, x, y } = useCustomCursor();

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden select-none">
      {/* Precision Center Micro-Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[var(--amber)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{
          x,
          y,
          scale: isHovered ? 1.4 : 1,
        }}
        transition={{
          type: "spring",
          damping: 50,
          stiffness: 1000,
          mass: 0.1,
        }}
      />

      {/* Outer Telemetry Targeting Ring */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full border pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-colors duration-200 ${
          isHovered
            ? "w-11 h-11 border-[var(--amber)] bg-[var(--amber)]/5"
            : "w-7 h-7 border-[var(--cyan)]/50 bg-[var(--cyan)]/5"
        }`}
        animate={{
          x,
          y,
        }}
        transition={{
          type: "spring",
          damping: 32,
          stiffness: 420,
          mass: 0.4,
        }}
      />
    </div>
  );
}
