# Typography Pairing & Hierarchical System

Typography rules and font families for the Sachin Shakya Portfolio.

---

## 1. Font Families

| Role | Font Family | Fallback | Usage |
|---|---|---|---|
| **Display Headings** | Archivo / Inter | `system-ui, -apple-system, sans-serif` | Hero title, section headings, card titles |
| **Body & Narrative** | IBM Plex Sans / Inter | `sans-serif` | Lead paragraphs, bullets, bio text |
| **Monospace / Code** | JetBrains Mono / IBM Plex Mono | `monospace` | Cost savings, metrics, dates, CLI snippets, tags |

---

## 2. Typographic Scale

| Class | Font Size | Line Height | Tracking | Usage |
|---|---|---|---|---|
| `text-5xl` | 3rem (48px) | 1.1 | `-0.025em` | Hero H1 title |
| `text-3xl` | 1.875rem (30px) | 1.2 | `-0.02em` | Section H2 headings |
| `text-xl` | 1.25rem (20px) | 1.3 | `-0.01em` | Card H3 headings |
| `text-base` | 1rem (16px) | 1.6 | `normal` | Body prose |
| `text-sm` | 0.875rem (14px) | 1.5 | `normal` | Secondary text, captions |
| `text-xs` | 0.75rem (12px) | 1.4 | `+0.1em` | Eyebrows, uppercase badges |

---

## 3. Formatting Rules
- Always use `tabular-nums` on numbers, percentages, currency, and countdown digits.
- Constrain prose reading line length to `max-w-prose` (65–75 characters per line).
