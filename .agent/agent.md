# Agent Operating Rules — Sachin Shakya Portfolio Site

> **Read this file first in every new session.** It is the single source of truth for rules,
> design decisions, and reference paths. Cross-reference `.agent/memory.md` for what has
> already been built so far.

---

## Skills This Agent Embodies

- **Senior React/TypeScript engineer** — Clean Architecture, Dependency Injection, strict TypeScript
- **Cloud/DevOps engineer** — Firebase (Firestore Native mode), Cloudflare Workers, GitHub Actions, Wrangler CLI
- **UI/UX designer** — Sci-fi-professional "instrument panel" aesthetic, mobile-app-grade responsiveness, depth without shadows
- **SEO specialist** — Technical SEO parity with `DIIRA-INDUSTRIAL-FUEL` reference project (JSON-LD, sitemap, OG, canonical)
- **QA reviewer** — Accessibility (WCAG AA), performance (Lighthouse ≥ 90), rule compliance audits

---

## Non-Negotiable Rules (enforce on every file, every PR)

| # | Rule | Why |
|---|------|-----|
| 1 | **Max 500 lines per file** (target 300–500). | Keeps files reviewable and focused. |
| 2 | **Max 3 files per folder.** Split into subfolders beyond that. | Prevents folder bloat and forces clear separation. |
| 3 | **Zero logic in `.tsx` files.** Logic lives in co-located `.hooks.ts` / `.ts` files. | Enforces presentation-layer purity. |
| 4 | **No `box-shadow` anywhere** — in CSS, Tailwind classes, or inline styles. | Client's strict rule #12. Depth via border/gradient layering only. |
| 5 | **No debounced inputs anywhere.** Validate on submit and on blur only. | Client's strict rule #12. |
| 6 | **No emojis anywhere** — in code, content, or comments. Cupertino/outline icons only (`react-icons/pi` or `react-icons/io5`). | Client's strict rule. |
| 7 | **Zero hardcoded content/images/URLs in components.** Everything comes from Firestore. | Makes content admin-editable without deploys. |
| 8 | **Presentation layer never imports Firebase or Cloudinary directly.** Always through the DI container (`useContainer()`). | Clean Architecture boundary enforcement. |
| 9 | **Every new feature that adds content or media MUST update `scripts/seed/seed-content.ts` and/or `scripts/seed/seed-media.ts`.** | Seed file always reflects site truth (client rule #10). |
| 10 | **TypeScript strict mode is always on.** No `any`, no `!` non-null assertions without a `// safe:` comment explaining why. | Type safety throughout. |
| 11 | **No new npm packages without checking bundle impact.** Free-tier Cloudflare Workers has a 1 MB script size limit. | Budget/performance constraint. |
| 12 | **Commit message format:** `feat(step-NN): <short description>` | Consistent history for the ledger. |

---

## Design Principles

### Palette — "Instrument Panel" (dark-first)
Tokens are defined in `src/index.css` and extended in `tailwind.config.ts` (Step 12).

| Token | Value | Usage |
|-------|-------|-------|
| `--ink-900` | `#0a0e1a` | Page background |
| `--ink-800` | `#111827` | Card/surface background |
| `--ink-700` | `#1f2937` | Elevated surface |
| `--accent-amber` | `#f59e0b` | Primary accent (CTAs, headings) |
| `--accent-cyan` | `#06b6d4` | Secondary accent (links, highlights) |
| `--accent-live` | `#22c55e` | Status / live indicators |
| `--text-primary` | `#f9fafb` | Body text |
| `--text-secondary` | `#9ca3af` | Muted / caption text |

### Depth Without Shadows
- Layered gradients (`bg-gradient-to-br`) instead of `box-shadow`
- `backdrop-filter: blur()` + translucent backgrounds for "glass" surfaces (header, mobile nav)
- Border-based elevation: `border border-white/10` on elevated surfaces

### Motion Principles
- **Framer Motion** for all UI transitions (entrances, page transitions, layout shifts)
- **Three.js / @react-three/fiber** for the hero background only — never for UI elements
- `prefers-reduced-motion`: all animations must have static fallbacks
- Pause Three.js animation loop when hero is out of viewport (IntersectionObserver)

### Typography
- Primary: `Inter` (Google Fonts) — loaded in `index.html`
- Monospace: `JetBrains Mono` — code snippets, terminal-style labels
- No system emoji fonts; no browser-default serif

### Icons
- Library: `react-icons/pi` (Phosphor) **outline** variants only
- Fallback: `react-icons/io5` outline variants
- Zero emoji characters anywhere in the codebase

---

## Architecture Rules

### Clean Architecture Layers
```
presentation/  →  application/  →  domain/  ←  infrastructure/
```
- `domain/` — entities + interfaces ONLY. Zero framework imports.
- `application/` — use-cases. Depends only on domain interfaces.
- `infrastructure/` — concrete implementations (Firestore, Cloudinary, EmailAPI).
- `presentation/` — React components (.tsx, view-only) + hooks (.ts, all logic).

### DI Container
- Single registry: `src/infrastructure/di/container.ts`
- Components resolve deps via `useContainer()` hook only
- Never `import { db } from '../../infrastructure/firebase/firebaseClient'` inside a component

---

## Reference Paths (Local Windows Filesystem)

| Purpose | Path | Used In Step |
|---------|------|-------------|
| Cloudflare deploy workflow (adapt, don't copy secrets) | `D:\MyFiles\p2m-solutions\p2m-projects\ODINA-GARMENTS-PRIVATE-LIMITED\.github\workflows\deploy-cloudflare.yml` | Step 6 |
| Email service integration pattern | `D:\MyFiles\portfolio-mukesh\mukesh-portfolio\src\services\emailService.js` | Steps 18, 19, 20 |
| Dynamic page builder + SEO reference | `D:\MyFiles\p2m-solutions\p2m-projects\DIIRA-INDUSTRIAL-FUEL` | Steps 17, 25 |
| Logo source (all favicon/OG sizes generated from this) | `C:\Users\LenovO\Downloads\sachin-logo.png` | Step 25 |
| Hero / About image #1 | `C:\Users\LenovO\Downloads\sachin-one.png` | Steps 15, 16 |
| Hero / About image #2 | `C:\Users\LenovO\Downloads\sachin-two.png` | Step 16 |
| Cloudinary credentials | ODINA-GARMENTS Cloudinary account (cloud name, API key/secret) | Step 8 |
| Cloudflare credentials | ODINA-GARMENTS Cloudflare account (API token, account ID) | Steps 5, 6 |

---

## Workflow (per step)

1. Find first `Pending` step in `doc/SACHIN-SHAKYA-SITE-IMPLEMENTATION-PLAN.md` Status Ledger.
2. Read that step's Objective, Local Inputs Required, Actions, Definition of Done.
3. Create branch `step/NN-short-name` from `main`.
4. Implement. Enforce all rules above.
5. Append dated entry to `.agent/memory.md`.
6. Update Status Ledger row: `Pending` → `Completed ✅`.
7. Commit: `feat(step-NN): <description>`. Push branch. Merge into `main` (until `release/v1.0.0` exists, from Step 4 onward merge into that).
8. Report summary and stop. Wait for human to type `continue`.
