// presentation/shell/mobile-header/MobileHeader.tsx
// Compact iOS-style title bar for mobile viewports (< md).
// Separated from desktop Header per Rule 8 (Dual Chrome Experience).

import { ThemeToggle } from "../../theme/toggle/ThemeToggle";
import { useMobileHeaderLogic } from "./MobileHeader.hooks";

export function MobileHeader() {
  const { logoUrl, fullName, isAvailable } = useMobileHeaderLogic();

  return (
    <header className="md:hidden fixed top-0 inset-x-0 z-40 w-full bg-[var(--ink-900)]/85 backdrop-blur-xl border-b border-[var(--line)]">
      <div className="px-4 h-14 flex items-center justify-between gap-3">
        {/* Brand Link */}
        <a href="#top" className="flex items-center gap-2.5 select-none">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${fullName} mark`}
              className="w-8 h-8 rounded-full object-cover border border-[var(--line)] bg-[var(--ink-800)]"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--amber)] font-mono font-bold text-xs">
              SS
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-tight text-[var(--paper)] uppercase">
              {fullName}
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[var(--mist-dim)] uppercase">
              ARCHITECT &bull; CLOUDOPS
            </span>
          </div>
        </a>

        {/* Status & Controls */}
        <div className="flex items-center gap-2">
          {isAvailable && (
            <div className="hidden xs:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--ink-800)] border border-[var(--line)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--live)]" aria-hidden="true" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--live)] font-semibold">
                ACTIVE
              </span>
            </div>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
