# Anti-Patterns Checklist: Non-Negotiable Review Rules

Run through this checklist before approving any frontend PR or component:

---

## 1. Visual Anti-Patterns

| Anti-Pattern | Why It Is Forbidden | Correct Alternative |
|---|---|---|
| `shadow-md`, `shadow-lg`, `box-shadow` | Client Rule 4: depth comes from border/gradient layering only. | `border border-[var(--line)] bg-[var(--ink-800)]` |
| Unicode Emojis (🚀, 💡, 🔥, etc.) | Client Rule 6: strictly unprofessional and juvenile. | Outline icons from `react-icons/pi` or `react-icons/io5` |
| `hover:scale-105` zoom | Distorts geometry and causes subpixel font blurring. | `hover:border-[var(--amber)] hover:bg-[var(--ink-700)]` |
| Debounced input handling | Client Rule 5: adds sluggish artificial latency. | Validate on blur (`onBlur`) and submit (`onSubmit`). |
| Inline hex colors (`#ffb020`, `bg-[#06121a]`) | Rule 14: breaks global theme adaptability. | `var(--amber)`, `var(--ink-900)` custom properties. |

---

## 2. Architectural Anti-Patterns

| Anti-Pattern | Why It Is Forbidden | Correct Alternative |
|---|---|---|
| Business/formatting logic in `.tsx` | Rule 3 & 13: presentation layer must remain pure view templates. | Extract calculation to `.utils.ts`, state to `.hooks.ts`. |
| Hardcoded copy / metrics in `.tsx` | Rule 7 & 13: prevents dynamic Firestore and central updates. | Define copy in `.constants.ts`, fetch from Firestore. |
| Direct Firebase/Cloudinary import in UI | Rule 8: breaks Clean Architecture boundaries. | Inject via DI container (`useContainer()`). |
| More than 3 files in one directory | Rule 2: creates folder bloat and tangled concerns. | Subdivide into subfolders (e.g. `constants/`, `utils/`). |
| File exceeding 500 lines | Rule 1: causes cognitive overload and poor reviewability. | Split into composable subcomponents or helper modules. |

---

## 3. Anti-AI Aesthetic Smell Tests

| Anti-Pattern | Why It Is Forbidden | Correct Alternative |
|---|---|---|
| Monotonous 3-column bento grids | Hallmark of lazy AI web generators; lacks hierarchy. | Asymmetric editorial layouts (65/35 splits, offset sidebars, telemetry panoramas). |
| Neon radial blur blobs / glowing halos | Cheap AI aesthetic; lacks executive maturity. | Flat matte canvas (`var(--ink-900)`), hairline 1px borders (`var(--line)`), layered fills. |
| Robotic corporate buzzwords | Vague AI filler text that damages technical credibility. | Concrete technical milestones ($170K/mo savings, 40% MTTR reduction, Eptura, Downer, Azure, AWS). |
| Uniform card height and padding | Feels machine-generated and flat. | Varied visual pacing, dominant hero statistics, and breathing negative space. |
| Non-tabular numbers on metrics | Numbers shift and jitter; looks unpolished. | `tabular-nums font-mono` for all KPIs, timestamps, and chart ticks. |

