// presentation/shell/bottom-nav/MobileBottomNav.tsx
// iOS-style floating liquid-glass bottom pill navigation dock (< md breakpoint).
// Features Framer Motion layoutId active pill, zero box-shadows, Cupertino outline icons, zero emojis.

import { motion } from "framer-motion";
import { useMobileBottomNavLogic } from "./MobileBottomNav.hooks";
import type { MobileBottomNavProps } from "./MobileBottomNav.types";

export function MobileBottomNav({ onTabSelect }: MobileBottomNavProps) {
  const { activeTabId, tabs, setActiveTabId } = useMobileBottomNavLogic();

  return (
    <nav
      aria-label="Mobile primary navigation"
      className="fixed bottom-4 inset-x-0 z-50 flex justify-center px-4 md:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]"
    >
      <div
        role="tablist"
        aria-label="Application tabs"
        className="pointer-events-auto w-full max-w-sm flex items-center justify-around gap-1 p-1.5 rounded-2xl bg-[var(--ink-850)]/92 backdrop-blur-xl border border-[var(--line)]"
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
              onClick={() => {
                setActiveTabId(tab.id);
                onTabSelect?.(tab.href);
              }}
              className={`relative flex-1 py-1.5 px-2 flex flex-col items-center justify-center gap-1 rounded-xl transition-colors cursor-pointer select-none ${
                isActive
                  ? "text-[var(--paper)] font-semibold"
                  : "text-[var(--mist-dim)] hover:text-[var(--mist)]"
              }`}
            >
              {/* Active Tab Floating Pill (Framer Motion layoutId) */}
              {isActive && (
                <motion.span
                  layoutId="activeMobileTabIndicator"
                  className="absolute inset-0 rounded-xl bg-[var(--ink-700)] border border-[var(--line)] -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}

              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-[var(--amber)]" : "text-[var(--mist-dim)]"
                }`}
                aria-hidden="true"
              />
              <span className="text-[10px] font-medium tracking-tight leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
