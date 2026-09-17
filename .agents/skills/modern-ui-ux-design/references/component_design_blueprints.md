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

---

## 4. Telemetry & Cost Comparison Chart Blueprint
- **Structure:**
  - Container: `bg-[var(--ink-800)]/80 border border-[var(--line)] rounded-2xl p-6 lg:p-8`
  - Chart Header: Flex row with Eyebrow (`font-mono text-xs uppercase tracking-widest text-[var(--mist-dim)]`), Metric Title (`text-2xl font-bold text-[var(--paper)]`), and Switcher Pill Tabs (`flex items-center gap-1 p-1 bg-[var(--ink-900)] border border-[var(--line)] rounded-full text-xs`)
  - Telemetry Telemetry KPI Strip: Grid of mini readouts (`font-mono tabular-nums text-lg font-bold text-[var(--amber)]` with micro-label `text-xs text-[var(--mist-dim)]`)
  - SVG Canvas: Responsive viewBox (`0 0 800 320`) with 1px hairline gridlines (`stroke-[var(--line)] stroke-dasharray-[4,4]`)
  - Series Curves & Bars:
    - Pre-optimization / Baseline: Stroke `var(--cyan)` (`rgba(73, 199, 232, 0.7)`), 1.5px hairline width
    - Optimized / Current Metric: Stroke `var(--amber)` (`#ffb020`), 2.5px width with subtle gradient fill (`from-[var(--amber)]/15 to-transparent`)
  - Interactive Scrubber: Vertical hairline crosshair (`stroke-[var(--amber)]/60`) moving smoothly on mouse/touch drag
  - Floating Telemetry Pill: `bg-[var(--ink-900)]/90 backdrop-blur-xl border border-[var(--line)] rounded-lg p-3 font-mono text-xs shadow-none`
- **Interactions:**
  - Strictly NO hover zoom or card scale distortion (zero `scale()`).
  - Switching tabs smoothly interpolates SVG geometry without page reflow.
  - Full Clean Architecture separation: Math in `*Chart.utils.ts`, series in `*Chart.constants.ts`, scrubbers in `*Chart.hooks.ts`.
