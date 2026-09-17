# Anti-AI Design Handbook: Crafting Bespoke Executive Interfaces

This guide establishes strict architectural and visual principles to ensure that the Sachin Shakya portfolio looks and feels designed by a world-class principal digital product designer, strictly avoiding the repetitive, synthetic tropes common in AI-generated web layouts.

---

## 1. Diagnostic Matrix: AI Cliché vs. Master Designer

| Dimension | 🤖 Generic AI Output (Forbidden) | 💎 Master Designer Craft (Mandatory) |
|---|---|---|
| **Layout & Grid** | Monotonous 3x3 bento grids where every box has identical padding and height. | Asymmetric editorial tension: 65/35 split viewports, offset technical sidebars, wide-screen telemetry panoramas. |
| **Color & Atmosphere** | Diffuse purple/magenta/cyan radial blurred blobs floating behind cards. | Pure matte canvas (`var(--ink-900)`), hairline 1px borders (`var(--line)`), and disciplined instrument-panel contrast. |
| **Card Styling** | Repetitive rounded cards with centered icons on top and generic paragraph text. | Dense, specialized instrument panels: top-left mono eyebrows, bold tabular metrics, live pulse beacons, status tags. |
| **Typography** | Uniform 16px font with minimal typographic scale; generic sans-serif everywhere. | Dramatic typographic hierarchy: massive tight-tracked display titles (`tracking-tight leading-none`) paired with refined monospaced micro-captions (`font-mono text-xs tracking-widest`). |
| **Copy & Content** | Hollow corporate buzzwords ("Elevate your scalable cloud transformation paradigms"). | Concrete, verified engineering milestones: "$170K/mo Cloud Spend Reduction", "40% MTTR Drop across P1/P2 Incidents", "2,000+ Multi-Cloud Assets". |
| **Interactivity** | Distorting hover zooms (`hover:scale-105`), bouncy spring physics, and heavy drop shadows. | Non-distorting precision feedback: 1px hairline border illumination, subtle surface tint shifts, and zero hover scaling. |
| **Visual Artifacts** | Meaningless abstract 3D shapes or generic tech illustrations. | Authentic engineering artifacts: interactive FinOps cost curves, real Terraform/Kubernetes manifest headers, latency histograms, and uptime indicators. |

---

## 2. Asymmetric Composition Techniques

Master designers do not force content into identical boxes. Use these layout archetypes:

### Archetype A: The 65/35 Asymmetric Hero Split
- **Primary Column (65%):** Monumental executive headline, live availability beacon, primary CTA action, and a concise 2-sentence value proposition.
- **Secondary Column (35%):** Compact real-time telemetry card showing active infrastructure metrics:
  - 3-tier cloud breakdown (Azure, AWS, GCP).
  - Real-time uptime telemetry pill (`99.99% Availability`).
  - Terminal-style system status chip.

### Archetype B: The FinOps Telemetry Panorama
- Rather than three small cards, render a full-width instrument panel featuring:
  - **Left 30%:** Executive financial summary ($170K/month run-rate reduction, $2.04M annual impact) with monospaced delta chips.
  - **Right 70%:** Multi-series interactive chart plotting 12-month baseline vs optimized cloud expenditure with annotated milestone pins (workload rightsizing, 85% RI coverage).

### Archetype C: Incident MTTR Benchmark Matrix
- Contrast pre-automation and post-automation recovery times using a horizontal benchmark ladder:
  - P1 Critical Incidents: `180 min` → `90 min` (`-50%` reduction)
  - P2 High Incidents: `120 min` → `65 min` (`-46%` reduction)
  - P3 Moderate Incidents: `60 min` → `35 min` (`-42%` reduction)
- Rendered with monospaced tabular figures (`font-mono tabular-nums`) and hairline divider rules.

---

## 3. Instrument Panel Materiality & Depth

To create rich visual depth without using forbidden drop shadows:

1. **Layered Surface Tones:**
   - Background canvas: `var(--ink-900)` (`#06121a`)
   - Section wrapper: `var(--ink-850)` (`#08171f`)
   - Surface card: `var(--ink-800)` (`#0b1d27`)
   - Elevated/interactive card: `var(--ink-700)` (`#102a36`)
2. **Hairline Border Illuminations:**
   - Default resting state: `border border-[var(--line)]` (`rgba(130, 180, 200, 0.16)`)
   - Hover / Focus state: `border border-[var(--amber)]` or `border border-[var(--cyan)]`
   - Smooth transition: `transition-colors duration-200 ease-out`
3. **Liquid-Glass Translucency:**
   - For floating navigation and telemetry tooltips:
   - `backdrop-blur-xl bg-[var(--ink-900)]/90 border border-[var(--line)] rounded-xl`

---

## 4. Typography Discipline

A bespoke design relies on typographic rhythm and monospaced contrast:

- **Display Numbers:** Always use `tabular-nums font-mono` for all KPIs, currency values, and percentages. This prevents jitter during hover and reinforces mission-control precision.
- **Eyebrow Badges:**
  - `text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[var(--mist-dim)] font-mono`
  - Pairs a monospaced technical tag directly above high-impact sans-serif display text.
- **Prose Restraint:** Never allow body copy to span full-width on large monitors. Restrict prose with `max-w-prose` (60–75 characters) for effortless readability.

---

## 5. The "Smell Test" Checklist

Before finalizing any screen or section, ask:
1. *Could this layout be mistaken for an AI template?* If it looks like a generic purple-glowing 3-column bento box, immediately restructure with asymmetric pacing.
2. *Are the numbers authentic and grounded?* Does the copy directly reference Sachin Shakya's track record (Eptura, Downer, LTIMindtree, ABN AMRO)?
3. *Is the surface flat, shadow-free, and tactile?* Are all borders crisp hairlines with modern rounded corners?
4. *Are all figures monospaced tabular numbers?*
