// presentation/shell/header/Header.tsx
// Declarative desktop navigation header (>= md breakpoint).
// Adheres strictly to sci-fi instrument panel aesthetics, shadow-free surfaces, and zero emojis.

import { ThemeToggle } from "../../theme/toggle/ThemeToggle";
import { HEADER_COPY } from "./constants/header.constants";
import { useHeaderLogic } from "./Header.hooks";

export function Header() {
  const { isScrolled, logoUrl, fullName, availabilityNote, navLinks } = useHeaderLogic();

  return (
    <header
      className={`hidden md:block sticky top-0 z-40 w-full transition-all duration-300 border-b ${
        isScrolled
          ? "border-[var(--line)] bg-[var(--ink-900)]/90 backdrop-blur-xl"
          : "border-transparent bg-[var(--ink-900)]/50 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
        {/* Brand & Telemetry Mark */}
        <a href="#top" className="flex items-center gap-3.5 group cursor-pointer select-none">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${fullName} emblem`}
              className="w-10 h-10 rounded-xl object-contain border border-[var(--line)] bg-[var(--ink-800)] p-1 transition-colors group-hover:border-[var(--cyan)]"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--amber)] font-mono font-bold text-base">
              SS
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-[var(--paper)] group-hover:text-[var(--cyan)] transition-colors uppercase">
              {fullName}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[var(--mist-dim)] uppercase">
              {HEADER_COPY.brandSubtitle}
            </span>
          </div>
        </a>

        {/* Dynamic Navigation Links */}
        <nav aria-label="Desktop primary navigation">
          <ul className="flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-800)]/70 transition-all cursor-pointer tracking-wide"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Telemetry Controls */}
        <div className="flex items-center gap-3.5">
          {/* Availability Status Beacon */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--ink-800)] border border-[var(--line)] select-none">
            <span
              className="w-2 h-2 rounded-full bg-[var(--live)] animate-pulse"
              aria-hidden="true"
            />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--live)] font-medium">
              {availabilityNote}
            </span>
          </div>

          {/* Cupertino Theme Toggle */}
          <ThemeToggle />

          {/* Contact Action CTA */}
          <a
            href="#contact"
            className="px-4 py-2 rounded-xl bg-[var(--amber)] text-[var(--ink-900)] font-semibold text-xs uppercase tracking-wider hover:bg-[var(--amber-deep)] active:translate-y-px transition-all cursor-pointer"
          >
            {HEADER_COPY.contactCta}
          </a>
        </div>
      </div>
    </header>
  );
}
