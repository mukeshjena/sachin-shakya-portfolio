---
name: cloud-devops-engineer
description: >-
  Cloudflare Workers, Firebase Firestore Native mode, Wrangler CLI, GitHub Actions CI/CD, and multi-cloud infrastructure orchestration.
  Activate when implementing edge workers, Firestore databases, environment configurations, CI/CD pipelines, or deployment automations.
---

# Lead Cloud & DevOps Engineering Skill

This skill governs all infrastructure, edge compute, database, and CI/CD operations for the Sachin Shakya Portfolio.

---

## 1. Edge & Hosting Architecture (Cloudflare Workers)
- Static assets served via Cloudflare Workers `[assets]` with SPA fallback routing.
- Worker API gateway pattern for proxying secrets (`/api/cloudinary/sign`).
- Fast edge response times (< 50ms) across global points of presence.
- Worker script budget < 1 MB to stay comfortably on the free plan.

---

## 2. Firestore Native Mode & Free-Tier Preservations
- Native mode (not Datastore mode).
- Free Spark plan quota: 50,000 document reads/day, 20,000 writes/day.
- Client SDK initialization using `persistentLocalCache({ tabManager: persistentMultipleTabManager() })` to preserve read quota via multi-tab IndexedDB cache.
- Declarative security rules: public read on published documents, public create-only on contact submissions, admin-authenticated writes.

---

## 3. Atomic CI/CD Pipeline Standards
- Aligned with canonical reference project `DIIRA-INDUSTRIAL-FUEL`.
- Concurrency group `production-cloudflare-deploy` with `cancel-in-progress: true`.
- Pre-flight secrets audit verifying required credentials.
- Multi-stage gates: `npm ci`, security audit, Biome check, TypeScript check, Vite build, bundle size budgets.
- Post-deploy secret sync to Cloudflare Worker store via printf-pipe.
- Automated live edge health check verifying HTTP 200.
- Ephemeral PR preview deployments with automated PR commenting.
