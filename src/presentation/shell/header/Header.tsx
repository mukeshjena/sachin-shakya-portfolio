// presentation/shell/header/Header.tsx
// Declarative desktop navigation header (>= md breakpoint).
// Adheres strictly to sci-fi instrument panel aesthetics, shadow-free surfaces, and zero emojis.

import { IoPersonOutline } from "react-icons/io5";
import { ThemeToggle } from "../../theme/toggle/ThemeToggle";
import { HEADER_COPY } from "./constants/header.constants";
import { useHeaderLogic } from "./Header.hooks";

export function Header() {
  const { isScrolled, logoUrl, fullName, navLinks, activeSection } = useHeaderLogic();

  return (
    <header
      className={`hidden md:block fixed top-0 inset-x-0 z-40 w-full transition-all duration-300 border-b ${
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
              className="w-10 h-10 rounded-full object-cover border border-[var(--line)] bg-[var(--ink-800)] transition-colors group-hover:border-[var(--cyan)]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--amber)] font-mono font-bold text-sm">
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
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? "text-[var(--amber)] bg-[var(--ink-800)] font-semibold border border-[var(--amber)]/30"
                        : "text-[var(--mist)] hover:text-[var(--paper)] hover:bg-[var(--ink-800)]/70 border border-transparent"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Telemetry Controls */}
        <div className="flex items-center gap-3">
          {/* Admin Portal Circle Icon (DIIRA Parity) */}
          <a
            href="/admin"
            aria-label="Admin Portal"
            title="Admin Portal"
            className="flex w-9 h-9 rounded-xl border border-[var(--line)] bg-[var(--ink-800)] items-center justify-center text-[var(--mist)] hover:text-[var(--amber)] hover:border-[var(--amber)] hover:bg-[var(--ink-700)] transition-colors shrink-0 cursor-pointer select-none"
          >
            <IoPersonOutline className="w-4 h-4" aria-hidden="true" />
          </a>

          {/* Cupertino Theme Toggle */}
          <ThemeToggle />

          {/* Contact Action CTA */}
          <a
            href="#contact"
            className="px-4 py-2 rounded-xl bg-[var(--amber)] text-[var(--ink-900)] font-semibold text-xs uppercase tracking-wider hover:bg-[var(--amber-deep)] active:translate-y-px transition-all cursor-pointer whitespace-nowrap"
          >
            {HEADER_COPY.contactCta}
          </a>
        </div>
      </div>
    </header>
  );
}
