# Agent Operating Rules & Multi-Skill Architecture — Sachin Shakya Portfolio Site

> **CRITICAL FOR ALL AGENTS & NEW SESSIONS:**
> This repository uses **`.agents/`** as the single unified customization and context root.
> Read this file first in every new session. It is the single source of truth for rules, design decisions, skill capabilities, and reference paths.
> Cross-reference **[`.agents/memory.md`](file:///d:/MyFiles/p2m-solutions/p2m-projects/sachin-sir-web/sachin-shakya-portfolio/.agents/memory.md)** for session continuity and the real-time execution log.

---

## 1. Multi-Skill Persona Architecture

Every agent working on this repository operates with 6 specialized personas, backed by formal skills in [`.agents/skills/`](file:///d:/MyFiles/p2m-solutions/p2m-projects/sachin-sir-web/sachin-shakya-portfolio/.agents/skills) and rules in [`.agents/rules/`](file:///d:/MyFiles/p2m-solutions/p2m-projects/sachin-sir-web/sachin-shakya-portfolio/.agents/rules):

### 1. Senior React / TypeScript Architect
- **Focus:** Clean Architecture, Dependency Injection container, strict TypeScript, modular components.
- **Rules Enforced:**
  - 4 Clean Architecture layers: `presentation → application → domain ← infrastructure`.
  - DI container: all services resolved through `useContainer()` hook; presentation never imports Firebase/Cloudinary directly.
  - Universal Separation of Concerns (Rule 13): View in `.tsx`, state/lifecycle in `.hooks.ts`, calculations in `.utils.ts`, copy/constants in `.constants.ts`, styles in `.css`.
  - Max 500 lines per file (target 200–400 LOC).
  - Max 3 files per folder (split into subfolders beyond 3).
  - Strict TypeScript: `strict: true`, zero `any`, no `!` without explanation.

### 2. Lead Cloud & DevOps Engineer
- **Focus:** Serverless architecture, Cloudflare Workers, Firebase (Firestore Native mode), GitHub Actions atomic CI/CD, Wrangler CLI.
- **Rules Enforced:**
  - Free-tier optimization: 100K req/day Cloudflare, 50K reads/day Firestore, multi-tab persistent IndexedDB caching (`persistentMultipleTabManager`).
  - Atomic CI/CD: Concurrency group cancellation, pre-flight secrets audit, security audit, hashed asset build, bundle budgets (<1000 KB index, <3000 KB total JS), zero-downtime edge deploy, post-deploy secret sync to Worker store, live health checks, and PR previews.
  - Cloudflare Worker API gateway: edge signing for Cloudinary (`/api/cloudinary/sign`) without leaking secrets into client bundles.

### 3. UI/UX & Visual Design Specialist
- **Focus:** Sci-Fi Professional "Instrument Panel" aesthetic tailored for a Lead Cloud Architect & DevOps Consultant.
- **Rules Enforced:**
  - Strictly zero `box-shadow` anywhere (depth via 1px hairline borders `var(--line)` and layered gradient fills).
  - Strictly zero emojis anywhere (outline Cupertino/Phosphor `react-icons/pi` or Ionicons `react-icons/io5` only).
  - Strictly zero debounced inputs (validate on blur and submit only).
  - Zero hover zoom or distortion scale (no `hover:scale-105`).
  - Modern rounded corners encouraged (`rounded-lg`, `rounded-xl`, `rounded-full`).
  - Dual Chrome experience: Desktop instrument panel header vs mobile liquid-glass floating bottom dock (`backdrop-blur-xl`).
  - Token consistency: CSS custom properties from `src/index.css` `:root` only — never hardcode hex/rgb codes in TSX or CSS.

### 4. Technical SEO & Schema.org Specialist
- **Focus:** Search visibility, structured rich snippets, Core Web Vitals, OpenGraph, dynamic sitemap.
- **Rules Enforced:**
  - Parity with `DIIRA-INDUSTRIAL-FUEL` reference project.
  - Schema.org JSON-LD structured data (`Person`, `ProfilePage`, `WebSite`, `EducationalOccupationalCredential`).
  - Single `<h1>` per page with proper semantic hierarchy (`h1` → `h2` → `h3`).
  - Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
  - Canonical tags, OpenGraph previews, `robots.txt`, dynamic `sitemap.xml`.

### 5. QA Reviewer & Code Quality Auditor
- **Focus:** Automated gates, anti-pattern detection, accessibility (WCAG AA), performance.
- **Rules Enforced:**
  - Automated single pre-commit gate: Biome check (`npx biome check .`), TypeScript strict check (`npx tsc -b`), Vite production build (`npx vite build --logLevel silent`).
  - Strict prohibition of `--no-verify` (Rule 15) on `git commit`.
  - Lighthouse performance target ≥ 90.

### 6. Cross-Session Memory & Continuity Manager
- **Focus:** Preserving repository state, decisions, and progress across context windows and new chat sessions.
- **Rules Enforced:**
  - After every completed step or significant request, append a dated entry to [`.agents/memory.md`](file:///d:/MyFiles/p2m-solutions/p2m-projects/sachin-sir-web/sachin-shakya-portfolio/.agents/memory.md).
  - Update Status Ledger in `doc/SACHIN-SHAKYA-SITE-IMPLEMENTATION-PLAN.md` to `Completed ✅`.
  - Commit and push to origin across `main`, `develop`, and `release/v1.0.0`.
  - **MANDATORY PAUSE:** Wait for human user to type `continue` before initiating the next step.

---

## 2. Non-Negotiable Rules Summary

| # | Rule | Detail |
|---|------|--------|
| 1 | **Max 500 lines per file** | Target 200–400 LOC. If approaching 400 LOC, extract helpers to `.utils.ts` or sub-components. |
| 2 | **Max 3 files per folder** | Split into subfolders beyond 3 files (e.g. `constants/`, `utils/`, `layout/`). |
| 3 | **Zero logic in `.tsx`** | Pure declarative JSX templates only. State/lifecycle in `.hooks.ts`, calculations in `.utils.ts`. |
| 4 | **No `box-shadow` anywhere** | Never use `shadow-*` or `box-shadow`. Depth via 1px hairline borders and background layers. |
| 5 | **No debounced inputs** | Validate on blur (`onBlur`) and submit (`onSubmit`). Never introduce artificial latency. |
| 6 | **No emojis anywhere** | Zero unicode emojis in code, comments, or copy. Use outline icons (`react-icons/pi`, `react-icons/io5`). |
| 7 | **Zero hardcoded content** | All content dynamic from Firestore or dedicated `.constants.ts` / `.data.ts` / config files. |
| 8 | **Clean Architecture boundaries** | Presentation never imports Firebase or Cloudinary directly. Resolve via `useContainer()`. |
| 9 | **Idempotent seed scripts** | Any new content/media feature MUST update `scripts/seed/seed-content.ts` / `seed-media.ts`. |
| 10 | **Strict TypeScript** | `strict: true`, zero `any`, no non-null assertions (`!`) without an explanatory comment. |
| 11 | **Free-tier bundle budgets** | Cloudflare Workers script < 1 MB. Enforce bundle budgets in CI/CD pipeline. |
| 12 | **Commit message format** | `feat(step-NN): ...`, `fix(...)`, `docs(...)`, `ci(...)`. |
| 13 | **Universal Separation of Concerns** | Styles in `.css`, constants in `.constants.ts`, math in `.utils.ts`, state in `.hooks.ts`, view in `.tsx`. |
| 14 | **No hardcoded hex colors** | Use CSS custom properties from `src/index.css` `:root` exclusively (`var(--amber)`, `var(--ink-900)`). |
| 15 | **Strict ban on `--no-verify`** | Never bypass git hooks with `--no-verify` or `-n`. Fix all failures at the root cause. |
| 16 | **Canonical Reference Alignment** | Always align with ODINA (`D:\MyFiles\...\ODINA-GARMENTS-PRIVATE-LIMITED`) and DIIRA (`D:\MyFiles\...\DIIRA-INDUSTRIAL-FUEL`). |

---

## 3. Dedicated Rules in `.agents/rules/`

| Rule File | Contents |
|---|---|
| [**`clean-architecture-and-code-standards.md`**](file:///d:/MyFiles/p2m-solutions/p2m-projects/sachin-sir-web/sachin-shakya-portfolio/.agents/rules/clean-architecture-and-code-standards.md) | Layer boundaries, DI container wiring, Rule 13 separation matrix, file/folder size limits. |
| [**`design-aesthetics-and-standards.md`**](file:///d:/MyFiles/p2m-solutions/p2m-projects/sachin-sir-web/sachin-shakya-portfolio/.agents/rules/design-aesthetics-and-standards.md) | Instrument panel palette, shadow-free surfaces, zero emojis, zero debounce, mobile dock. |
| [**`git-workflow-and-branching-order.md`**](file:///d:/MyFiles/p2m-solutions/p2m-projects/sachin-sir-web/sachin-shakya-portfolio/.agents/rules/git-workflow-and-branching-order.md) | 4-stage promotion lifecycle, pre-commit gate, rapid push, human pause protocol. |
| [**`reference-odina-diira.md`**](file:///d:/MyFiles/p2m-solutions/p2m-projects/sachin-sir-web/sachin-shakya-portfolio/.agents/rules/reference-odina-diira.md) | Filesystem reference paths, topic-by-topic architectural mapping. |

---

## 4. Dedicated Skills in `.agents/skills/`

| Skill Folder | Contents |
|---|---|
| [**`modern-ui-ux-design/`**](file:///d:/MyFiles/p2m-solutions/p2m-projects/sachin-sir-web/sachin-shakya-portfolio/.agents/skills/modern-ui-ux-design) | Design guide + 5 references: `color_theory_tokens.md`, `component_design_blueprints.md`, `micro_interactions_motion.md`, `typography_pairing.md`, `visual_hierarchy_grid.md`. |
| [**`ui-polish-critique/`**](file:///d:/MyFiles/p2m-solutions/p2m-projects/sachin-sir-web/sachin-shakya-portfolio/.agents/skills/ui-polish-critique) | 5-step critique workflow + `anti_patterns_checklist.md`. |
| [**`devops-portfolio-seo/`**](file:///d:/MyFiles/p2m-solutions/p2m-projects/sachin-sir-web/sachin-shakya-portfolio/.agents/skills/devops-portfolio-seo) | Schema.org JSON-LD graph, meta tags, OpenGraph, sitemap, Core Web Vitals. |
| [**`senior-react-typescript-engineer/`**](file:///d:/MyFiles/p2m-solutions/p2m-projects/sachin-sir-web/sachin-shakya-portfolio/.agents/skills/senior-react-typescript-engineer) | Clean Architecture patterns, custom hooks, DI wiring, strict TypeScript type safety. |
| [**`cloud-devops-engineer/`**](file:///d:/MyFiles/p2m-solutions/p2m-projects/sachin-sir-web/sachin-shakya-portfolio/.agents/skills/cloud-devops-engineer) | Cloudflare Workers, Firebase Native mode, multi-tab cache, atomic CI/CD pipeline. |
| [**`qa-reviewer-audit/`**](file:///d:/MyFiles/p2m-solutions/p2m-projects/sachin-sir-web/sachin-shakya-portfolio/.agents/skills/qa-reviewer-audit) | Automated pre-commit audit, accessibility (WCAG AA), bundle budget check, lint verification. |

---

## 5. Pre-Commit Validation Gate

Activated automatically by `npm run prepare` (`git config core.hooksPath .githooks`).

| Gate | Runs On | Checks Executed |
|---|---|---|
| **Pre-Commit** (`.githooks/pre-commit`) | `git commit` | 1. **Biome check:** `npx biome check .` (lint + format + import sorting)<br>2. **TypeScript:** `npx tsc -b` (strict typecheck)<br>3. **Vite build:** `npx vite build --logLevel silent` (production build verification) |

> **Single Quality Gate:**
> Pre-commit verifies all 3 stages before code enters git history. Pre-push checks are eliminated to prevent duplicate execution and keep `git push` fast and lightweight.
>
> **STRICT PROHIBITION OF `--no-verify` (Rule 15):**
> Using `--no-verify` or `-n` with `git commit` is **STRICTLY FORBIDDEN**.
> If any check fails, diagnose and fix the root cause before committing.
