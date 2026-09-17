---
trigger: always_on
description: Mandatory bespoke design aesthetics for Sachin Shakya Portfolio - shadow-free flat luxury instrument panel, zero emojis, zero debounced inputs, sci-fi cloud telemetry, color consistency, and zoom-free polish standards.
---

# UI/UX & Visual Design Standards: Sachin Shakya Cloud/DevOps Executive Portfolio

When writing, editing, or refactoring frontend code (HTML, CSS, React, TypeScript, Tailwind):

## 1. Sci-Fi Professional "Instrument Panel" Aesthetic
- Sachin Shakya is an Elite Lead Cloud Architect & DevOps Consultant (Eptura, LTIMindtree, TCS, Downer, ABN AMRO).
- The portfolio must convey authoritative technical mastery, enterprise reliability, and futuristic telemetry precision (reminiscent of mission control consoles, aerospace avionics, and high-performance server clusters, paired with minimalist editorial craftsmanship).
- Prominently feature cloud architecture telemetry:
  - Financial accountability: `$170K/month` cloud cost savings.
  - Operational metrics: `40% MTTR` reduction, `30–40%` manual effort reduction, `2,000+` cloud resources managed.
  - Multi-cloud infrastructure badges: AWS, Microsoft Azure, Google Cloud, Kubernetes, Terraform, Datadog, Dynatrace.
  - Certifications display: AZ-104, AZ-900, DP-900, SC-900, CLF-C01, ITIL Foundation.
- Use tabular numbers (`tabular-nums`) and clean monospaced typography (`font-mono`) for all metrics, KPIs, uptime percentages, and dates.

## 2. Strictly No Box Shadows (Shadow-Free Surface Design)
- **Never apply box shadows** (`shadow-*`, `box-shadow`).
- Define depth, elevation, and card boundaries using clean 1px hairline borders (`border border-line`, `border border-line-soft`, `border border-white/10`) and layered background tones (`var(--ink-900)`, `var(--ink-850)`, `var(--ink-800)`, `var(--ink-700)`).
- Frosted glass surfaces (Header, Mobile Bottom Nav) achieve tactile elevation through `backdrop-filter: blur(16px)` and translucent gradient fills, NEVER drop shadows.

## 3. Strictly Zero Emojis Anywhere
- **Zero emojis in code, markup, copy, or comments.**
- All iconography must be Cupertino/outline style using `react-icons/pi` (Phosphor Icons outline) or `react-icons/io5` (Ionicons outline).
- Icons must be rendered cleanly with standard stroke widths and proper aria-hidden attributes.

## 4. Strictly No Debounced Inputs
- **Never debounce inputs.** Debouncing creates perceived latency and interaction sluggishness.
- Form fields validate on blur (`onBlur`) and on final form submission (`onSubmit`).

## 5. No Hover Zoom or Distorting Scale
- **Never use hover zoom** on cards, badges, or images (no `hover:scale-105`, `transform: scale()`).
- Use refined micro-interactions:
  - Hairline border illumination: `border-[var(--line)]` to `border-[var(--amber)]` or `border-[var(--cyan)]`.
  - Subtle surface tinting: transitioning background opacity.
  - Directional micro-nudges on action icons: `group-hover:translate-x-1`.

## 6. Modern Rounded Corners
- Modern rounded corners are encouraged (`rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`) across cards, buttons, badges, inputs, and floating pill navs.
- Rounded corners soften technical telemetry and deliver an executive modern feel while maintaining strict flat surfaces.

## 7. Color Palette & Token System
- Always use CSS custom properties from `src/index.css` `:root` — **NEVER hardcode arbitrary hex/rgb codes in TSX or CSS files**:
  - `--ink-900` (`#06121a`): Primary page canvas (deep petrol navy)
  - `--ink-850` (`#08171f`): Section canvas
  - `--ink-800` (`#0b1d27`): Surface / card background
  - `--ink-700` (`#102a36`): Elevated card / interactive surface
  - `--ink-600` (`#17394a`): Borders and structural dividers
  - `--mist` (`#93aeba`): Secondary text / technical descriptors
  - `--mist-dim` (`#6b8896`): Muted / timestamp text
  - `--paper` (`#e8f1f4`): Primary heading / high-contrast text
  - `--amber` (`#ffb020`): Primary accent / CTAs / achievements
  - `--amber-deep` (`#e08c00`): Pressed / active amber state
  - `--cyan` (`#49c7e8`): Secondary accent / links / technical keywords
  - `--live` (`#3fd08a`): Real-time pulse / active availability indicators
  - `--line` (`rgba(130,180,200,.16)`): Hairline card borders
  - `--line-soft` (`rgba(130,180,200,.09)`): Subtle dividers

## 8. Dual Chrome Experience: Mobile App vs Desktop Web
- **Desktop (≥ 768px):** Full instrument panel navigation header with logo, dynamic page links, status beacon, and theme toggle.
- **Mobile (< 768px):** Clean compact title bar at top, paired with an iOS-style floating liquid-glass bottom pill navigation dock (`backdrop-blur-xl`, safe-area-aware padding, animated active-pill indicator).

## 9. Typography Discipline
- **Display Headings:** Archivo / Inter — `tracking-tight` (-0.02em), leading `1.1` to `1.2`.
- **Body:** IBM Plex Sans / Inter — clean, high readability, max prose width `max-w-prose`.
- **Technical Telemetry / Numbers:** JetBrains Mono / IBM Plex Mono with `tabular-nums`.
- **Badges / Eyebrows:** Uppercase, `text-xs`, `font-semibold`, `tracking-widest` (+0.1em).

## 10. 8-Point Spacing Grid
- Maintain consistent 8px multiples (`gap-2`, `gap-4`, `gap-6`, `gap-8`, `p-4`, `p-6`, `p-8`, `py-16`, `py-24`).
- Ensure breathable padding within cards and balanced section rhythms.
