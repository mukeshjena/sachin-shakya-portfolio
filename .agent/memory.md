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

