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

---

## 2026-09-18 — Secrets Architecture Overhaul: Edge Worker Runtime Injection & Pure Static Builds

**Commit:** `feat(security): sync secrets to cloudflare worker runtime and enforce pure static build`

**What was done:**
- **GitHub Secrets Reset:**
  - Deleted all old secrets from the GitHub repository (`CLOUDFLARE_*`, `VITE_FIREBASE_*`, `VITE_SITE_URL`).
  - Gathered complete production credentials across Firebase, Cloudflare, Cloudinary, and Email microservice:
    - `CLOUDFLARE_ACCOUNT_ID` & `CLOUDFLARE_API_TOKEN` (reused from ODINA)
    - `CLOUDINARY_CLOUD_NAME` (`dq6oxixuf`), `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (from ODINA)
    - `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID` (from `sachin-shakya-site`)
    - `FIREBASE_SERVICE_ACCOUNT_JSON` (generated via Google Cloud IAM CLI: `firebase-adminsdk-fbsvc@sachin-shakya-site.iam.gserviceaccount.com` and minified)
    - `EMAIL_API_URL` (`https://odina.mukeshjena.com/api/email/send`), `EMAIL_RECIPIENT` (`sachin.shakya@live.com`), `EMAIL_PROFILE` (`sachin-shakya`)
    - `SITE_URL` (`https://shakya.mukeshjena.com`)
  - Added all 16 secrets to GitHub repository secrets via `gh secret set`.
- **Pure Static Build & Secret Elimination:**
  - Updated `.github/workflows/deploy-cloudflare.yml` Step 5 (`npm run build`) to run as a pure static build with ZERO environment variables baked in.
  - No credentials exist in `dist/assets/*.js` client bundles.
- **Cloudflare Edge Worker Gateway (`worker/index.ts`):**
  - Created `worker/index.ts` following canonical DIIRA reference pattern.
  - Intercepts requests, delegates static assets directly to `env.ASSETS`, and injects safe runtime configuration (`window.__APP_CONFIG__`) into `index.html` at the edge before serving HTML to the browser.
  - Serves `/api/config` for runtime diagnostic checks.
  - Critical server-only secrets (`CLOUDINARY_API_SECRET`, `FIREBASE_SERVICE_ACCOUNT_JSON`) remain strictly inside the edge worker and are NEVER exposed to client bundles.
- **Wrangler Configuration:**
  - Updated `wrangler.toml` with `main = "worker/index.ts"`, `binding = "ASSETS"`, and `run_worker_first = true`.
  - Pinned `compatibility_date = "2025-09-01"` to avoid Cloudflare server time UTC timezone mismatches.
- **Environment System Alignment (`src/infrastructure/system/env.ts`):**
  - Updated `createEnvConfig()` to read from `window.__APP_CONFIG__` first, then fall back to local `.env` variables (`FIREBASE_*` and `VITE_FIREBASE_*`).
  - Added strongly-typed `email` configuration.
- **Verification:**
  - Pre-commit gates passed (Biome, TypeScript, Vite).
  - CI/CD deployment succeeded in 52s.
  - Verified live `/api/config` returning full runtime configuration from Cloudflare Worker secrets.

---

## 2026-09-18 — Telemetry & FinOps Cost Comparison Charts Integration

**Commit:** `docs: integrate telemetry and cost comparison charts into implementation plan and design standards`

**What was done:**
- **Updated `doc/SACHIN-SHAKYA-SITE-IMPLEMENTATION-PLAN.md`:**
  - **Section 2 (Tech Stack):** Added custom declarative responsive SVG telemetry chart components with zero bundle bloat and strict Clean Architecture separation (chart coordinates, scale generators, and formatters in `.utils.ts`; state/scrubbers in `.hooks.ts`; hairline borders and tokens in `.css`).
  - **Section 5 (Content & Data Model):** Added `telemetryMetrics` collection for multi-series historical and comparison datasets powering 4 interactive instrument-panel graphs.
  - **Step 9 (Domain Model & Firestore Schema):** Added domain entity models: `TelemetryMetric`, `CostComparisonSeries`, `MTTRBenchmark`, `AutomationEfficiencyMetric`, `ResourceDistributionPoint`.
  - **Step 10 (Seed Script):** Mandated deterministic seeding of multi-point datasets for:
    1. FinOps Monthly Cloud Spend & Savings Trajectory (12-month curve from $450K/mo baseline down to $280K/mo, reflecting $170K/mo delta and $2.04M annual milestone).
    2. Incident MTTR Benchmark (P1–P3 breakdown, 120m → 72m, 40% reduction).
    3. DevOps Engineering Automation (manual hours 35h/wk → 8h/wk, 30–40% manual effort reduction).
    4. Multi-Cloud Fleet Distribution (2,000+ resources across Azure 55%, AWS 30%, Hybrid/GCP 15%).
  - **Step 16 (Home Sections):** Upgraded Impact section into an executive **FinOps & Cloud Telemetry Command Center** with interactive multi-graph switcher tabs (Area/Dual-Line, Grouped Bar, Waterfall, Segmented Donut).
  - **Step 17 (Dynamic Page Engine):** Added support for dynamic pages to embed and configure Telemetry Chart sections.
  - **Step 23 (Content Management Modules):** Added CMS editing capabilities for chart series, baseline values, target numbers, and telemetry timestamps.
- **Updated `.agents/rules/design-aesthetics-and-standards.md`:**
  - Added Section 11: "Data Visualization & Telemetry Charts Standard (Instrument Panel Graphs)" enforcing shadow-free visualization, hairline grids, token series mapping (`var(--amber)`, `var(--cyan)`, `var(--live)`), monospaced tabular typography (`font-mono tabular-nums`), and Universal Separation of Concerns (Rule 13).
- **Updated `.agents/agent.md`:**
  - Expanded Senior React/TS and UI/UX specialist persona descriptions to mandate interactive telemetry graphs and FinOps cost comparison visualization rules.
- **Updated `.agents/skills/modern-ui-ux-design/`:**
  - Added Section 6 to `SKILL.md` for telemetry data visualization.
  - Added Blueprint 4: "Telemetry & Cost Comparison Chart Blueprint" to `references/component_design_blueprints.md`.

---

## 2026-09-18 — Edge Security Overhaul: Zero Public Credentials & Protected Session Gateway

**Commit:** `feat(security): eliminate public credentials in HTML and enforce protected edge session gateway`

**What was done:**
- **Eliminated HTML Script Injection:**
  - Removed `<script>window.__APP_CONFIG__=...</script>` injection completely from `worker/index.ts`.
  - The edge worker now serves 100% clean static HTML (`index.html`) directly from `env.ASSETS`.
  - Verified: `curl -s https://shakya.mukeshjena.com | grep "APP_CONFIG"` returns zero matches.
- **Eliminated Public `/api/config` Endpoint:**
  - Removed the unauthenticated route that previously dumped backend credentials.
- **Protected Session Handshake (`GET /api/session/env`):**
  - Added strict browser validation: checks `sec-fetch-site: same-origin`, enforces allowed hostnames (`shakya.mukeshjena.com`, `localhost`), and rejects automated CLI tools/scrapers (`curl`, `wget`, `python`, `postman`) with `403 Forbidden`.
  - Encodes payload as an obfuscated token with strict `Cache-Control: no-store, private` and CORS headers.
- **Server-Side Edge Email Proxy (`POST /api/contact`):**
  - All email operations now proxy through the Edge Worker.
  - Client submits `{ name, email, message, subject? }` to `/api/contact`.
  - Worker validates input, rate-limits by IP, and forwards to `env.EMAIL_API_URL` using `env.EMAIL_RECIPIENT` (`sachin.shakya@live.com`) and `env.EMAIL_PROFILE`.
  - Client JS bundles and network responses never see the recipient email or internal email microservice URL.
- **Enterprise Security Headers:**
  - Added CSP (`default-src 'self'`, `script-src`, `connect-src`), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
- **Clean Architecture Infrastructure Alignment:**
  - `src/infrastructure/system/env.ts`: Added `loadRemoteEnvConfig()`, removed sensitive fallback strings.
  - `src/infrastructure/firebase/firebaseClient.ts`: Implemented lazy `getDb()` and `getFirebaseApp()` with direct `db` export for Node.js scripts.
  - `src/infrastructure/di/bootstrap.ts`: Registered `() => getDb()` and `() => getEnv()` factories.
  - `src/main.tsx`: Asynchronously calls `await loadRemoteEnvConfig()` before DI container bootstrap.

---

## 2026-09-18 — Edge Security & Credentials Protection Skill Created

**Commit:** `feat(skill): add edge-security-and-credentials-protection skill and reference guides`

**What was done:**
- **Created `.agents/skills/edge-security-and-credentials-protection/`:**
  - `SKILL.md`: Comprehensive skill definition covering zero credentials in HTML, protected session handshake, server-side edge proxies, security headers, and GCP API key restrictions.
  - `references/credential_isolation_rules.md`: Secrets classification matrix and build-time/runtime isolation rules.
  - `references/server_side_proxy_patterns.md`: Blueprints for `/api/contact` email proxy and `/api/cloudinary/*` signed upload gateway.
  - `references/gcp_api_key_restrictions.md`: Step-by-step runbook for Google Cloud Console HTTP referrer and API lockdown.
- **Updated `.agents/agent.md`:**
  - Added Persona #7: Edge Security & Credentials Protection Architect.
  - Added skill mapping to Section 4 (Dedicated Skills table).
- **Updated `doc/SACHIN-SHAKYA-SITE-IMPLEMENTATION-PLAN.md`:**
  - Added Edge Security skill to Section 7 skills list.

---

## 2026-09-18 — Step 8: Cloudinary Folder Structure & Signed Uploads (Completed ✅)

**Branch:** `step/08-cloudinary-structure`
**Commit:** `feat(step-08): cloudinary folder structure and signed edge upload gateway`

**What was done:**
- **Cloudinary Folder Structure & Hierarchy (`sachin-shakya/`):**
  - Defined strict folder hierarchy constants in `src/infrastructure/cloudinary/cloudinaryConfig.ts`:
    - `sachin-shakya/logo`
    - `sachin-shakya/home/hero`
    - `sachin-shakya/home/impact`
    - `sachin-shakya/home/experience`
    - `sachin-shakya/pages/{slug}`
    - `sachin-shakya/promo-popup`
    - `sachin-shakya/test`
  - Added image URL transformation helpers (`getOptimizedImageUrl`, `getThumbnailUrl`, `getResponsiveSrcSet`, `resolveCloudinaryFolder`) providing auto-format (`f_auto`), auto-quality (`q_auto`), responsive sizing, and thumbnail crops.
- **Edge Worker Signed Upload & Destroy Gateways (`worker/index.ts`):**
  - Implemented `POST /api/cloudinary/sign`: Generates short-lived SHA-1 signatures via Web Crypto API. Rejects automated/unauthorized scrapers, enforces folder restrictions so uploads cannot escape into unauthorized directories, and returns signature + API key without exposing the API secret.
  - Implemented `POST /api/cloudinary/destroy`: Server-side asset deletion proxy using edge secrets. Enforces that only assets within `sachin-shakya/` can be destroyed.
  - Updated CSP `connect-src` to include `https://api.cloudinary.com`.
- **Domain Layer Integration:**
  - Created `src/domain/services/IMediaUploader.ts`: pure TypeScript interface defining `upload()` and `destroy()` contracts.
- **Infrastructure Layer Modules (`src/infrastructure/cloudinary/`):**
  - `cloudinaryConfig.ts`: Folder paths and image optimization utilities.
  - `cloudinaryClient.ts`: Browser-side signed upload client that coordinates with the Cloudflare Edge Worker gateway.
  - `CloudinaryMediaUploader.ts`: Concrete service implementing `IMediaUploader`.
  - Maintained exact 3-file-per-folder limit (Rule 4).
- **Dependency Injection Wiring:**
  - Added `DI_TOKENS.MediaUploader` in `src/infrastructure/di/tokens.ts`.
  - Registered `CloudinaryMediaUploader` as singleton in `src/infrastructure/di/bootstrap.ts`.
- **Automated Verification Suite:**
  - Created `scripts/test-cloudinary.ts` with automatic `.env` loading.
  - Added `"test:cloudinary": "tsx scripts/test-cloudinary.ts"` to `package.json`.
  - Executed tests: verified signed upload to `sachin-shakya/test/`, verified returned metadata (`secure_url`, `public_id`, dimensions, format, bytes), and successfully verified cleanup via destroy API (`result: "ok"`).
  - Verified `npm run test:firestore` passes.
  - Verified Biome checks (`npm run check`) and strict TypeScript typechecking (`npm run typecheck`).

---

## 2026-09-18 — Governance & Design Overhaul: Per-Step Implementation Plans, Non-Blocking CI/CD, Anti-AI Bespoke UI/UX

**Commit:** `feat(rules): per-step planning, non-blocking CI check, and anti-AI bespoke design skills`

**What was done:**
- **Rule 17: Per-Step Implementation Plan Protocol:**
  - Enforced that for EVERY step, the agent must generate a dedicated `implementation_plan.md` artifact detailing files to modify/create, Clean Architecture layers, DI tokens, anti-AI design rules, and verification plan BEFORE touching code.
  - After completing each step and pushing, the agent must pause and request the user type `continue` before initiating the next step plan.
- **Rule 18: Non-Blocking CI/CD Status Verification:**
  - Eliminated blocking `gh run watch` on pushes to avoid execution delays.
  - Replaced with non-blocking status check: `gh run list --limit 1`. If the previous run failed, the failure must be diagnosed and resolved before concluding the step.
- **Rule 19 & Anti-AI Bespoke UI/UX Skills Overhaul:**
  - **Updated `.agents/rules/design-aesthetics-and-standards.md`:** Added Section 12 ("Anti-AI Design Principles: Bespoke Human-Crafted Executive Mastery") banning monotonous 3-column bento grids, neon radial blur blobs, and robotic AI buzzwords. Enforcing asymmetric tension, 65/35 splits, monumental typography, and authentic cloud engineering telemetry.
  - **Overhauled `.agents/skills/modern-ui-ux-design/`:**
    - Reorganized references into `foundations/` (tokens, typography, visual hierarchy) and `blueprints/` (components, micro-interactions, anti-ai design handbook), strictly respecting the ≤ 3 files per folder rule.
    - Created `references/blueprints/anti_ai_design_handbook.md`: comprehensive guide with diagnostic matrices comparing generic AI output vs master designer craft.
  - **Updated `.agents/skills/ui-polish-critique/`:**
    - Added Step 6 to critique workflow ("Anti-AI Smell Test & Editorial Polish").
    - Added Section 3 to `anti_patterns_checklist.md` with explicit anti-AI smell tests.
  - **Updated `.agents/agent.md` & `doc/SACHIN-SHAKYA-SITE-IMPLEMENTATION-PLAN.md`:**
    - Integrated Rules 17, 18, and 19 into the non-negotiable rules summary and agent persona instructions.

---

## 2026-09-18 — Step 9: Domain Model & Firestore Schema (Completed ✅)

**Branch:** `step/09-domain-model-schema`
**Commit:** `feat(step-09): domain model entities, firestore schema documentation, and composite indexes`

**What was done:**
- **Subfolder Entity Architecture (Strict Rule 2 & 4 Enforcement):**
  - Restructured `src/domain/entities/` into 4 focused subfolders with ≤ 3 files per directory:
    - `content/`: `Page.ts`, `Section.ts` (with `telemetry` section type), `MediaAsset.ts`
    - `telemetry/`: `TelemetryMetric.ts`, `CostComparisonSeries.ts`, `MTTRBenchmark.ts`
    - `profile/`: `Experience.ts`, `Competency.ts`, `Certification.ts` (includes `EducationRecord`)
    - `admin/`: `SiteSettings.ts`, `ContactSubmission.ts`, `PromoPopup.ts`
- **Updated Existing Consumer Import Paths:**
  - `src/domain/repositories/content/ISectionRepository.ts`
  - `src/domain/repositories/content/IPageRepository.ts`
  - `src/domain/repositories/content/IMediaRepository.ts`
  - `src/application/dto/PageDTO.ts`
  - `src/application/dto/SectionDTO.ts`
- **Firestore Database Schema Documentation:**
  - Authored `doc/firestore-schema.md` and `docs/firestore-schema.md`: 1:1 mapping table between Firestore collections and TypeScript domain entities, field specifications, offline multi-tab IndexedDB cache strategy, and deterministic ID naming schemes.
- **Composite Query Indexes Declared (`firestore.indexes.json`):**
  - Declared multi-field composite indexes for `pages` (`isPublished + order`), `sections` (`pageId + order`), `telemetryMetrics` (`category + order`), `competencies` (`category + order`), and `contactSubmissions` (`isArchived + createdAt`).
- **Local Verification & Quality Gates:**
  - Biome linter and formatter: 0 errors (`npm run check`).
  - Strict TypeScript typecheck: 0 errors (`npm run typecheck`).
  - Production build: successfully built client assets (`npm run build`).
  - Integration tests: `npm run test:firestore` & `npm run test:cloudinary` passed.

---

## 2026-09-18 — Step 10: Idempotent Seed Script + Cleanup Script (Completed ✅)

**Branch:** `step/10-seed-cleanup-scripts`
**Commit:** `feat(step-10): idempotent seed script and cleanup script for firestore and cloudinary`

**What was done:**
- **Cloudinary Idempotent Media Seeding (`scripts/seed/seed-media.ts`):**
  - Reads local assets (`sachin-logo.png`, `sachin-one.png`, `sachin-two.png`) from `C:\Users\LenovO\Downloads\`.
  - Checks Firestore `mediaAssets` collection before uploading. If already uploaded (matched by tag or deterministic asset ID), skips re-uploading and logs `[CACHED]`.
  - On first run, computes SHA-1 signature and uploads directly via Cloudinary REST API to folder structure:
    - `sachin-shakya/logo/`
    - `sachin-shakya/home/hero/`
    - `sachin-shakya/home/experience/`
  - Saves metadata record to Firestore collection `mediaAssets`.
- **Firestore Full Schema Content Seeding (`scripts/seed/seed-content.ts`):**
  - Populates 10 Firestore collections with 100% deterministic document IDs and `setDoc(..., { merge: true })`:
    - `siteSettings/global`: executive headline, bio, contact emails, social links, SEO defaults, telemetry highlights.
    - `pages/home` & `pages/about`: core page records with navigation metadata.
    - `sections/*`: 8 rich home sections including `hero`, `telemetry-overview`, `cost-optimization`, `mttr-benchmarks`, `experience`, `competencies`, `certifications`, `contact`.
    - `telemetryMetrics/*`: 6 high-impact metrics ($170K/mo savings, 40% MTTR, 2,000+ cloud resources, 99.99% availability, 30-40% effort reduction, 8 enterprise certifications).
    - `telemetryCostSeries/finops-12m-trajectory`: 12-month data series showing $450K/mo baseline to $280K/mo optimized curve.
    - `telemetryBenchmarks/incident-mttr-comparison`: P1, P2, P3 incident MTTR comparison series showing 40% reduction.
    - `experience/*`: 4 full enterprise positions (Eptura Lead Cloud Architect, Downer Infrastructure Specialist, LTIMindtree Azure SME, ABN AMRO / TCS Specialist).
    - `competencies/*`: 16 multi-cloud competencies across Cloud Platforms, IaC & Automation, Observability & SRE, and Enterprise Architecture.
    - `certifications/*`: 8 industry certifications (AZ-104, AZ-900, DP-900, SC-900, CLF-C01, ITIL Foundation, Kubernetes & Terraform).
    - `promoPopup/active-lead-magnet`: executive lead magnet and advisory consultation popup.
- **Master Seed Orchestrator (`scripts/seed/seed.ts`):**
  - Orchestrates media seeding first, extracts live CDN URLs, injects URLs into content seed, and runs sequentially with comprehensive telemetry reporting.
- **Safe Teardown Script (`scripts/cleanup/cleanup.ts`):**
  - Gated by mandatory `--yes-i-am-sure` CLI flag.
  - Queries Cloudinary assets under `sachin-shakya/` and deletes them via authenticated Cloudinary API.
  - Batches deletions across all 10 Firestore collections in batches of 500.
- **Idempotency Verification:**
  - Seed Run 1: Successfully uploaded 3 Cloudinary assets, created all documents across 10 collections in 32s.
  - Seed Run 2: Read cached media assets from Firestore, 0 duplicate uploads, merged all documents in 6s. Zero duplicate records.
- **Quality Gates:**
  - Biome linter and formatter: 0 errors, 0 warnings (`npm run check`).
  - Strict TypeScript check: 0 errors (`npm run typecheck`).
  - Production build: passed cleanly (`npm run build`).

---

## 2026-09-18 — Step 11: Clean Architecture Layers Wired End-to-End (Completed ✅)

**Branch:** `step/11-architecture-e2e-wiring`
**Commit:** `feat(step-11): clean architecture layers wired end-to-end (firestore -> repo -> usecase -> di -> hook -> component)`

**What was done:**
- **Infrastructure Layer (`src/infrastructure/repositories/content/FirestorePageRepository.ts`):**
  - Implemented concrete `FirestorePageRepository` implementing `IPageRepository`.
  - Maps Firestore collection `pages` to domain `Page` entity with `Slug` value objects and `Date` timestamps.
  - Implemented query operations: `getAll()`, `getPublished()`, `getHeaderNavPages()`, `getFooterNavPages()`, `getBySlug(slug)`, `create()`, `update()`, `delete()`.
- **Application Layer (`src/application/use-cases/pages/GetPublishedPageBySlugUseCase.ts`):**
  - Implemented `GetPublishedPageBySlugUseCase` receiving `IPageRepository` through constructor dependency injection.
  - Validates slug with `Slug.tryCreate()`, queries repository, checks `isPublished`, and returns presentation-safe `PageDTO` via `toPageDTO(page)`.
  - Zero framework or external dependencies.
- **Dependency Injection Container Wiring (`src/infrastructure/di/bootstrap.ts`):**
  - Registered `DI_TOKENS.PageRepository` as singleton `FirestorePageRepository`.
  - Registered `DI_TOKENS.GetPublishedPageBySlug` resolving `IPageRepository` from container into `GetPublishedPageBySlugUseCase`.
- **Presentation Layer (`src/presentation/pages/`):**
  - Built custom hook `usePage(slug)` in `src/presentation/pages/hooks/usePage.ts` resolving use-case strictly via `useContainer(DI_TOKENS.GetPublishedPageBySlug)` with zero Firebase imports.
  - Built verification view `PipelineTest` in `src/presentation/pages/pipeline-test/` adhering to Rule 13 (Universal Separation of Concerns: `PipelineTest.tsx`, `PipelineTest.hooks.ts`, `PipelineTest.css`) with instrument-panel styling, hairline borders, and zero shadows.
  - Updated `App.hooks.ts` and `App.tsx` with `showPipelineTest` state trigger via query parameter `?test=pipeline` or `#pipeline-test`.
- **Integration Test & Verification (`scripts/test-pipeline-e2e.ts`):**
  - Automated Node test script boots DI container, resolves `GetPublishedPageBySlugUseCase`, and asserts real Firestore data for slug `home` and `null` for non-existent page.
- **Quality Gates:**
  - Biome linter and formatter: 0 errors, 0 warnings (`npm run check`).
  - Strict TypeScript check (`tsc -b`): 0 errors with Node 24 `erasableSyntaxOnly` compatibility.
  - Production build: passed cleanly (`npm run build`).

---

## 2026-09-18 — Step 12: Design Tokens + Dark/Light Theme (Completed ✅)

**Branch:** `step/12-theme-tokens`
**Commit:** `feat(step-12): design tokens and persisted dark/light theme (tailwind v4 @theme, zero-flash script, wcag aa contrast)`

**What was done:**
- **Tailwind CSS v4 `@theme` Engine (`src/index.css`):**
  - Configured `@theme` directives exposing semantic palette tokens: `--color-ink-900` through `--color-ink-600`, `--color-paper`, `--color-mist`, `--color-amber`, `--color-cyan`, `--color-live`, `--color-line`, and typography/radius scales.
  - Enabled `"css": { "parser": { "tailwindDirectives": true } }` in `biome.json` so Biome cleanly validates and formats modern Tailwind v4 directives.
- **Instrument Panel Dual-Theme Palettes (100% Shadow-Free & Accessible):**
  - **Dark Mode (`:root`, `[data-theme="dark"]`):** Deep petrol navy canvas (`#06121a`), card surface (`#0b1d27`), amber (`#ffb020`), cyan (`#49c7e8`), high-contrast paper (`#e8f1f4`).
  - **Light Mode (`[data-theme="light"]`):** Paper-forward canvas (`#f2f6f8`), card surface (`#ffffff`), contrast-tuned amber (`#b86800`), deep cyan (`#027a9e`), paper heading (`#081720`) passing WCAG AA 4.5:1+ contrast thresholds on all text elements.
  - All elevation achieved via 1px hairline borders (`var(--line)`), matte non-reflective background fills, and frosted liquid-glass blurs. Zero `box-shadow` throughout.
- **Zero-Flash Synchronous Head Script (`index.html`):**
  - Embedded an inline IIFE in `<head>` that synchronously reads `localStorage['theme']` or system `prefers-color-scheme` before DOM rendering, setting `data-theme` on `<html>` to eliminate white/dark flash on page load.
- **Theme Subsystem & Context Provider (`src/presentation/theme/`):**
  - `themeContext.ts`: Defined `Theme` union (`"dark" | "light"`), `ThemeContextValue` interface, and `useThemeContext()` hook.
  - `useTheme.ts`: State machine hook managing `localStorage['theme']` persistence, document attribute updates, and OS `prefers-color-scheme` change listeners.
  - `ThemeProvider.tsx`: Declarative context provider wrapping application tree.
  - Subfolder `toggle/`:
    - `ThemeToggle.tsx`: Cupertino outline toggle button rendering `IoSunnyOutline` and `IoMoonOutline` from `react-icons/io5`. Zero emojis (Rule 3).
    - `ThemeToggle.hooks.ts`: Component hook for toggle handling and accessible aria-labels.
    - `ThemeToggle.css`: Hairline borders, shadow-free tactile design, smooth micro-rotation.
- **Application Integration:**
  - Wrapped root in `<ThemeProvider>` in `src/App.tsx`.
  - Added floating `<ThemeToggle />` to `src/presentation/coming-soon/ComingSoon.tsx`.
  - Added `<ThemeToggle />` to `src/presentation/pages/pipeline-test/PipelineTest.tsx` header.
- **Quality Gates:**
  - Biome linter and formatter: 0 errors, 0 warnings (`npm run check`).
  - Strict TypeScript check (`tsc -b`): 0 errors.
  - Production build: passed cleanly (`npm run build`).
  - E2E Clean Architecture verification: passed (`npx tsx scripts/test-pipeline-e2e.ts`).

---

## 2026-09-18 — Step 13: Global Providers (Theme, Auth, SiteConfig, Errors) (Completed ✅)

**Branch:** `step/13-global-providers`
**Commit:** `feat(step-13): global providers (theme, auth, site-config realtime, error boundary, toast)`

**What was done:**
- **Domain Layer (`src/domain/repositories/settings/`):**
  - Created `ISiteSettingsRepository.ts`: Pure TypeScript contract for fetching, updating, and real-time subscribing to global site configuration.
- **Application Layer (`src/application/use-cases/settings/`):**
  - Created `GetSiteSettingsUseCase.ts`: Use-case for one-shot retrieval of site settings with domain fallbacks.
  - Created `SubscribeSiteSettingsUseCase.ts`: Use-case for subscribing to live `onSnapshot` telemetry updates.
- **Infrastructure Layer (`src/infrastructure/repositories/settings/`):**
  - Created `FirestoreSiteSettingsRepository.ts`: Implemented `ISiteSettingsRepository` backed by Firestore's `onSnapshot(doc(db, "siteSettings", "global"))` with multi-tab persistent IndexedDB cache.
  - Registered `SiteSettingsRepository`, `GetSiteSettings`, and `SubscribeSiteSettings` in `src/infrastructure/di/tokens.ts` and `src/infrastructure/di/bootstrap.ts`.
- **Presentation Layer Providers:**
  - **SiteConfig Provider (`src/presentation/providers/site-config/`):**
    - `SiteConfigProvider.tsx`: Mounts real-time subscription via DI container use-case (`DI_TOKENS.SubscribeSiteSettings`). Admin updates reflect instantaneously across tabs without page reload.
    - `siteConfigContext.ts` & `useSiteConfig.ts`: Context definition and consumer hook.
    - `constants/siteConfig.constants.ts`: Complete fallback site settings for offline/uninitialized state.
  - **Auth Provider (`src/presentation/providers/auth/`):**
    - `AuthProvider.tsx`: Manages admin session state (`isAuthenticated`, `user`, `tokenExpiresAt`, `login`, `logout`). Stubbed in preparation for Step 20's OTP flow.
    - `authContext.ts` & `useAuth.ts`: Context and consumer hook.
  - **Error Boundary (`src/presentation/providers/errors/`):**
    - `ErrorBoundary.tsx`: React error boundary preventing presentation runtime crashes.
    - `ErrorBoundaryFallback.tsx`: Sci-fi instrument panel diagnostic interface (amber warning beacon, monospace telemetry, "Reboot Subsystem" action, zero shadows, zero emojis).
    - `ErrorBoundary.types.ts`: Strongly-typed error boundary contracts.
  - **Toast Primitive (`src/presentation/providers/toast/`):**
    - `ToastProvider.tsx` & `toastContext.ts` & `useToast.ts`: Context, state queue, and consumer hook.
    - Subfolder `components/`: `ToastContainer.tsx`, `ToastItem.tsx`, `ToastItem.types.ts` featuring flat, frosted glass design, 1px hairline borders (`border border-[var(--line)]`), Cupertino outline icons (`react-icons/io5`), and zero emojis.
  - **Root AppProviders Composer (`src/presentation/providers/`):**
    - `AppProviders.tsx`: Composes `ErrorBoundary` → `ThemeProvider` → `SiteConfigProvider` → `AuthProvider` → `ToastProvider`.
    - Integrated into `src/App.tsx`.
- **Architectural & Aesthetic Invariants Met:**
  - Max 3 files per directory strictly maintained across all folders.
  - Maximum lines per file well within bounds (<120 LOC per file).
  - Strictly shadow-free (zero `box-shadow` / `shadow-*`).
  - Strictly zero emojis anywhere (only `react-icons/io5`).
  - Automated pre-commit hook executed all 3 quality gates (Biome, `tsc -b`, Vite build) with zero bypass.
- **Verification:**
  - `npx tsx scripts/test-providers-e2e.ts` → ✅ 100% passed (DI resolution + Firestore fetch + real-time subscription).
  - `npx tsx scripts/test-pipeline-e2e.ts` → ✅ 100% passed.
  - `npx biome check .` → ✅ 94 files, 0 errors.
  - `npx tsc -b` → ✅ strict type check passed.
  - `npx vite build --logLevel silent` → ✅ build succeeded.











