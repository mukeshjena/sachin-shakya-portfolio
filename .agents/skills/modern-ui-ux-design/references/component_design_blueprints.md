# Component Design Blueprints: Clean Architecture & Shadow-Free Surfaces

Architectural patterns for key UI elements in the Sachin Shakya portfolio.

---

## 1. Metric / Telemetry Card Blueprint
- **Structure:**
  - Outer container: `bg-[var(--ink-800)] border border-[var(--line)] rounded-xl p-6`
  - Eyebrow: `text-xs uppercase tracking-widest text-[var(--mist-dim)] font-mono mb-2`
  - Value: `text-4xl font-bold font-mono tabular-nums text-[var(--amber)] mb-1`
  - Label: `text-sm text-[var(--mist)]`
- **Interaction:**
  - Hover: `hover:border-[var(--amber)] hover:bg-[var(--ink-700)] transition-colors duration-200`
  - Strictly NO box shadows and NO scale zooms.

---

## 2. Floating Liquid-Glass Mobile Bottom Nav Blueprint
- **Structure:**
  - Fixed dock: `fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-2`
  - Surface: `bg-[var(--ink-900)]/80 backdrop-blur-xl border border-white/10 rounded-full`
  - Tab items: `relative px-4 py-2 text-xs font-medium rounded-full text-[var(--mist)]`
  - Active tab: `text-[var(--paper)]` with Framer Motion `layoutId="activeTabPill"` background: `bg-[var(--ink-700)] border border-white/10`
  - Safe-area inset: `pb-[calc(env(safe-area-inset-bottom)+0.5rem)]`

---

## 3. Experience / Role Card Blueprint
- **Structure:**
  - Container: `border border-[var(--line)] bg-[var(--ink-800)]/60 rounded-xl p-6`
  - Role Header: Flex row with Company badge and Duration badge (`font-mono text-xs`)
  - Title: `text-xl font-semibold text-[var(--paper)] mt-2`
  - Bullets: Unordered list with custom hairline dash or diamond icon (outline)
  - Impact Tags: Badges for AWS, Kubernetes, Terraform (`bg-[var(--ink-700)] text-[var(--cyan)] border border-[var(--line)] rounded-md px-2.5 py-1 text-xs font-mono`)
