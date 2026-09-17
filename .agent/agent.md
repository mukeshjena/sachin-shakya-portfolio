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
| 3 | **Zero logic in `.tsx` files.** Pure declarative view markup only. Logic lives in co-located `.hooks.ts` or pure `.utils.ts` files. | Enforces presentation-layer purity. |
| 4 | **No `box-shadow` anywhere** — in CSS, Tailwind classes, or inline styles. | Client's strict rule #12. Depth via border/gradient layering only. |
| 5 | **No debounced inputs anywhere.** Validate on submit and on blur only. | Client's strict rule #12. |
| 6 | **No emojis anywhere** — in code, content, or comments. Cupertino/outline icons only (`react-icons/pi` or `react-icons/io5`). | Client's strict rule. |
| 7 | **Zero hardcoded content, values, images, URLs, copy text, or metrics in components or hooks.** Everything comes from Firestore or dedicated `.constants.ts` / `.data.ts` / config files. | Makes content admin-editable without deploys. |
| 8 | **Presentation layer never imports Firebase or Cloudinary directly.** Always through the DI container (`useContainer()`). | Clean Architecture boundary enforcement. |
| 9 | **Every new feature that adds content or media MUST update `scripts/seed/seed-content.ts` and/or `scripts/seed/seed-media.ts`.** | Seed file always reflects site truth (client rule #10). |
| 10 | **TypeScript strict mode is always on.** No `any`, no `!` non-null assertions without a `// safe:` comment explaining why. | Type safety throughout. |
| 11 | **No new npm packages without checking bundle impact.** Free-tier Cloudflare Workers has a 1 MB script size limit. | Budget/performance constraint. |
| 12 | **Commit message format:** `feat(step-NN): <short description>` | Consistent history for the ledger. |
| 13 | **Strict separation of concerns across ALL layers — nothing hardcoded in `.tsx` or `.hooks.ts`.**<br>• **Styles** → dedicated `.css` files (co-located or global) using CSS custom properties.<br>• **Constants & Hardcoded Values** → dedicated `.constants.ts` or `src/config/` (all copy, labels, badge texts, metrics, magic numbers, strings, keys, dates).<br>• **Static & Mock Data** → dedicated `.data.ts` files.<br>• **Computation / Formatting Logic** → dedicated `.utils.ts` files (pure functions).<br>• **State & Lifecycles** → dedicated `.hooks.ts` files (orchestrates React state and hooks only).<br>• **Markup / View** → dedicated `.tsx` files (pure declarative JSX templates).<br>The ONLY allowed inline style exception is a single dynamic runtime style like `style={{ width: \`${pct}%\` }}`. | Complete architectural purity, maintainability, and testability. |
| 14 | **No hardcoded hex/rgba/hsl colour values in any file.** Use CSS custom properties from `src/index.css` `:root` exclusively — `var(--amber)`, not `#ffb020`. | Single palette source of truth. |
| 15 | **`--no-verify` (and `-n`) is STRICTLY PROHIBITED on BOTH `git commit` and `git push`.** Never bypass git hooks under any circumstances. Skipping hooks allows bad formatting, lint errors, broken types, and failing builds to slip through into git history and origin branches. If a pre-commit or pre-push check fails, diagnose and fix the code immediately. | Gate integrity — skipping hooks defeats automated quality enforcement. |

### What Goes Where (Rule 13 reference)

| Content type | Lives in | Example |
|---|---|---|
| Component markup | `ComponentName.tsx` | Pure declarative JSX only; zero logic, zero inline styles, zero hardcoded strings/numbers |
| Component state & lifecycle | `ComponentName.hooks.ts` | `useState`, `useEffect`, wires utils & constants; zero computation math, zero inline constants |
| Pure computation / utility logic | `ComponentName.utils.ts` | Calculations, date/time math, string formatting, pure algorithms |
| Component styles | `ComponentName.css` | All CSS, no hex values — use `var(--token-name)` |
| Constants / magic values / copy text | `ComponentName.constants.ts` | Headings, badge text, labels, aria labels, metrics, `LAUNCH_DATE`, timeouts |
| Static / seed data | `ComponentName.data.ts` | Nav items, mock content, static item lists |
| Shared / global config | `src/config/` | API base URLs, feature flags, env reads |
| Business & application logic | `application/use-cases/` | Orchestrates domain operations and repositories |
| Domain rules & models | `domain/entities/` or `domain/value-objects/` | Invariants, schemas, validation |

---

## Pre-Commit & Pre-Push Gates

The repository enforces automated validation gates via `.githooks/pre-commit` and `.githooks/pre-push`.
Activated automatically by `npm run prepare` (`git config core.hooksPath .githooks`).

| Gate | Runs On | Checks Executed |
|---|---|---|
| **Pre-Commit** | `git commit` | 1. Biome lint & format check (`npx biome check .`)<br>2. TypeScript strict typecheck (`npx tsc -b`)<br>3. Vite production build (`npx vite build --logLevel silent`) |
| **Pre-Push** | `git push` | 1. Biome lint & format check (`npx biome check .`)<br>2. TypeScript strict typecheck (`npx tsc -b`)<br>3. Vite production build (`npx vite build --logLevel silent`) |

> **STRICT PROHIBITION OF `--no-verify` (Rule 15):**
> Using `--no-verify` or `-n` with `git commit` or `git push` is **STRICTLY FORBIDDEN**.
> Bypassing gates undermines repository integrity and risks pushing erroneous or failing code.
> If a check fails, diagnose and fix the root cause before committing or pushing.


## Design Principles

### Palette — "Instrument Panel" (dark-first)
Tokens are defined in `src/index.css` and extended in `tailwind.config.ts` (Step 12).

| Token | Value | Usage |
|-------|-------|-------|
| `--ink-900` | `#06121a` | Page background (deepest petrol navy) |
| `--ink-850` | `#08171f` | Section background |
| `--ink-800` | `#0b1d27` | Card/surface background |
| `--ink-700` | `#102a36` | Elevated surface |
| `--ink-600` | `#17394a` | Borders, dividers |
| `--mist` | `#93aeba` | Body text / secondary text |
| `--mist-dim` | `#6b8896` | Muted / caption text |
| `--paper` | `#e8f1f4` | Primary text (near-white with blue tint) |
| `--amber` | `#ffb020` | Primary accent (CTAs, headings) |
| `--amber-deep` | `#e08c00` | Hover/pressed amber state |
| `--cyan` | `#49c7e8` | Secondary accent (links, highlights) |
| `--live` | `#3fd08a` | Live status indicators only |
| `--line` | `rgba(130,180,200,.16)` | Borders |
| `--line-soft` | `rgba(130,180,200,.09)` | Subtle dividers |

> Fonts: `--f-display` = Archivo, `--f-body` = IBM Plex Sans, `--f-mono` = IBM Plex Mono

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
