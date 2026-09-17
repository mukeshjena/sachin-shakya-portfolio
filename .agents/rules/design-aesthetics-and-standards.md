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

## 11. Data Visualization & Telemetry Charts Standard (Instrument Panel Graphs)
When designing and implementing cost comparison charts, MTTR benchmarks, and cloud telemetry visualizations:
- **Strictly Shadow-Free Visualization:** Absolutely zero `box-shadow` or `filter: drop-shadow()` on chart canvases, SVG paths, bars, or interactive tooltips.
- **Hairline Telemetry Grid:** Gridlines must use subtle 1px hairline strokes (`var(--line)` or `rgba(130, 180, 200, 0.12)`). Never use heavy contrasting borders.
- **Palette Token Mapping:**
  - **Optimized / Post-Automation / Target Series:** `var(--amber)` (`#ffb020`) — highlights the $170K/mo savings curve and reduced MTTR.
  - **Baseline / Pre-Automation Series:** `var(--cyan)` (`#49c7e8`) — represents initial expenditure and legacy incident resolution times.
  - **Uptime / SLA / Availability Track:** `var(--live)` (`#3fd08a`) — denotes healthy fleet state and 99.99% uptime.
  - **Axes & Tick Dividers:** `var(--ink-600)` / `var(--line)`.
  - **Chart Card Container:** `var(--ink-800)` canvas with `border border-[var(--line)]` and modern rounded corners (`rounded-xl` or `rounded-2xl`).
- **Typography Discipline:** All numbers, currencies (`$170K/mo`), time values (`72m`), percentages (`-40%`), and axis ticks MUST use monospaced tabular figures (`font-mono tabular-nums`).
- **Non-Distorting Interactivity:** Zero scale zoom (`hover:scale-*` strictly banned). Scrubbing over data points illuminates hairline crosshairs and displays a frosted liquid-glass telemetry pill (`backdrop-blur-xl`, `bg-[var(--ink-900)]/90`, `border border-[var(--line)]`, `rounded-lg`).
- **Universal Separation of Concerns (Rule 13):**
  - Path geometry, scale math, curve interpolation, and number formatting live in `*Chart.utils.ts`.
  - Baseline metrics, milestone copy, axis labels, and thresholds live in `*Chart.constants.ts`.
  - Active hover indices, scrubbers, and tab switches live in `*Chart.hooks.ts`.
  - Pure declarative SVG/JSX markup lives in `*Chart.tsx`.
  - Co-located token styling lives in `*Chart.css`.

## 12. Anti-AI Design Principles: Bespoke Human-Crafted Executive Mastery
To ensure the interface feels authored by an elite digital product designer rather than an automated AI generator:
- **Strictly Banned AI Design Tropes:**
  - **No Monotonous 3x3 Bento Grids:** Never lay out content as repetitive grids of identical rectangular cards with centered icons and generic text snippets.
  - **No AI Glowing Blobs / Neon Gradients:** Strictly no purple/cyan diffuse radial gradient backdrops, floating blur circles, or generic cyberpunk glows.
  - **No Corporate AI Buzzword Salad:** Avoid hollow marketing clichés ("Elevate your cloud scalability", "Empowering next-gen agility"). All copy must be technical, grounded, and specific to Sachin Shakya's documented milestones ($170K/month savings, 40% MTTR reduction, 2,000+ managed cloud resources, Eptura, Downer, LTIMindtree, ABN AMRO).
  - **No Uniform Card Pacing:** Every page section must employ varied rhythm and visual hierarchy — pairing dominant focal telemetry points with complementary detailed secondary metrics.
- **Hallmarks of Elite Human Designer Craft:**
  - **Asymmetric Tension & Dynamic Ratios:** Employ 60/40 splits, 70/30 hero layouts, offset sidebars, and staggered milestone timelines.
  - **High Typographic Contrast:** Combine monumental high-contrast headings (`tracking-tight leading-none`) with ultra-crisp monospaced micro-captions (`font-mono text-xs uppercase tracking-widest text-[var(--mist-dim)]`).
  - **Instrument Panel Materiality:** Treat cards as precision instruments. Hairline 1px borders (`border border-[var(--line)]`), matte non-reflective background fills (`var(--ink-800)`), subtle 1px surface dividers, and tactile hover states (subtle border illumination, zero hover scaling).
  - **Authentic Engineering Realism:** Feature real cloud telemetry — actual Terraform/HCL snippets, architecture topology diagrams, real latency charts, and live status beacons with physical authenticity.
  - **Intentional Negative Space:** Design with deliberate restraint. Let high-impact numbers and case studies breathe rather than cramming UI elements into every available pixel.

