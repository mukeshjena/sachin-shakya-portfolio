---
trigger: always_on
description: Mandatory reference guidelines and alignment with ODINA and DIIRA canonical codebases.
---

# Canonical Reference Project Guidelines (ODINA & DIIRA)

Per Rule 16, whenever implementing architecture, pipelines, configurations, or integrations, ALWAYS inspect and align with the two canonical reference projects located on your local filesystem:

---

## 1. Reference Projects Directory

| Project Name | Local Filesystem Path | Primary Domains & Specialties |
|---|---|---|
| **ODINA** | `D:\MyFiles\p2m-solutions\p2m-projects\ODINA-GARMENTS-PRIVATE-LIMITED` | Cloudflare Workers, Cloudinary Media Management, Razorpay, Multi-environment CI/CD. |
| **DIIRA** | `D:\MyFiles\p2m-solutions\p2m-projects\DIIRA-INDUSTRIAL-FUEL` | Vite + React SPA, Firestore Native with multi-tab offline cache, atomic CI/CD, dynamic page engine, technical SEO. |

---

## 2. Topic-Specific Reference Mapping

### 1. Cloudflare Workers & Static Assets
- **Reference:** `DIIRA-INDUSTRIAL-FUEL/wrangler.toml` and `.github/workflows/deploy-cloudflare.yml`.
- **Pattern:** Use Cloudflare Workers with static assets (`[assets] directory = "./dist"`), SPA fallback routing, and Worker API gateways for secret proxying (`/api/cloudinary/*`).

### 2. Firebase & Firestore Integration
- **Reference:** `DIIRA-INDUSTRIAL-FUEL/src/infrastructure/firebase/firebaseClient.ts`.
- **Pattern:** Initialize Firestore with `persistentLocalCache({ tabManager: persistentMultipleTabManager() })` to dramatically conserve free-tier reads via IndexedDB caching.

### 3. Environment & Configuration System
- **Reference:** `DIIRA-INDUSTRIAL-FUEL/src/infrastructure/system/env.ts`.
- **Pattern:** Create a strongly-typed `createEnvConfig()` with safe multi-runtime variable extraction (`import.meta.env` for Vite browser, `process.env` for Node, and runtime edge injection).

### 4. Cloudinary Media Management
- **Reference:** `ODINA-GARMENTS-PRIVATE-LIMITED` and `DIIRA-INDUSTRIAL-FUEL/worker/index.ts`.
- **Pattern:** Never expose Cloudinary API secrets in client bundles. Use Cloudflare Worker edge routes (`/api/cloudinary/sign` or direct proxying) to manage uploads securely.

### 5. SEO, JSON-LD & Dynamic Page Builder
- **Reference:** `DIIRA-INDUSTRIAL-FUEL/src/infrastructure/seo/` and `src/presentation/pages/dynamic/`.
- **Pattern:** Declarative metadata generator, Schema.org JSON-LD injection, dynamic section rendering, and canonical tags.
