// presentation/shell/bottom-nav/MobileBottomNav.tsx
// iOS 27 inspired floating liquid-glass bottom pill navigation dock (< md breakpoint).
// Rounded-full circular touch targets, zero text labels, Framer Motion active spring bubble.
// Strictly adheres to shadow-free surfaces, Cupertino outline icons, and zero emojis.

import { motion } from "framer-motion";
import { useMobileBottomNavLogic } from "./MobileBottomNav.hooks";
import type { MobileBottomNavProps } from "./MobileBottomNav.types";

export function MobileBottomNav({ onTabSelect }: MobileBottomNavProps) {
  const { activeTabId, tabs, setActiveTabId } = useMobileBottomNavLogic();

  return (
    <nav
      aria-label="Mobile primary navigation"
      className="fixed bottom-5 inset-x-0 z-50 flex justify-center px-4 md:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]"
    >
      <div
        role="tablist"
        aria-label="Application tabs"
        className="pointer-events-auto flex items-center justify-between gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-full bg-[var(--ink-900)]/85 backdrop-blur-2xl border border-[var(--line)]"
      >
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              title={tab.label}
              onClick={() => {
                setActiveTabId(tab.id);
                onTabSelect?.(tab.href);
              }}
              className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer select-none shrink-0 ${
                isActive
                  ? "text-[var(--amber)]"
                  : "text-[var(--mist-dim)] hover:text-[var(--paper)]"
              }`}
            >
              {/* Active Tab Floating Pill (Framer Motion layoutId) */}
              {isActive && (
                <motion.span
                  layoutId="activeMobileTabIndicator"
                  className="absolute inset-0 rounded-full bg-[var(--ink-700)] border border-[var(--line)] -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}

              <Icon
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors ${
                  isActive ? "text-[var(--amber)]" : "text-[var(--mist-dim)]"
                }`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
