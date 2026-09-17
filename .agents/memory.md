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

---

## 2026-09-18 — Step 6: Atomic CI/CD Pipeline (GitHub Actions)

**Branch:** `step/06-cicd-pipeline` → merged into `release/v1.0.0`, `main`, and `develop`
**Commit:** `feat(step-06): atomic ci/cd pipeline via github actions`

**What was done:**
- Configured GitHub Secrets on `mukeshjena/sachin-shakya-portfolio`:
  - `CLOUDFLARE_ACCOUNT_ID` (`42dd65dfa56dd247b6a172a6bdaae4b2`)
  - `CLOUDFLARE_API_TOKEN` (reused verified token from ODINA project per Rule 16)
- Created `.github/workflows/deploy-cloudflare.yml` adapting canonical ODINA & DIIRA patterns:
  1. Triggers: push to `main`, PRs into `main` and `release/v1.0.0`, `workflow_dispatch`.
  2. Concurrency: `group: production-cloudflare-deploy` with `cancel-in-progress: true`.
  3. Pre-flight secrets audit.
  4. Node 24 setup with npm caching.
  5. Biome code quality check.
  6. TypeScript strict typecheck.
  7. Vite production build.
  8. Bundle size budget validation (<1000 KB index, <3000 KB total JS).
  9. Atomic zero-downtime deploy to Cloudflare Workers via `npx wrangler deploy`.
- Verified live GitHub Actions run on `main`: Run `#35277357086` succeeded in 30s.
- Status Ledger updated: Step 6 → `Completed ✅`.

---

## 2026-09-18 — Streamlined Quality Gate & Atomic Pipeline Alignment

**Key Changes:**
- **Single Quality Gate:**
  - Removed `.githooks/pre-push` to eliminate redundant double checks and enable instant `git push` operations.
  - `.githooks/pre-commit` remains the single strict gate running all 3 validations (Biome lint/format, TypeScript strict typecheck, and Vite production build).
  - Rule 15 updated in `.agent/agent.md` and `doc/SACHIN-SHAKYA-SITE-IMPLEMENTATION-PLAN.md` to reflect that `--no-verify` is strictly prohibited on `git commit`.
- **Atomic Pipeline Alignment (Reference Parity):**
  - Updated `.github/workflows/deploy-cloudflare.yml` to match canonical reference project `DIIRA-INDUSTRIAL-FUEL`.
  - Added concurrency group `production-cloudflare-deploy` (`cancel-in-progress: true`), formatted secrets audit, security audit, dependency freshness check, post-deploy secret synchronization to Cloudflare Worker store, live edge health check (`shakya.mukeshjena.com`), and PR preview deployments.
  - Added `.nvmrc` pinning Node.js 24 LTS.
- **Firebase Project Initialized:**
  - Created GCP / Firebase project `sachin-shakya-site` via Firebase CLI.
- **Workflow Control:**
  - Paused execution per user instruction; standing by for explicit `continue` before proceeding to Step 7.

---

## 2026-09-18 — Full `.agents` Workspace Customization Framework (Rules & Skills)

**Key Additions:**
- Implemented the complete Antigravity `.agents/` customization framework matching reference project `DIIRA-INDUSTRIAL-FUEL` and `ODINA-GARMENTS-PRIVATE-LIMITED`:
  - **Rules (`.agents/rules/`):**
    1. `design-aesthetics-and-standards.md` — Sci-fi professional instrument panel aesthetics, shadow-free surfaces, zero emojis, zero debounced inputs, color token consistency, dual mobile app dock vs desktop web chrome.
    2. `clean-architecture-and-code-standards.md` — 4 Clean Architecture layers, DI container enforcement via `useContainer()`, Universal Separation of Concerns (Rule 13), 500 LOC max, 3 files/folder max.
    3. `git-workflow-and-branching-order.md` — 4-stage promotion flow, single pre-commit gate, rapid push, strict ban on `--no-verify`.
    4. `reference-odina-diira.md` — Direct filesystem mapping to ODINA and DIIRA canonical reference implementations.
  - **Skills (`.agents/skills/`):**
    1. `modern-ui-ux-design/SKILL.md` with 5 detailed reference guides (`color_theory_tokens.md`, `component_design_blueprints.md`, `micro_interactions_motion.md`, `typography_pairing.md`, `visual_hierarchy_grid.md`).
    2. `ui-polish-critique/SKILL.md` with `anti_patterns_checklist.md`.
    3. `devops-portfolio-seo/SKILL.md` — Enterprise JSON-LD Schema.org, OpenGraph, dynamic sitemap, Core Web Vitals.
- Strict pause enforced: Waiting for user to explicitly type `continue` before starting Step 7.

---

## 2026-09-18 — Consolidated Single `.agents` Customization & Memory Hub

**Key Changes:**
- **Single Folder Architecture:**
  - Removed duplicate `.agent/` folder entirely. Everything is unified in `.agents/`.
  - Moved and combined `agent.md` and `memory.md` into `.agents/agent.md` and `.agents/memory.md`.
  - Updated all plan links and documentation references to point to `.agents/`.
- **Complete 6-Persona Skill Suite (`.agents/skills/`):**
  1. `modern-ui-ux-design` — Sci-fi instrument panel, shadow-free surfaces, color tokens, micro-interactions, typography, 8pt grid.
  2. `ui-polish-critique` — 5-step critique workflow and anti-patterns checklist.
  3. `devops-portfolio-seo` — Schema.org JSON-LD, OpenGraph, sitemap, Core Web Vitals.
  4. `senior-react-typescript-engineer` — Clean Architecture, DI container, Rule 13 separation of concerns, strict TS.
  5. `cloud-devops-engineer` — Cloudflare Workers, Firebase Native mode, multi-tab cache, atomic CI/CD pipeline.
  6. `qa-reviewer-audit` — Automated pre-commit audit, accessibility (WCAG AA), bundle budget check, lint verification.
- **Rules Suite (`.agents/rules/`):**
  - `clean-architecture-and-code-standards.md`
  - `design-aesthetics-and-standards.md`
  - `git-workflow-and-branching-order.md`
  - `reference-odina-diira.md`
- **Cross-Session Continuity:**
  - `.agents/agent.md` and `.agents/memory.md` now serve as the permanent, unified context source across all IDE sessions.

---

## 2026-09-18 — Step 7: Firebase Project + Firestore (Native Mode) (Completed ✅)

**Branch:** `step/07-firebase-firestore-bootstrap` → merged into `release/v1.0.0`, `main`, and `develop`
**Commit:** `2e72d5e feat(step-07): bootstrap firebase project and firestore native database`

**What was done:**
- Created Firebase/GCP Project: `sachin-shakya-site` (Project Number: `1052981737437`).
- Provisioned Cloud Firestore in **Native mode** in region `asia-south1` (Mumbai).
- Created Web App: `sachin-shakya-web` (App ID: `1:1052981737437:web:b7839c633209bb78446834`, API Key: `AIzaSyCn3ngUlrnCnUIWYXQ_xXXZikZvviFed40`).
- Generated Firebase config files:
  - `.firebaserc` pointing to `sachin-shakya-site`.
  - `firebase.json` configuring Firestore rules, indexes, and emulators.
  - `firestore.rules` containing published-state helper and collection security policies matching DIIRA reference architecture.
  - `firestore.indexes.json` configured for compound queries.
  - Deployed Firestore security rules live: `firebase deploy --only firestore:rules --project sachin-shakya-site` (Status: released to cloud.firestore).
- Environment and Secret Configuration:
  - Local `.env` configured with `VITE_FIREBASE_*` and `VITE_SITE_URL`.
  - Updated GitHub repository secrets via `gh secret set`: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_SITE_URL`.
  - Updated `.github/workflows/deploy-cloudflare.yml` to supply `VITE_*` secrets to Vite build step.
- Clean Architecture Infrastructure:
  - Created `src/infrastructure/system/env.ts` with strongly typed `createEnvConfig()`, multi-runtime fallback (window.__APP_CONFIG__, Vite import.meta.env, Node process.env), strictly adhering to 3 files/folder limit.
  - Created `src/infrastructure/firebase/firebaseClient.ts` with multi-tab persistent IndexedDB caching (`persistentMultipleTabManager`) to preserve free-tier read quotas, with environment detection to avoid Node/script warnings.
  - Registered `FirestoreDb` and `EnvConfig` tokens in `src/infrastructure/di/tokens.ts` and `src/infrastructure/di/bootstrap.ts`.
- Verification:
  - Created `scripts/test-firestore.ts` testing live write, read, and delete operations against `sachin-shakya-site`.
  - Added `npm run test:firestore` to `package.json`.
  - `npm run test:firestore` executed with 100% success and 0 warnings.
  - Quality gates: Biome lint/format passed, `tsc -b` passed, Vite production build passed.
  - CI/CD Run `#35281057331` succeeded on `main` in 46s. Live custom domain `https://shakya.mukeshjena.com` returning HTTP 200 OK.
- Status Ledger updated: Step 7 → `Completed ✅`.

