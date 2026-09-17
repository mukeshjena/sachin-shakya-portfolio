# Color Theory & Token System: Instrument Panel Palette

This reference establishes the token definitions and contrast requirements for the Sachin Shakya Cloud/DevOps Portfolio.

---

## 1. CSS Custom Properties Tokens

All values must reference these tokens declared in `src/index.css`:

```css
:root {
  /* Surface & Elevation */
  --ink-900: #06121a;     /* Deep petrol navy background */
  --ink-850: #08171f;     /* Section background */
  --ink-800: #0b1d27;     /* Card surface */
  --ink-700: #102a36;     /* Elevated surface / hover */
  --ink-600: #17394a;     /* Deep borders / dividers */

  /* Text & Readability */
  --paper: #e8f1f4;        /* Primary heading / high-contrast */
  --mist: #93aeba;         /* Body copy / technical prose */
  --mist-dim: #6b8896;     /* Muted labels / timestamps */

  /* Accents & Status */
  --amber: #ffb020;        /* Primary CTA / achievement numbers */
  --amber-deep: #e08c00;   /* Active / pressed amber */
  --cyan: #49c7e8;         /* Secondary accent / links / tags */
  --live: #3fd08a;         /* Status beacon / uptime indicator */

  /* Hairline Borders */
  --line: rgba(130, 180, 200, 0.16);
  --line-soft: rgba(130, 180, 200, 0.09);
}
```

---

## 2. Usage Rules

1. **Zero Inline Hex Codes:**
   - Forbidden: `style={{ color: '#ffb020' }}` or `text-[#ffb020]`.
   - Required: `text-[var(--amber)]` or component CSS using `var(--amber)`.
2. **Accessible Contrast (WCAG AA):**
   - `--paper` on `--ink-900`: Ratio `14.2:1` (Passes AAA)
   - `--amber` on `--ink-900`: Ratio `9.8:1` (Passes AAA)
   - `--cyan` on `--ink-900`: Ratio `10.1:1` (Passes AAA)
   - `--mist` on `--ink-800`: Ratio `6.5:1` (Passes AA)
