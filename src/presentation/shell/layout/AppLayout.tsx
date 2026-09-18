// presentation/shell/layout/AppLayout.tsx
// Master application layout shell.
// Composes Desktop Header, Mobile Header, Children, Footer, and Mobile Bottom Nav.

import { MobileBottomNav } from "../bottom-nav/MobileBottomNav";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { MobileHeader } from "../mobile-header/MobileHeader";
import { useAppLayoutLogic } from "./AppLayout.hooks";
import type { AppLayoutProps } from "./AppLayout.types";

export function AppLayout({ children }: AppLayoutProps) {
  const { handleNavigate } = useAppLayoutLogic();

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--ink-900)] text-[var(--paper)] selection:bg-[var(--cyan)] selection:text-[var(--ink-900)]">
      {/* Animated Dark Gradient & Vintage Grid Background Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 vintage-animated-gradient" />
        <div className="absolute inset-0 vintage-grid-canvas" />
        <div className="absolute inset-0 vintage-vignette" />
      </div>

      {/* Desktop Header (>= md) */}
      <Header />

      {/* Mobile Title Bar (< md) */}
      <MobileHeader />

      {/* Page View Canvas */}
      <main id="top" className="relative z-10 flex-1 w-full">
        {children}
      </main>

      {/* Universal Executive Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Mobile Liquid-Glass Bottom Nav (< md) */}
      <MobileBottomNav onTabSelect={handleNavigate} />
    </div>
  );
}
