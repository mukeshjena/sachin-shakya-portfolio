---
name: ui-polish-critique
description: >-
  Systematic visual critique, anti-pattern detection, and polish QA enforcing shadow-free, emoji-free,
  and color-consistent luxury design standards with modern rounded corners. Activate when reviewing, refactoring, evaluating,
  or finishing UI components, pages, dashboards, or layouts.
---

# UI Polish & Visual Critique Framework

Use this skill to audit frontend code to ensure strict adherence to **shadow-free minimalist luxury, zero emojis, zero debounced inputs, color token consistency, and clean architecture boundaries**.

---

## The 5-Step Critique Workflow

```
 ┌─────────────────────────────────────────────────────────────┐
 │  Step 1: Visual Artifact Scan                               │
 │  Flag and remove any `shadow-*`, `box-shadow`, hover zooms  │
 └──────────────────────────────┬──────────────────────────────┘
                                │
 ┌──────────────────────────────▼──────────────────────────────┐
 │  Step 2: Emoji & Iconography Audit                          │
 │  Flag and replace any unicode emojis with Cupertino icons   │
 └──────────────────────────────┬──────────────────────────────┘
                                │
 ┌──────────────────────────────▼──────────────────────────────┐
 │  Step 3: Color Token Consistency                            │
 │  Flag and replace any hardcoded hex/rgb with CSS tokens     │
 └──────────────────────────────┬──────────────────────────────┘
                                │
 ┌──────────────────────────────▼──────────────────────────────┐
 │  Step 4: Separation of Concerns (Rule 13)                   │
 │  Ensure .tsx is pure declarative view; logic in hooks/utils │
 └──────────────────────────────┬──────────────────────────────┘
                                │
 ┌──────────────────────────────▼──────────────────────────────┐
 │  Step 5: Typographic & Spatial Verification                 │
 │  Verify 8pt spacing grid, tabular-nums on metrics, max 500L │
 └─────────────────────────────────────────────────────────────┘
```

---

## 1. Visual Artifact Scan
- Search for `shadow-` or `box-shadow`. Every instance must be eliminated.
- Search for `hover:scale-` or `scale-`. Replace with subtle border/color highlight.

## 2. Emoji & Iconography Audit
- Ensure zero emojis in all code, comments, or copy strings.
- Verify outline icons only (`react-icons/pi` or `react-icons/io5`).

## 3. Color Token Verification
- Confirm that no component contains inline hex codes (e.g. `#06121a`, `#ffb020`).
- Ensure all styling uses CSS custom properties (`var(--amber)`, `var(--ink-900)`).

## 4. Separation of Concerns Audit (Rule 13)
- Check `.tsx` file: Does it have state calculations, date formatting, or raw string copy? If so, extract to `.utils.ts` or `.constants.ts`.
- Check folder file count: Does any folder exceed 3 files? If so, split into subfolders.

👉 *See full checklist*: [anti_patterns_checklist.md](./references/anti_patterns_checklist.md)
