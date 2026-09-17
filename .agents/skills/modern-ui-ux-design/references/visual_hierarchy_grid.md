# Visual Hierarchy & 8-Point Grid System

Layout mechanics and spatial density standards for the Sachin Shakya Portfolio.

---

## 1. 8-Point Spacing Grid

Use strict 8px multiples for padding, margin, and gap:
- `p-2` / `gap-2` (8px): Micro-spacing, tag padding, icon offsets
- `p-4` / `gap-4` (16px): Card internal compact padding, form fields
- `p-6` / `gap-6` (24px): Standard card padding, grid column gaps
- `p-8` / `gap-8` (32px): Large card padding, dashboard container
- `py-16` (64px): Mobile section vertical padding
- `py-24` (96px): Desktop section vertical padding

---

## 2. Container & Breakpoints

- Outer max container width: `max-w-7xl` (`1280px`) with `mx-auto px-4 sm:px-6 lg:px-8`.
- Text container width: `max-w-3xl` for section intros.
- Breakpoints:
  - `sm`: `640px`
  - `md`: `768px` (desktop header vs mobile bottom nav swap threshold)
  - `lg`: `1024px`
  - `xl`: `1280px`

---

## 3. Layered Elevation Without Shadows

```
Layer 0: Background Canvas     → var(--ink-900)
Layer 1: Section Surface       → var(--ink-850)
Layer 2: Standard Card         → var(--ink-800) + border 1px var(--line)
Layer 3: Elevated Card / Hover → var(--ink-700) + border 1px var(--amber) or var(--cyan)
Layer 4: Floating Chrome       → var(--ink-900)/80 + backdrop-blur-xl + border 1px white/10
```
