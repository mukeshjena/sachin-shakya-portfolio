# Agent Memory Log — Sachin Shakya Portfolio Site

> **Append-only.** Never delete or edit previous entries.
> Every agent session that performs work MUST add a new dated entry at the bottom.
> This file is the primary defence against context loss across chat sessions.

---

## 2026-09-18 — Step 1: Toolchain & Project Bootstrap (Completed ✅)

**Branch:** `step/01-toolchain-bootstrap` → merged into `main`
**Commit:** `ae253c6 feat(step-01): toolchain bootstrap — Vite+React+TS+TailwindV4+Biome+PWA`

**What was done:**
- Scaffolded Vite 8 + React 19 + TypeScript 6 project into the repo root
- Installed and configured Tailwind CSS v4 via `@tailwindcss/vite` plugin (no `tailwind.config.ts` needed for v4, config embedded in CSS)
- Installed Biome v2.5.14 (replaced oxlint from scaffold); ran `biome migrate --write` to align with v2.5.14 schema
- Installed `vite-plugin-pwa` — manifest placeholder in `vite.config.ts`, icons deferred to Step 26
- Installed `vite-plugin-react` for Fast Refresh
- Cleaned all Vite boilerplate: removed `src/assets/`, `src/App.css`, `.oxlintrc.json`
- Created `src/index.css` with Tailwind v4 import + initial instrument-panel palette tokens
- Created minimal `src/App.tsx` (placeholder) and `src/main.tsx` (under 15 lines)
- Created `.env.example` with all Firebase + Cloudinary + Cloudflare + app keys (blanked)
- Updated `package.json`: renamed to `sachin-shakya-portfolio`, added `check`/`check:fix`/`format`/`seed`/`cleanup` scripts
- `code.old/` preserved: `index.html` (reference design) + `Sachin_Shakya_Resume.pdf`

**Verification:**
- `npm run build` → ✅ 315ms build, TypeScript strict mode passed
- `npx biome check .` → ✅ 10 files, 0 errors after auto-fix
- PWA: `dist/sw.js` + `dist/workbox-*.js` generated

**Key decisions:**
- Tailwind v4 uses `@import "tailwindcss"` in CSS — no JS config file needed
- Biome v2.5.14 uses `"preset": "recommended"` not `"recommended": true`
- `organizeImports` moved to `assist.actions.source.organizeImports` in Biome v2
- `code.old/` and `doc/` excluded from Biome checks via `files.includes`

---

## 2026-09-18 — Step 2: .gitignore, .agent/ Memory System, Strict Rules File (Completed ✅)

**Branch:** `step/02-agent-memory-rules` → merged into `main`

**What was done:**
- Enhanced `.gitignore`: added `.env`/`.env.*` (with `!.env.example` carve-out), `.wrangler`, `*.tsbuildinfo`, `Thumbs.db`
- Created `.agent/agent.md`: 12 non-negotiable rules, full design token table, Clean Architecture constraints, reference path table, per-step workflow protocol
- Created `.agent/memory.md` (this file): append-only session log seeded with Step 1 + Step 2 entries

**Key decisions:**
- `.agent/` folder committed to git so any agent in any future session can read the rules
- `memory.md` is append-only by convention — never edit past entries, only add new dated blocks
- All 12 client rules are numbered and cross-referenced to plan document rule numbers where applicable

---

## 2026-09-18 — Step 3: Clean Architecture Skeleton + DI Container (Completed ✅)

**Branch:** `step/03-clean-architecture-di` → merged into `main`
**Commit:** `5d74211 feat(step-03): clean architecture skeleton + DI container + domain interfaces`

**What was done:**
- Created full four-layer folder skeleton: `domain/`, `application/`, `infrastructure/`, `presentation/`
- **Domain entities** (all in `src/domain/entities/`, max 3 files per folder rule satisfied):
  - `Page.ts` — Page entity with SEO fields, nav flags, sectionOrder[]
  - `Section.ts` — Section entity with SectionType union, type-erased content bag
  - `MediaAsset.ts` — Cloudinary asset tracker with usageRefs for cascade-delete
- **Value objects** (`src/domain/value-objects/`):
  - `Slug.ts` — enforces URL-safe slugs, `tryCreate()` factory for safe parsing
  - `AccessCode.ts` — validates 6-digit numeric OTP, `generate()` uses `crypto.getRandomValues()`
- **Repository interfaces** — split to satisfy 3-file-per-folder rule:
  - `domain/repositories/content/`: IPageRepository, ISectionRepository, IMediaRepository
  - `domain/repositories/admin/`: IAdminAccessRepository, IContactRepository, IEmailSender
- **DI Infrastructure** (`src/infrastructure/di/`):
  - `tokens.ts` — unique Symbols for all 6 repos + 6 use-cases + PingUseCase
  - `container.ts` — hand-rolled typed Container class with `register/resolve/has/clear` + `singleton()` helper
  - `bootstrap.ts` — single registration point, pre-commented stubs for Steps 7–18
- **Application layer**:
  - `application/use-cases/ping/PingUseCase.ts` — throwaway verification use-case
  - `application/dto/PageDTO.ts` — serializes Page entity to React-safe primitives
  - `application/dto/SectionDTO.ts` — serializes Section entity
- **Presentation layer**:
  - `presentation/shared/useContainer.ts` — the ONLY way components access DI
  - `App.hooks.ts` — resolves PingUseCase and calls execute()
  - `App.tsx` — zero-logic, calls useAppPing() hook
  - `main.tsx` — calls bootstrapContainer() before React tree mounts

**Verification:**
- `npm run build` → ✅ 22 modules, 195ms, TypeScript strict mode passed
- `npx biome check .` → ✅ 29 files, 0 errors (5 auto-fixed)
- DI chain verified: App.tsx → App.hooks.ts → useContainer() → PingUseCase.execute() → "pong"

**Key decisions:**
- No tsyringe/inversify — hand-rolled container keeps bundle well under Cloudflare Workers 1 MB limit
- 6 repository interfaces split across 2 subfolders (content/ + admin/) to respect 3-file-per-folder rule
- `singleton()` helper is a closure wrapper, not framework magic — zero overhead
- bootstrap.ts pre-comments every future registration so nothing is missed in later steps

---

## 2026-09-18 — Fix: CSS Extraction + Pre-Commit Gates (post-Step 4 correction)

**Branch:** `fix/css-extraction-precommit-hooks` → merged into `main`
**Commit:** `acbb9c8 fix: extract inline CSS to ComingSoon.css + add pre-commit gates + rules 13/14`

**What was done:**
- **CSS extraction:** Moved `COMING_SOON_STYLES` string constant + `<style>` tag from `ComingSoon.tsx` → new `ComingSoon.css` co-located file. Component now imports `"./ComingSoon.css"`. Zero hardcoded hex values — all use `var(--token-name)`.
- **Pre-commit hook:** Created `.githooks/pre-commit` (shell script) that runs 3 gates before every commit:
  1. `npx biome check .` — lint + format
  2. `npx tsc -b` — TypeScript strict check
  3. `npx vite build --silent` — confirms app bundles
- **Hook activation:** Added `"prepare": "git config core.hooksPath .githooks"` to `package.json`. Runs automatically on `npm install`. Hook path confirmed: `git config core.hooksPath = .githooks`.
- **Rule 13 added** to `agent.md` + plan: No inline `<style>` tags, CSS string constants, or multi-property `style={{}}` in `.tsx`. All styles in co-located `.css` files.
- **Rule 14 added** to `agent.md` + plan: No hardcoded hex/rgba/hsl values in CSS or TSX. Use CSS custom properties only.
- **Palette token table corrected** in `agent.md` to match exact reference values from `code.old/index.html` (petrol navy `#06121a`, amber `#ffb020`, cyan `#49c7e8`, etc.).
- **Pre-Commit Gates section** added to both `agent.md` and implementation plan.

**Verification:**
- `npx biome check .` → ✅ 32 files, 0 errors
- `npm run build` → ✅ 23 modules, 161ms

---

## 2026-09-18 — Universal Separation of Concerns & Git Hook Strict Enforcement

**Branch:** `fix/separation-of-concerns-and-git-hooks` → merged into `main`
**Key Changes:**
- **Universal Separation of Concerns (Rule 13 expanded):**
  - Not just for CSS — covers all constants, hardcoded strings/numbers/labels/metrics, and logic.
  - `ComingSoon.constants.ts` in `src/presentation/coming-soon/constants/`: defines all text copy, badges, stats, social links, footer, and launch date.
  - `ComingSoon.utils.ts` in `src/presentation/coming-soon/utils/`: pure calculation and zero-padding logic (`calculateTimeRemaining`, `padZero`).
  - `ComingSoon.hooks.ts`: purely orchestrates React state and timer interval lifecycle.
  - `ComingSoon.tsx`: pure declarative JSX template with zero hardcoded text strings, numbers, or logic.
  - Structure adheres strictly to Rule 2 (max 3 files per folder).
- **Prohibition of `--no-verify` (Rule 15):**
  - Explicitly banned `--no-verify` (and `-n`) on BOTH `git commit` and `git push`.
  - Removed all emergency bypass suggestions from hooks and documentation.
  - Created `.githooks/pre-push` running Biome lint/format, TypeScript strict typecheck, and Vite production build before every push.
  - Updated `.githooks/pre-commit` to strictly forbid `--no-verify`.
- **Documentation:**
  - Updated `.agent/agent.md` (Rules 3, 7, 13, 15, "What Goes Where" reference, and Pre-Commit & Pre-Push Gates).
  - Updated `doc/SACHIN-SHAKYA-SITE-IMPLEMENTATION-PLAN.md` (Rules 13, 14, 15, and Pre-Commit & Pre-Push Gates).

---

## 2026-09-18 — Step 5: First Cloudflare Worker Deploy via Wrangler

**Branch:** `step/05-cloudflare-first-deploy` → merged into `release/v1.0.0`, `main`, and `develop`
**Commit:** `feat(step-05): first cloudflare worker deploy via wrangler`

**What was done:**
- Installed `wrangler` (v4.134.0) as devDependency.
- Created `wrangler.toml` configuring Cloudflare Workers Static Assets (`./dist` directory, SPA routing mode).
- Configured routes:
  - Custom domain: `shakya.mukeshjena.com`
  - Workers dev endpoint: `https://sachin-shakya-portfolio.muk3shjena.workers.dev`
- Added `"deploy": "npm run build && wrangler deploy"` script to `package.json`.
- Deployed via `npx wrangler deploy` under Account ID `42dd65dfa56dd247b6a172a6bdaae4b2`.
- Confirmed live HTTP 200 response serving HTML, bundled CSS/JS, and PWA manifest.
- Status Ledger updated: Step 5 → `Completed ✅`.




