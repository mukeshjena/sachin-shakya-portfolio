# Sachin Shakya — Portfolio & Dynamic Admin CMS
## Implementation Blueprint (Agent-Executable Runbook)

**Client:** Sachin Shakya — AI-Native CloudOps Technical Lead (~9 yrs, Azure/AWS, FinOps, SRE)
**Target domain (interim):** `shakya.mukeshjena.com`
**Budget constraint:** 100% free-tier services (Firebase Spark, Cloudinary free tier, Cloudflare Workers free tier, GitHub free)
**Source of truth for content:** `Sachin_Shakya_Resume.pdf` (uploaded)
**Source of truth for current design language:** `index.html` (uploaded — "Instrument panel" theme, already has Impact / Experience / Capabilities / Credentials / Contact sections)

> **Important environment note before you run this:** this blueprint is written to be executed by an agent (Claude Code / Warp AI / Cursor, etc.) running **locally on your Windows machine**, because several steps depend on things that only exist there: your `D:\...` reference projects, your `C:\Users\LenovO\Downloads\...` image files, your logged-in `gh`/`wrangler`/`firebase` CLI sessions, and your existing Cloudflare/Cloudinary accounts (ODINA project). A cloud chat sandbox cannot read your `D:\` or `C:\` drive or hold your account logins, so this document is the thing you hand to that local agent — it is the "prompt" you asked for, not the execution itself. Where a step needs something from your machine, that's called out explicitly under **Local Inputs Required**.

---

## 0. How This Document Works (read this first)

This is a **stateful runbook**, not a one-shot prompt. It is designed to be pasted into your coding agent's context (or referenced via the `.agent` file created in Step 2) and executed **one step at a time**.

**Operating protocol for the executing agent:**

1. Find the first step in the [Status Ledger](#status-ledger) marked `Pending`.
2. Read that step's *Objective*, *Local Inputs Required*, *Actions*, and *Definition of Done*.
3. Create a new branch for that step only (naming convention below).
4. Perform the actions. Keep every file between 300–500 lines (hard cap 500). Never put more than 3 files directly inside one folder — if a folder needs a 4th file, split it into subfolders instead.
5. Update `.agent/memory.md` with a dated entry describing what was done (see Step 2).
6. Update the [Status Ledger](#status-ledger) row for that step from `Pending` → `Completed`.
7. Commit with the message format below, push the step branch, and **merge/push it forward into `release/v1.0.0`** (do not touch `main` yet — see branching model).
8. Print a short summary of what was delivered and **stop. Ask the human: "Type `continue` to proceed to Step N+1."**
9. Only resume work after receiving the literal word `continue`.
10. After the **last** step is completed and confirmed, merge `release/v1.0.0` → `main` (Step 28 handles this explicitly).

**Branching model:**

```
main                        → always deployable, currently "coming soon"
 └─ develop                 → long-lived integration branch (created in Step 4)
     └─ step/NN-short-name  → one branch per step, deleted after merge into release
release/v1.0.0              → accumulates every completed step, created in Step 4
 └── (merges from step/*)   → each finished step is merged here
main ← release/v1.0.0       → final merge, only in Step 28
```

**Commit message convention:** `feat(step-NN): <short description>` (e.g. `feat(step-07): firebase project + firestore native db bootstrap`)

**Local Inputs Required** legend used throughout: 📁 file path, 🔑 credential/secret, 🌐 account/login.

---

## Status Ledger

| # | Step | Phase | Status |
|---|------|-------|--------|
| 1 | Toolchain & project bootstrap | Foundation | Completed ✅ |
| 2 | `.gitignore`, `.agent/` memory system, strict rules file | Foundation | Completed ✅ |
| 3 | Clean Architecture skeleton + DI container | Foundation | Completed ✅ |
| 4 | Coming-soon page, initial commit, `develop` + `release/v1.0.0` branches | Foundation | Pending |
| 5 | First Cloudflare Worker deploy via Wrangler | Foundation | Pending |
| 6 | Atomic CI/CD pipeline (GitHub Actions) | Foundation | Pending |
| 7 | Firebase project + Firestore (Native mode) | Backend | Pending |
| 8 | Cloudinary folder structure + signed uploads | Backend | Pending |
| 9 | Domain model & Firestore schema | Backend | Pending |
| 10 | Idempotent seed script + cleanup script | Backend | Pending |
| 11 | Clean Architecture layers wired end-to-end | Core | Pending |
| 12 | Design tokens + dark/light theme (localStorage) | Core | Pending |
| 13 | Global providers (Theme, Auth, SiteConfig, Errors) | Core | Pending |
| 14 | App shell: header, iOS-liquid-glass bottom nav, footer | Public UI | Pending |
| 15 | Sci-fi hero: Three.js "blackhole" + Framer Motion + custom cursor | Public UI | Pending |
| 16 | Home sections from résumé content (Impact/Experience/Capabilities/Credentials) | Public UI | Pending |
| 17 | Dynamic page engine (admin-created pages, slugs, section shuffle) | Public UI | Pending |
| 18 | Contact form + email API integration | Public UI | Pending |
| 19 | Promo popup (image + inquiry form, admin-controlled) | Public UI | Pending |
| 20 | Admin OTP access flow (6-digit, auto-advance, paste) | Admin | Pending |
| 21 | Multi-email admin authorization | Admin | Pending |
| 22 | Admin dashboard shell (3-dot menus, realtime updates) | Admin | Pending |
| 23 | Content management modules (pages/sections/logo/text/social links) | Admin | Pending |
| 24 | Media manager (Cloudinary upload+preview+cascade delete) + inbox | Admin | Pending |
| 25 | SEO pass (meta/JSON-LD/sitemap/OG/favicons) | Quality | Pending |
| 26 | PWA setup (manifest, icons, installability) | Quality | Pending |
| 27 | Performance, accessibility, Biome lint gate | Quality | Pending |
| 28 | QA sign-off, merge `release/v1.0.0` → `main`, production cutover | Release | Pending |

---

## 1. Reference Paths Used In This Plan (explicitly listed, as requested)

These are **your local Windows paths**. The executing agent must read them directly from your filesystem — they are not fetchable from the internet, so list them here exactly so nothing gets silently dropped:

| Purpose | Path | Used in |
|---|---|---|
| Cloudflare deploy workflow to copy/adapt | `D:\MyFiles\p2m-solutions\p2m-projects\ODINA-GARMENTS-PRIVATE-LIMITED\.github\workflows\deploy-cloudflare.yml` | Step 6 |
| Email service integration pattern | `D:\MyFiles\portfolio-mukesh\mukesh-portfolio\src\services\emailService.js` | Step 18, 19, 20 |
| Dynamic page builder + SEO reference implementation | `D:\MyFiles\p2m-solutions\p2m-projects\DIIRA-INDUSTRIAL-FUEL` | Step 17, 25 |
| Logo source (all favicon/OG sizes generated from this) | `C:\Users\LenovO\Downloads\sachin-logo.png` | Step 25 |
| Hero / About supporting image #1 | `C:\Users\LenovO\Downloads\sachin-one.png` | Step 15, 16 |
| Hero / About supporting image #2 | `C:\Users\LenovO\Downloads\sachin-two.png` | Step 16 |
| Cloudinary credentials to reuse | ODINA-GARMENTS project's Cloudinary account (cloud name, API key/secret) | Step 8 |
| Cloudflare credentials to reuse | ODINA-GARMENTS project's Cloudflare account (API token, account ID) | Step 5, 6 |

**Why they weren't spelled out before:** your original prompt referenced them ("this path", "the ODINA project's creds") but didn't repeat the literal strings next to each step, so it was easy to lose track of which path applies to which step once execution starts spanning many sessions. The table above is the single lookup point — every step below cross-references it instead of restating the paths inline.

---

## 2. Tech Stack (all free-tier)

- **Frontend:** React 18 + Vite + TypeScript, Node **v24**
- **Styling:** Tailwind CSS (flat design — **no box-shadows**, no debounced inputs anywhere per client's strict instruction #12)
- **Animation:** Framer Motion (UI motion), Three.js via `@react-three/fiber` + `@react-three/drei` (animated background / blackhole hero)
- **Icons:** `react-icons/pi` (Phosphor) or `react-icons/io5` in **outline** variants only — Cupertino/iOS-style outline icons, **zero emojis** anywhere in code or content
- **Backend-as-a-service:** Firebase (Firestore Native mode, free Spark plan) for all content, admin config, OTP codes, contact submissions
- **Media storage:** Cloudinary free tier (images + PDFs)
- **Hosting/Edge:** Cloudflare Workers (free tier) via Wrangler CLI
- **CI/CD:** GitHub Actions, secrets via `gh secret set`
- **Linting/formatting:** Biome (replaces ESLint+Prettier)
- **PWA:** Vite PWA plugin (installable, offline app shell)
- **Email API:** existing provider already used in `emailService.js` (reused, not replaced)
- **DI:** lightweight container (`tsyringe` or a hand-rolled `Container` — see Step 3) — no framework logic inside `.tsx` files, ever (client rule #19)

---

## 3. Clean Architecture — How It Maps to This Repo

Four layers, strict dependency direction (`presentation → application → domain ← infrastructure`):

```
domain/           → entities + interfaces only. Zero framework imports. e.g. Page, Section, MediaAsset, AdminAccessCode
application/      → use-cases ("GetPublishedPages", "SubmitContactForm", "VerifyAccessCode"). Depends only on domain interfaces.
infrastructure/   → concrete implementations: FirestorePageRepository, CloudinaryMediaUploader, EmailApiSender.
presentation/     → React components (.tsx, view-only) + hooks (.ts, all logic) + DI wiring.
```

**Dependency Injection:** a single `container.ts` at `src/infrastructure/di/container.ts` registers every repository/service behind its domain interface. Components never `import` Firestore or Cloudinary directly — they call `useContainer().pageRepository.getBySlug(slug)` through a hook. This satisfies rule #19 (no logic in `.tsx`) and makes every data source swappable/testable.

---

## 4. Folder Structure (max 3 files per folder, 300–500 LOC per file — enforced)

```
sachin-shakya-site/
├── .agent/
│   ├── agent.md              # skills, rules, principles (Step 2)
│   └── memory.md             # append-only session memory log (Step 2)
├── .github/workflows/
│   └── deploy-cloudflare.yml # CI/CD (Step 6)
├── public/
│   └── (favicons, manifest, robots.txt — generated in Steps 25/26)
├── scripts/
│   ├── seed/
│   │   ├── seed.ts           # idempotent seeding entrypoint
│   │   ├── seed-media.ts     # uploads local/online images to Cloudinary
│   │   └── seed-content.ts   # writes Firestore documents
│   └── cleanup/
│       └── cleanup.ts        # wipes Firestore + Cloudinary folders
├── src/
│   ├── domain/
│   │   ├── entities/          (Page.ts, Section.ts, MediaAsset.ts — max 3 per folder, else split)
│   │   ├── repositories/       # interfaces only (IPageRepository.ts, IMediaRepository.ts, ...)
│   │   └── value-objects/      (Slug.ts, AccessCode.ts, ...)
│   ├── application/
│   │   ├── use-cases/
│   │   │   ├── pages/          (GetPublishedPages.ts, CreatePage.ts, ReorderSections.ts)
│   │   │   ├── admin-auth/     (RequestAccessCode.ts, VerifyAccessCode.ts, AddAdminEmail.ts)
│   │   │   ├── media/          (UploadMedia.ts, DeleteMedia.ts)
│   │   │   └── contact/        (SubmitContactForm.ts, SubmitPromoInquiry.ts)
│   │   └── dto/                 (PageDTO.ts, SectionDTO.ts)
│   ├── infrastructure/
│   │   ├── firebase/            (firebaseClient.ts, FirestorePageRepository.ts, FirestoreAdminRepository.ts)
│   │   ├── cloudinary/          (cloudinaryClient.ts, CloudinaryMediaUploader.ts)
│   │   ├── email/               (EmailApiSender.ts — adapted from mukesh-portfolio emailService.js)
│   │   └── di/
│   │       └── container.ts
│   ├── presentation/
│   │   ├── layout/
│   │   │   ├── Header.tsx / Header.hooks.ts / Header.types.ts
│   │   │   ├── MobileBottomNav.tsx / MobileBottomNav.hooks.ts
│   │   │   └── Footer.tsx / Footer.hooks.ts
│   │   ├── hero/
│   │   │   ├── BlackholeHero.tsx
│   │   │   ├── BlackholeHero.scene.ts   # three.js scene graph, no JSX
│   │   │   └── useCustomCursor.ts
│   │   ├── sections/
│   │   │   ├── impact/, experience/, capabilities/, credentials/, contact/  (each ≤3 files)
│   │   ├── pages/
│   │   │   └── DynamicPage.tsx / DynamicPage.hooks.ts
│   │   ├── admin/
│   │   │   ├── access/          (OtpGate.tsx, OtpInput.tsx, useOtpFlow.ts)
│   │   │   ├── dashboard/       (DashboardShell.tsx, ContextMenu.tsx, useRealtimeSync.ts)
│   │   │   ├── content-editor/  (PageEditor.tsx, SectionEditor.tsx, useContentEditor.ts)
│   │   │   └── media-manager/   (MediaPicker.tsx, useMediaUpload.ts)
│   │   ├── theme/
│   │   │   ├── ThemeProvider.tsx / useTheme.ts
│   │   └── shared/
│   │       └── (Button.tsx, IconButton.tsx, ThreeDotMenu.tsx — outline icons only)
│   ├── config/
│   │   └── env.ts
│   └── main.tsx
├── .env.example
├── .gitignore
├── biome.json
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

Any folder that would exceed 3 files (e.g. `sections/impact/` needing a 4th file) gets split further, e.g. `sections/impact/counters/` + `sections/impact/layout/`.

---

## 5. Content & Data Model (derived from the résumé + current `index.html`)

| Firestore Collection | Purpose | Seeded from |
|---|---|---|
| `siteSettings` | logo URL, tagline, theme defaults, social links, footer text | résumé header block (name, phone, email, LinkedIn, Faridabad location) + `sachin-logo.png` |
| `pages` | every page incl. built-ins (`home`) and admin-created ones, each with `slug`, `title`, `sectionOrder[]`, `isPublished` | `index.html` current single-page structure becomes the seeded `home` page |
| `sections` | ordered content blocks per page (`impact`, `experience`, `capabilities`, `credentials`, `contact`, plus any admin-added ones) | existing section copy: "Numbers I am accountable for", "Four roles, one direction of travel", "Filter by what you are hiring for", "Certified, schooled and recognised", "Let's talk about your cloud bill" |
| `impactStats` | $170K/month savings, 40% MTTR improvement, 30–40% manual effort reduction, 2000+ resources, 10-engineer team | Key Achievements block |
| `experience` | Eptura, LTIMindtree, TCS (Downer), TCS (ABN AMRO) — dates, bullets, awards | Professional Experience block |
| `competencies` | Cloud Platforms, Services, Monitoring, DevOps, AI Tools, Databases, Security, ITSM | Core Competencies block |
| `certifications` | AZ-104, AZ-900, DP-900, SC-900, CLF-C01, ITIL Foundation | Certifications block |
| `education` | MCA, B.Sc., XII, X | Education block |
| `mediaAssets` | Cloudinary URL, public_id, folder, usage refs (for cascade delete) | logo + `sachin-one.png`/`sachin-two.png` + any online stock images |
| `adminEmails` | authorized recipient emails for OTP | starts with the client's own email |
| `accessCodes` | hashed 6-digit code, email, expiry, used flag | generated at login-request time |
| `contactSubmissions` | name, email, message, timestamp, read flag | contact form + promo popup |
| `promoPopup` | enabled flag, image URL, heading, form fields, frequency rule | new, per requirement #18a |
| `socialLinks` | platform, url, order, visible | footer, "as in Diira" pattern from Step 17 reference project |

---

## 6. Detailed Step-by-Step Plan

> Every step below follows the same shape: **Objective → Local Inputs Required → Actions → Definition of Done → Git**. Do not start UI/visual work before Steps 1–13 (Foundation + Backend + Core) are `Completed` — this mirrors the client's instruction that architecture must exist before any pixel is drawn.

### Step 1 — Toolchain & Project Bootstrap
**Objective:** Stand up a clean Vite + React + TS + Tailwind + Biome + PWA project on Node v24.
**Local Inputs Required:** 🌐 Node v24 installed locally (`nvm install 24 && nvm use 24`); 🌐 `gh` CLI authenticated; 🌐 existing forked repo present locally.
**Actions:**
1. Confirm `node -v` → v24.x.
2. `npm create vite@latest . -- --template react-ts` (into the already-forked repo working copy).
3. Install Tailwind CSS (v4 config), PostCSS/Autoprefixer.
4. Install and configure Biome (`biome init`) — set line-length rules to help enforce the 500-LOC file cap during review (not auto-enforced by the linter, but documented in `.agent/agent.md`).
5. Add `vite-plugin-pwa` and register manifest placeholder (icons come in Step 26).
6. Verify `npm run dev` boots a blank page.
**Definition of Done:** Fresh app builds and runs locally; Biome check passes on scaffold; no ESLint/Prettier remnants left in the fork.
**Git:** branch `step/01-toolchain-bootstrap` → merge into `release/v1.0.0`.

---

### Step 2 — `.gitignore`, `.agent/` Memory System, Strict Rules File
**Objective:** Guarantee cross-session continuity so no future chat/agent session re-litigates decisions, and lock in the client's non-negotiable rules.
**Actions:**
1. `.gitignore`: `node_modules`, `dist`, `.env`, `.env.*`, `.wrangler`, `*.log`, `.DS_Store`.
2. Create `.agent/agent.md` containing, in clearly labelled sections:
   - **Skills:** senior React/TS developer, cloud/DevOps engineer, UI/UX designer, SEO specialist, QA reviewer.
   - **Rules (strict, non-negotiable):**
     - No file exceeds 500 lines (target 300–500).
     - No folder holds more than 3 files; split into subfolders instead.
     - No `box-shadow` anywhere in CSS/Tailwind classes.
     - No debounced inputs anywhere.
     - No emojis anywhere (icons only, Cupertino/outline style).
     - No logic inside `.tsx` files — logic lives in co-located `.hooks.ts`/`.ts` files.
     - Everything content-related is dynamic from Firestore — zero hardcoded copy/images in components.
     - Clean Architecture + DI boundaries must not be crossed (presentation never imports Firebase/Cloudinary directly).
   - **Design principles:** sci-fi-but-professional "instrument panel" palette (reuse tokens from current `index.html`), depth via layered animated backgrounds (not shadows), Framer Motion for UI, Three.js for background/hero only.
   - **SEO principles:** reference `DIIRA-INDUSTRIAL-FUEL` implementation (Step 25 has the checklist).
3. Create `.agent/memory.md` as an append-only log. Seed it with an entry: `## 2026-09-18 — Project initialized. Plan document created.`
4. Every subsequent step in this document ends by appending a new dated entry here — this is what prevents context loss across chat sessions.
**Definition of Done:** `.agent/agent.md` and `.agent/memory.md` exist, committed; rules are unambiguous enough that a new agent session reading only this file could continue work correctly.
**Git:** branch `step/02-agent-memory-rules`.

---

### Step 3 — Clean Architecture Skeleton + DI Container
**Objective:** Create the four-layer folder skeleton (Section 3/4 above) with placeholder interfaces, before any real feature is built.
**Actions:**
1. Create empty `domain/`, `application/`, `infrastructure/`, `presentation/` trees exactly as in the Folder Structure section.
2. Define core domain interfaces: `IPageRepository`, `ISectionRepository`, `IMediaRepository`, `IAdminAccessRepository`, `IContactRepository`, `IEmailSender`.
3. Build `infrastructure/di/container.ts`: a minimal typed registry (`register<T>(token, factory)` / `resolve<T>(token)`), no heavy DI framework needed given project size — keeps bundle small (free-tier friendly).
4. Add a `useContainer()` hook in `presentation/shared/` so components/hooks can resolve dependencies without importing infrastructure directly.
**Definition of Done:** Skeleton compiles with TypeScript strict mode; a placeholder use-case (`PingUseCase`) resolves through the container end-to-end in a throwaway test page.
**Git:** branch `step/03-clean-architecture-di`.

---

### Step 4 — Coming-Soon Page, Initial Commit, Branch Setup
**Objective:** Get something live on `main` immediately, then open the real working branches.
**Actions:**
1. Build a single static "Coming Soon" component (no Firebase dependency yet) using the existing `index.html` color tokens for brand consistency.
2. Commit directly to `main`: `feat: coming soon placeholder`.
3. Push `main`.
4. Create `develop` branch from `main`.
5. Create `release/v1.0.0` branch from `develop`.
**Definition of Done:** `main` shows a coming-soon page if deployed as-is; `develop` and `release/v1.0.0` exist on origin.
**Git:** direct commit to `main`, then branch creation — this is the one step that doesn't use a `step/*` branch, by design.

---

### Step 5 — First Cloudflare Worker Deploy (Wrangler)
**Objective:** Prove the deployment path works before building CI automation around it.
**Local Inputs Required:** 🔑 Cloudflare API token + Account ID (reused from ODINA-GARMENTS project, see Section 1 table); 🌐 `wrangler login` or token-based auth.
**Actions:**
1. `npm install -D wrangler`.
2. `wrangler.toml`: configure a Workers Sites / Pages-style static asset deploy for the Vite `dist/` output, with route/subdomain placeholder `shakya.mukeshjena.com` (Section 24a of the source brief).
3. `npm run build && wrangler deploy` — manual first deploy.
4. Confirm the coming-soon page is reachable at the Cloudflare-assigned URL, then attach the `shakya.mukeshjena.com` custom domain/route in the Cloudflare dashboard (same zone as ODINA project, since it's a subdomain of `mukeshjena.com`).
**Definition of Done:** Coming-soon page live at `shakya.mukeshjena.com`.
**Git:** branch `step/05-cloudflare-first-deploy`.

---

### Step 6 — Atomic CI/CD Pipeline
**Objective:** Automatic, atomic (Vercel-style) deploys on every push to `main`.
**Local Inputs Required:** 📁 `D:\MyFiles\p2m-solutions\p2m-projects\ODINA-GARMENTS-PRIVATE-LIMITED\.github\workflows\deploy-cloudflare.yml` (read and adapt — do not copy secrets, only structure/steps); 🔑 Cloudflare API token + Account ID as GitHub secrets.
**Actions:**
1. Read the referenced ODINA workflow file locally and extract its job structure (build → typecheck/lint → wrangler deploy → deployment URL comment).
2. Recreate an adapted `.github/workflows/deploy-cloudflare.yml` for this repo: triggers on push to `main`; steps: checkout → setup Node 24 → `npm ci` → Biome check → `npm run build` → `wrangler deploy` using `cloudflare/wrangler-action`.
3. Add preview deploys for PRs into `release/v1.0.0` if the ODINA pattern supports it (atomic preview URLs per PR).
4. `gh secret set CLOUDFLARE_API_TOKEN` / `gh secret set CLOUDFLARE_ACCOUNT_ID` on this repo (values from ODINA project's Cloudflare account).
**Definition of Done:** A push to `main` triggers a GitHub Actions run that deploys automatically without manual `wrangler deploy`.
**Git:** branch `step/06-cicd-pipeline`.

---

### Step 7 — Firebase Project + Firestore (Native Mode)
**Objective:** Stand up the backing store for all dynamic content.
**Local Inputs Required:** 🌐 Firebase CLI logged in (`firebase login`); 🌐 a free Google account.
**Actions:**
1. `firebase projects:create sachin-shakya-site` (or similar available ID).
2. `firebase firestore:databases:create '(default)' --location=<nearest free-tier region>` in **Native mode** (not Datastore mode).
3. `firebase init firestore` for security rules + indexes files, `firebase init hosting` skipped (Cloudflare handles hosting, not Firebase Hosting).
4. Generate a Web App within the Firebase project; copy the config object into `.env` as `VITE_FIREBASE_*` keys, and mirror into `.env.example` with blank values.
5. `gh secret set` for each Firebase key so CI can inject them at build time.
6. Write initial **Firestore Security Rules**: public read on `pages`/`sections`/`siteSettings`/`socialLinks`/`promoPopup` (published only), no public write; `contactSubmissions` create-only from client; everything else admin-only via a custom claim or a server-side Cloud Function check (kept minimal to stay on the free plan — no Cloud Functions billing tier required, use Firestore rules + the OTP-issued short-lived session token instead).
**Definition of Done:** Firestore reachable from a local test script; rules deployed; keys in `.env` and GitHub secrets.
**Git:** branch `step/07-firebase-firestore-bootstrap`.

---

### Step 8 — Cloudinary Folder Structure + Signed Uploads
**Objective:** Organized, page/section-scoped media storage with no client-exposed API secret.
**Local Inputs Required:** 🔑 Cloudinary cloud name, API key, API secret (reused from ODINA-GARMENTS project, per Section 1 table).
**Actions:**
1. In the Cloudinary dashboard (ODINA account), create root folder `sachin-shakya/` with subfolders: `sachin-shakya/logo/`, `sachin-shakya/home/hero/`, `sachin-shakya/home/impact/`, `sachin-shakya/home/experience/`, `sachin-shakya/pages/{slug}/`, `sachin-shakya/promo-popup/`.
2. Create an **unsigned upload preset scoped to `sachin-shakya/`** OR (preferred for security) a tiny signed-upload endpoint: since there's no paid backend, implement signing client-side using a short-lived signature generated via a Cloudflare Worker route (`/api/cloudinary-sign`) that holds the API secret as a Worker secret — this keeps the secret off the client bundle while staying serverless/free.
3. Add `.env` keys: `VITE_CLOUDINARY_CLOUD_NAME`, Worker-side `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (Worker secrets via `wrangler secret put`, not in `.env`/bundle).
4. Push the same keys to GitHub secrets.
**Definition of Done:** A signed test upload from a local script lands in the correct Cloudinary subfolder.
**Git:** branch `step/08-cloudinary-structure`.

---

### Step 9 — Domain Model & Firestore Schema
**Objective:** Finalize entity shapes before any repository code is written.
**Actions:**
1. Implement domain entities/value objects from Section 5's table as TypeScript types/classes in `domain/entities/` and `domain/value-objects/` (`Slug` value object enforces URL-safe, unique slugs).
2. Write the Firestore schema doc (`docs/firestore-schema.md`) mapping each collection to its TypeScript entity, 1:1.
3. Define composite indexes needed (e.g. `pages` by `isPublished + order`).
**Definition of Done:** Entities compile; schema doc committed; indexes declared in `firestore.indexes.json`.
**Git:** branch `step/09-domain-model-schema`.

---

### Step 10 — Idempotent Seed Script + Cleanup Script
**Objective:** One command populates Firebase + Cloudinary from the résumé content and reference images with **no duplicates on re-run**, and one command wipes everything.
**Local Inputs Required:** 📁 `C:\Users\LenovO\Downloads\sachin-logo.png`, `sachin-one.png`, `sachin-two.png`; plus a short list of royalty-free stock image URLs (cloud/server-room/network themed) chosen for placeholder sections per requirement #22.
**Actions:**
1. `scripts/seed/seed-content.ts`: writes/updates Firestore docs using **deterministic IDs** (e.g. slugified keys like `impact-savings`, `exp-eptura`) rather than auto-IDs — this is what makes reseeding non-duplicating. Use `set(..., { merge: true })`.
2. `scripts/seed/seed-media.ts`: for each local file and each online image URL, compute a stable hash/key (e.g. filename or URL hash) and check `mediaAssets` for that key before uploading — skip if already present, otherwise upload to the correct Cloudinary subfolder (Step 8) and write the resulting secure URL + `public_id` into `mediaAssets` and into the referencing content document.
3. `scripts/seed/seed.ts`: orchestrates media seeding first, then content seeding (so content docs can reference final Cloudinary URLs).
4. `scripts/cleanup/cleanup.ts`: deletes every document across all collections **and** calls the Cloudinary Admin API to delete everything under `sachin-shakya/` — used for full resets during development only, gated behind a `--yes-i-am-sure` flag.
5. Document in `.agent/agent.md`: *"Any new implementation that introduces new content/media MUST update `seed-content.ts`/`seed-media.ts` so the seed file always reflects current site truth."* (client rule #10).
**Definition of Done:** Running `npm run seed` twice in a row produces zero duplicate Firestore docs and zero duplicate Cloudinary assets; `npm run cleanup -- --yes-i-am-sure` empties both stores.
**Git:** branch `step/10-seed-cleanup-scripts`.

---

### Step 11 — Clean Architecture Layers Wired End-to-End
**Objective:** Prove the full chain works: `Firestore → Repository → Use-case → DI → Hook → Component` for one real feature (fetch published `home` page).
**Actions:**
1. Implement `FirestorePageRepository implements IPageRepository`.
2. Implement `GetPublishedPageBySlug` use-case in `application/use-cases/pages/`.
3. Register both in `container.ts`.
4. Build `usePage(slug)` hook in `presentation/pages/` that resolves the use-case via `useContainer()` and returns `{ page, loading, error }` — zero Firebase imports in the component.
5. Render the fetched (still unstyled) page data in a throwaway component to confirm the pipeline.
**Definition of Done:** Real Firestore data (seeded in Step 10) renders through the full clean-architecture chain.
**Git:** branch `step/11-architecture-e2e-wiring`.

---

### Step 12 — Design Tokens + Dark/Light Theme
**Objective:** Formalize the "instrument panel" palette from `index.html` as Tailwind tokens, with persisted theme switching.
**Actions:**
1. Port the CSS custom properties already in `index.html` (`--ink-900`, `--amber`, `--cyan`, `--live`, spacing/radius scale, font stacks) into `tailwind.config.ts` as theme extensions, plus a **light-mode counterpart palette** (paper-forward, same accent hues, WCAG-checked contrast).
2. Build `ThemeProvider` (`presentation/theme/`) with logic entirely in `useTheme.ts`: reads/writes `localStorage['theme']`, respects `prefers-color-scheme` on first visit only, exposes `toggleTheme()`.
3. No `box-shadow` — depth comes from token-based border/gradient layering only (client rule #12).
**Definition of Done:** Toggling theme persists across reloads; both palettes pass basic contrast checks.
**Git:** branch `step/12-theme-tokens`.

---

### Step 13 — Global Providers
**Objective:** Compose the app shell's provider tree once, cleanly.
**Actions:**
1. `AuthProvider` (admin session state, backed by the OTP flow built in Step 20 — stubbed for now).
2. `SiteConfigProvider` (subscribes to `siteSettings`/`socialLinks` in realtime so admin edits reflect instantly per client rule #15a).
3. `ErrorBoundary` + toast/notification primitive (no shadows, flat surfaces).
4. Compose all providers in `main.tsx`, keeping `main.tsx` itself under ~50 lines (all setup logic delegated to a `bootstrap.ts`).
**Definition of Done:** App boots with all providers active and no console errors.
**Git:** branch `step/13-global-providers`.

---

### Step 14 — App Shell: Header, iOS-Style Bottom Nav, Footer
**Objective:** The chrome the whole site lives inside — responsive, "feels like an app on mobile, a website on desktop."
**Actions:**
1. `Header.tsx` (desktop ≥ md breakpoint): logo (from `siteSettings`), nav links (from `pages` where `showInHeader: true`), theme toggle.
2. `MobileBottomNav.tsx` (< md breakpoint): fixed floating pill nav, frosted/liquid-glass surface (`backdrop-filter: blur()` + translucent layered gradient — **not** a box-shadow-based elevation), safe-area-aware, active-tab indicator animated with Framer Motion `layoutId`.
3. Mobile-specific compact header (app-style title bar) shown only on small viewports, separate component from desktop `Header`.
4. `Footer.tsx`: dynamic `socialLinks` collection rendered as outline icons, dynamic footer nav from `pages` where `showInFooter: true`, copyright line pulling name from `siteSettings`.
**Definition of Done:** Resizing the viewport swaps cleanly between "web" header and "app" bottom-nav; both are fully data-driven, no hardcoded links.
**Git:** branch `step/14-app-shell`.

---

### Step 15 — Sci-Fi Hero (Blackhole + Three.js + Custom Cursor)
**Objective:** The signature visual moment — professional sci-fi, not gimmicky.
**Local Inputs Required:** 📁 `sachin-one.png` (usable as a subtle overlay/texture or profile treatment inside the hero if desired).
**Actions:**
1. `BlackholeHero.scene.ts`: pure Three.js/`@react-three/fiber` scene graph (particle field with gravitational-lensing-style warp shader around a central dark sphere, slow autonomous rotation, low particle count tuned for mobile GPUs) — **no logic in the `.tsx`**, scene setup lives here.
2. `BlackholeHero.tsx`: mounts the `<Canvas>`, wraps headline/subhead/CTA (from `siteSettings`/`pages.home`) in Framer Motion entrance animations.
3. `useCustomCursor.ts`: replaces default cursor with a minimal ring/dot cursor on desktop pointer devices only (disabled on touch), reacts subtly near interactive elements.
4. Respect `prefers-reduced-motion`: falls back to a static gradient + no cursor override.
5. Performance guard: pause the animation loop when the hero scrolls out of viewport (IntersectionObserver) so the "always animated" background never taxes battery/CPU needlessly — satisfies "fully animated but not disturbing."
**Definition of Done:** Hero renders smoothly at 60fps on a mid-range laptop and degrades gracefully on mobile; reduced-motion users get a static fallback.
**Git:** branch `step/15-blackhole-hero`.

---

### Step 16 — Home Sections From Résumé Content
**Objective:** Rebuild the current `index.html` sections as dynamic React components, content-driven from Firestore.
**Local Inputs Required:** 📁 `sachin-two.png` (About/impact section supporting image, if the client wants a face/photo-style visual next to a bio blurb).
**Actions:**
1. `sections/impact/`: animated counters for the résumé's key numbers (`~$170K/month`, `~40% MTTR`, `30–40% automation`, `2000+ resources`, `10 engineers led`) — data from `impactStats` collection, count-up animation via Framer Motion, triggered on scroll-into-view.
2. `sections/experience/`: timeline of the four roles (Eptura → LTIMindtree → TCS/Downer → TCS/ABN AMRO) with dates, bullets, and awards, data from `experience` collection — mirrors "Four roles, one direction of travel" heading already in `index.html`.
3. `sections/capabilities/`: filterable competency grid (Cloud Platforms, Monitoring, DevOps, AI Tools, Databases, Security, ITSM) from `competencies` collection — mirrors "Filter by what you are hiring for."
4. `sections/credentials/`: certifications + education, from `certifications`/`education` collections — mirrors "Certified, schooled and recognised."
5. Optional new **About** content block using `sachin-one.png`/`sachin-two.png` if the client confirms during review (flagged as an open question in Section 8 below rather than assumed).
**Definition of Done:** Home page visually reconstructs the current `index.html` content and structure, but every string/number/image comes from Firestore, none hardcoded.
**Git:** branch `step/16-home-sections`.

---

### Step 17 — Dynamic Page Engine
**Objective:** Let the admin create entirely new pages later, reusing the same section/content mechanism as Home.
**Local Inputs Required:** 📁 `D:\MyFiles\p2m-solutions\p2m-projects\DIIRA-INDUSTRIAL-FUEL` (reference for the page-builder + nav-linking pattern).
**Actions:**
1. Study the DIIRA project's page model (how it stores dynamic pages, how nav entries auto-link, how section order/visibility is toggled) and adapt the same shape into this repo's `pages`/`sections` collections (already scaffolded in Step 9).
2. `DynamicPage.tsx` + `DynamicPage.hooks.ts`: resolves `:slug` route → fetches the page doc → renders its `sectionOrder[]` by mapping each section type to its section component (same components built in Steps 15–16, generalized to accept arbitrary page context, not just `home`).
3. Route registration is **fully dynamic** — the router reads published `pages` from Firestore at boot (via `SiteConfigProvider`) rather than a static route table, so a brand-new admin-created page appears without a code deploy.
4. Section/page **shuffle (reorder)** capability lives in the domain layer as a `ReorderSections` use-case (drag-and-drop UI wired in Step 23).
**Definition of Done:** Manually adding a `pages` doc + a couple of `sections` docs in the Firestore console immediately produces a working new route with header/footer nav entries, with zero code changes.
**Git:** branch `step/17-dynamic-page-engine`.

---

### Step 18 — Contact Form + Email API Integration
**Objective:** Working contact form using the existing, already-paid-for-nothing email API.
**Local Inputs Required:** 📁 `D:\MyFiles\portfolio-mukesh\mukesh-portfolio\src\services\emailService.js` (read the exact API URL, payload shape, and any auth header it uses).
**Actions:**
1. Port the relevant logic from `emailService.js` into `infrastructure/email/EmailApiSender.ts implements IEmailSender`, translated to TypeScript, kept behind the same interface used by other email-sending features (OTP, promo popup) so there's one adapter, three call sites.
2. `SubmitContactForm` use-case: validates input (no debounce — validate on submit and on blur only, per rule #12), writes to `contactSubmissions`, then calls `IEmailSender.send(...)`.
3. Build the form UI in `sections/contact/` — flat inputs, no shadows, outline icons for field affordances.
**Definition of Done:** Submitting the form creates a Firestore doc **and** the client receives a real email, end-to-end.
**Git:** branch `step/18-contact-form-email`.

---

### Step 19 — Promo Popup
**Objective:** Admin-toggleable popup with a split layout (image one side, inquiry form the other) that also emails the client.
**Actions:**
1. `promoPopup` doc drives: `enabled`, `imageUrl` (Cloudinary), `heading`, `body`, `formFields[]`, and a simple frequency rule (e.g. once per session, stored in `sessionStorage` — not `localStorage`, so it reappears next visit) to avoid being obnoxious.
2. `SubmitPromoInquiry` use-case: same pattern as `SubmitContactForm`, writes to `contactSubmissions` with a `source: "promo-popup"` tag, sends email via the same `IEmailSender`.
3. UI: full-bleed modal on mobile, split-panel on desktop, dismissible, respects the `enabled` flag reactively (if admin disables it mid-session, it won't appear again without a fresh load — acceptable given the free-tier realtime listener cost).
**Definition of Done:** Toggling `promoPopup.enabled` in the admin panel (built in Step 23) shows/hides it on the live site without a deploy.
**Git:** branch `step/19-promo-popup`.

---

### Step 20 — Admin OTP Access Flow
**Objective:** Secure, code-only admin entry — no username/password, matching the client's exact UX spec.
**Actions:**
1. `RequestAccessCode` use-case: generates a random 6-digit code, hashes it, stores `{ emailHash, codeHash, expiresAt (e.g. 10 min), used: false }` in `accessCodes`, and sends the **plain** code via `IEmailSender` (reusing Step 18's adapter) to the requested address **only if that address exists in `adminEmails`** (Step 21).
2. `VerifyAccessCode` use-case: looks up by email, checks hash match + not expired + not used, marks `used: true`, issues a short-lived signed session token stored in `sessionStorage` (drives `AuthProvider` from Step 13).
3. `OtpInput.tsx` + `useOtpFlow.ts`: six individual boxes, auto-focus first box, auto-advance to next box on digit entry, backspace moves focus back, and a single `onPaste` handler on the box group that splits a pasted 6-digit string across all boxes at once.
4. Rate-limit code requests per email (e.g. 1 per 60 seconds) enforced in the use-case, not the UI, to prevent email-bombing on the free email API quota.
**Definition of Done:** Requesting access sends a real 6-digit email; entering it (typed or pasted) unlocks the admin route; expired/used codes are rejected with a clear inline message.
**Git:** branch `step/20-admin-otp-flow`.

---

### Step 21 — Multi-Email Admin Authorization
**Objective:** Let the client add teammates who can also receive access codes.
**Actions:**
1. `adminEmails` collection CRUD via `AddAdminEmail`/`RemoveAdminEmail` use-cases — admin-only, gated behind an already-authenticated session (so the very first admin email must be seeded manually in Step 10, then managed from the panel thereafter).
2. Simple settings screen (built out further in Step 23) listing authorized emails with add/remove.
**Definition of Done:** A second, newly-added email can successfully request and use its own OTP code.
**Git:** branch `step/21-multi-admin-emails`.

---

### Step 22 — Admin Dashboard Shell
**Objective:** The container all admin features live inside, with the specific interaction pattern requested (3-dot menus, instant realtime reflection).
**Actions:**
1. `DashboardShell.tsx`: left/side nav (Pages, Content, Media, Contacts, Settings), fully responsive (same app-shell philosophy as the public site).
2. `ThreeDotMenu.tsx` (shared component, `presentation/shared/`): a single overflow-menu affordance replacing all individual edit/delete/add icon buttons per row — opens a small flat menu with contextual actions (Edit, Hide/Show, Duplicate, Delete, Reorder).
3. `useRealtimeSync.ts`: wraps Firestore `onSnapshot` listeners for whatever collection a given admin screen is viewing, so any change (by this admin or a teammate) reflects on **both** the admin panel and the public site instantly, no refresh — satisfies rule #15a directly.
**Definition of Done:** Two browser tabs — one admin, one public site — show a content edit propagate to both within ~1 second, no manual refresh.
**Git:** branch `step/22-admin-dashboard-shell`.

---

### Step 23 — Content Management Modules
**Objective:** The actual editing surface: pages, sections, logo, text, social links, hide/show, reorder.
**Actions:**
1. `PageEditor.tsx`/`.hooks.ts`: create/rename/delete pages, set slug, toggle `showInHeader`/`showInFooter`, publish/unpublish.
2. `SectionEditor.tsx`/`.hooks.ts`: add/remove sections on a page, drag-to-reorder (calls the `ReorderSections` use-case from Step 17), per-section hide/show toggle, rich-text/plain-text field editing per section's schema.
3. Global site settings screen: logo replacement (routes through the media manager, Step 24), tagline/footer text editing, social link CRUD (platform + URL + order + visible toggle).
4. Every list row uses the `ThreeDotMenu` from Step 22 — no visible per-row icon buttons.
**Definition of Done:** The client can, without touching code: rename the site, swap the logo, add a new page, add a section to it, reorder sections, hide a section, and see all of it live within a second.
**Git:** branch `step/23-content-management`.

---

### Step 24 — Media Manager + Contact Inbox
**Objective:** No-URL image handling (select → preview → upload → store) plus visibility into form submissions.
**Actions:**
1. `MediaPicker.tsx`/`useMediaUpload.ts`: file-select input (no URL field anywhere), local preview via `URL.createObjectURL` before upload, on Save calls the signed-upload Worker route (Step 8), writes the returned URL + `public_id` to the target Firestore field **and** to `mediaAssets` with a reference count/usage pointer.
2. `DeleteMedia`/replace flow: when an item with an image is deleted, or an image is swapped for a new one, the use-case calls the Cloudinary Admin API (via the same signed Worker route, extended with a delete action) to remove the old asset **and** deletes/updates its `mediaAssets` doc — no orphaned files, no orphaned Firestore docs.
3. Contacts screen: realtime list of `contactSubmissions` (both plain contact-form and promo-popup sourced), read/unread state, and the client also gets the parallel email notification from Step 18/19 as a backup channel.
**Definition of Done:** Uploading a new logo shows an instant preview, persists correctly, and deleting an old hero image actually removes it from the Cloudinary media library, not just from the site.
**Git:** branch `step/24-media-manager-inbox`.

---

### Step 25 — SEO Pass
**Objective:** Search-engine readiness matching the DIIRA project's implementation.
**Local Inputs Required:** 📁 `D:\MyFiles\p2m-solutions\p2m-projects\DIIRA-INDUSTRIAL-FUEL` (copy the SEO approach: meta tag structure, JSON-LD types used, sitemap generation method, robots.txt rules); 📁 `C:\Users\LenovO\Downloads\sachin-logo.png` (source for every generated icon/OG size).
**Actions:**
1. Per-page dynamic `<title>`/`<meta description>`/Open Graph/Twitter Card tags, driven by each `pages` doc's own `seoTitle`/`seoDescription`/`seoImage` fields (falls back to `siteSettings` defaults).
2. JSON-LD `Person` schema for the homepage (name, jobTitle, worksFor, sameAs → social links), matching whatever structured-data types DIIRA used for its equivalent entity.
3. Generate the full favicon/OG image size set from `sachin-logo.png` (16/32/48/180/192/512px PNGs + `apple-touch-icon`, `og-image.png` at 1200×630) at build time or via a one-off script into `public/`.
4. `sitemap.xml` generated at build time from published `pages`; `robots.txt` allowing all + pointing to the sitemap.
5. Canonical URLs on every page, using `shakya.mukeshjena.com` for now (Section 24a note: swap when the final domain is ready — track this as a config value, not a hardcoded string, in exactly one place: `config/env.ts`).
**Definition of Done:** Lighthouse SEO score ≥ 95; sitemap/robots reachable; rich-result test tool validates the JSON-LD.
**Git:** branch `step/25-seo-pass`.

---

### Step 26 — PWA Setup
**Objective:** Installable mobile-app-like experience.
**Actions:**
1. Finalize `manifest.webmanifest` (name, short_name, theme_color/background_color from the design tokens, icons generated in Step 25).
2. Service worker (via `vite-plugin-pwa`) caching the app shell for offline load of at least the coming-soon/home shell.
3. "Add to Home Screen" custom prompt component (not the raw browser prompt), styled consistently with the mobile bottom nav's liquid-glass aesthetic.
**Definition of Done:** Site is installable on Android/desktop Chrome and iOS Safari ("Add to Home Screen"), passes the PWA Lighthouse category.
**Git:** branch `step/26-pwa-setup`.

---

### Step 27 — Performance, Accessibility, Lint Gate
**Objective:** Production-quality bar before merge.
**Actions:**
1. Lighthouse pass on Performance/Accessibility/Best Practices (target ≥ 90 each), with special attention to the Three.js hero's mobile frame budget (Step 15's viewport-pause guard should already help here).
2. Accessibility: focus states on every interactive element (including the custom cursor — desktop-only, never removes default focus rings for keyboard users), proper `alt` text pulled from `mediaAssets.altText`, sufficient contrast in both themes.
3. Add a CI gate: GitHub Actions job runs `biome ci` and fails the build on violations (extends the pipeline from Step 6).
4. Manual audit pass against `.agent/agent.md` rules: grep the repo for `box-shadow`, `debounce`, emoji characters, and files >500 lines — fix any violations found.
**Definition of Done:** CI gate is green; audit grep commands return zero matches; Lighthouse scores meet targets on both mobile and desktop presets.
**Git:** branch `step/27-perf-accessibility-lint`.

---

### Step 28 — QA Sign-Off, Release Merge, Production Cutover
**Objective:** Ship it.
**Actions:**
1. Full manual QA pass against every step's Definition of Done, on both a real Android and a real iOS device (bottom nav + PWA install especially).
2. Client (Sachin) reviews the live `release/v1.0.0` preview deploy and confirms sign-off.
3. Open PR `release/v1.0.0 → main`, squash or merge-commit per team preference, merge.
4. Confirm the production CI/CD run (Step 6's pipeline) deploys `main` cleanly to `shakya.mukeshjena.com`.
5. Tag the release: `git tag v1.0.0 && git push origin v1.0.0`.
6. Final `.agent/memory.md` entry: `## <date> — v1.0.0 released to production.`
**Definition of Done:** `main` and `shakya.mukeshjena.com` are identical and fully functional; all 28 ledger rows show `Completed`.
**Git:** merge `release/v1.0.0` → `main` directly (no intermediate `step/*` branch for this final step).

---

## 7. `.agent/agent.md` — Starter Template

```markdown
# Agent Operating Rules — Sachin Shakya Site

## Skills this agent embodies
- Senior React/TypeScript engineer (Clean Architecture, DI)
- Cloud/DevOps engineer (Firebase, Cloudflare Workers, GitHub Actions)
- UI/UX designer (sci-fi-professional aesthetic, mobile-app-grade responsiveness)
- SEO specialist (technical SEO parity with DIIRA-INDUSTRIAL-FUEL reference)
- QA reviewer (accessibility, performance, rule compliance)

## Non-negotiable rules
1. Max 500 lines per file (target 300–500).
2. Max 3 files per folder; split into subfolders beyond that.
3. Zero logic in .tsx files — logic lives in co-located .hooks.ts/.ts files.
4. No box-shadow, anywhere.
5. No debounced inputs, anywhere.
6. No emojis, anywhere — Cupertino/outline icons only.
7. No hardcoded content/images/URLs in components — everything comes from Firestore.
8. Presentation layer never imports Firebase/Cloudinary directly — always through the DI container.
9. Every new feature that adds content/media MUST update scripts/seed/*.

## Design principles
[palette tokens, motion principles, "depth without shadows" techniques — filled in during Step 12]

## Reference paths (see plan Section 1 for the full table)

## Workflow
- One step from SACHIN-SHAKYA-SITE-IMPLEMENTATION-PLAN.md at a time.
- Branch → implement → update memory.md → update status ledger → commit → push → merge to release/v1.0.0 → ask "continue".
```

---

## 8. Open Questions For The Client (worth confirming before Step 16/17)

- Should `sachin-one.png`/`sachin-two.png` live on the Home page (new "About" section) or on a dedicated `/about` page created via the dynamic page engine?
- Any preference for which royalty-free placeholder images represent "cloud/infrastructure" visually until real photography is available (Step 10)?
- Confirm the actual email API endpoint/auth in `emailService.js` allows sending to arbitrary admin addresses (needed for OTP delivery in Step 20), not just a single fixed "to" address.

---

*End of blueprint. Work through the Status Ledger top to bottom, one `continue` at a time.*
