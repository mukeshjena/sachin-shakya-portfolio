---
name: modern-ui-ux-design
description: >-
  Expert guidelines and methodologies for shadow-free, emoji-free, sci-fi instrument panel UI/UX design with modern rounded corners.
  Activate when designing, building, or styling web interfaces, landing pages, dashboards,
  cards, hero sections, navigation, animations, typography, color palettes, or layout systems.
---

# Modern UI/UX Design Sense: Sci-Fi Professional Instrument Panel

This skill guides you to craft high-prestige, authoritative cloud architecture and DevOps interfaces. It enforces a **strictly shadow-free, emoji-free, non-distorting aesthetic with modern rounded corners**, relying on crisp hairline geometry, balanced typography, and responsive telemetry layouts.

---

## Core Design Principles

```
                     ┌─────────────────────────────────────────┐
                     │   Instrument Panel UI/UX Design         │
                     └────────────────────┬────────────────────┘
                                          │
          ┌───────────────────────────────┼───────────────────────────────┐
          ▼                               ▼                               ▼
   Spatial System              Clean Hairline Geometry             Typography & Motion
     8pt Grid System             No Box Shadows (`shadow-none`)      Display: Archivo / Inter
     60-75ch Prose Length        1px Borders (`var(--line)`)         Monospace: JetBrains Mono
     Dual Chrome (Mobile Dock)   Modern Rounded Corners              Zero Hover Scale / Zoom
```

---

## 1. Zero Shadows & Modern Rounded Borders
- **Never Use Box Shadows**: Absolutely no `box-shadow` or `shadow-*` utility classes.
- **Structure via Borders & Gradients**: Define card boundaries and surface depth using clean 1px borders (`border border-[var(--line)]` or `border border-white/10`) and layered background tones (`var(--ink-900)`, `var(--ink-850)`, `var(--ink-800)`).
- **Modern Rounded Corners**: Use modern rounded corners (`rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`) across cards, buttons, badges, inputs, and floating pill navs.
- **Frosted Translucent Elevation**: For elevated surfaces (desktop Header, mobile Bottom Nav), use `backdrop-filter: blur(16px)` and translucent fills instead of drop shadows.

---

## 2. Cohesive Instrument Panel Palette
- **Strict Color Consistency**: All colors MUST use CSS custom properties from `src/index.css` `:root`. Never hardcode inline hex values in JSX or CSS.
- **Palette Hierarchy**:
  - Page Canvas: `var(--ink-900)` (`#06121a`)
  - Section Canvas: `var(--ink-850)` (`#08171f`)
  - Card Surface: `var(--ink-800)` (`#0b1d27`)
  - Elevated Surface: `var(--ink-700)` (`#102a36`)
  - Borders: `var(--line)` (`rgba(130,180,200,.16)`)
  - Primary Accent / Highlights: `var(--amber)` (`#ffb020`)
  - Secondary Accent / Links: `var(--cyan)` (`#49c7e8`)
  - Status Indicators: `var(--live)` (`#3fd08a`)
  - Body Text: `var(--mist)` (`#93aeba`)
  - Primary Text: `var(--paper)` (`#e8f1f4`)

---

## 3. Typography & Hierarchy
- **Display Headings**: Archivo / Inter with tight tracking (`tracking-tight`) and concise line-height (`leading-tight`).
- **Body & UI**: IBM Plex Sans / Inter with comfortable line-height (`leading-relaxed`).
- **Eyebrows & Badges**: All-caps, tracked out (`tracking-widest` uppercase `text-xs`).
- **Data & Telemetry**: JetBrains Mono with `tabular-nums` for metrics, cost savings, and uptime figures.

---

## 4. Non-Distorting Micro-Interactions (No Hover Zoom, No Debounce)
- **No Hover Zooming**: Never scale or zoom images and cards on hover (no `hover:scale-105` or `transform: scale()`).
- **No Debounce Lag**: Inputs validate on blur and submit. Never introduce debouncing delays.
- **Refined Feedback**:
  - Subtle border highlight on hover: `hover:border-[var(--amber)]` or `hover:border-[var(--cyan)]`
  - Subtle surface background tint: `hover:bg-[var(--ink-700)]`
  - Micro icon translation: `group-hover:translate-x-1`

---

## 5. Dual Chrome Layout
- **Desktop (≥ 768px)**: Web header with logo, dynamic links, status beacon, and theme toggle.
- **Mobile (< 768px)**: Mobile app header at top, floating pill dock at bottom with safe-area spacing and animated active-pill indicator.
