# Credential Isolation & Secrets Boundary Rules

Protocols for safeguarding secrets across GitHub Actions, Cloudflare Workers, and client runtimes.

---

## 1. Secrets Classification Matrix

| Credential Type | Permitted Location | Strictly Forbidden Location |
|---|---|---|
| `CLOUDINARY_API_SECRET` | GitHub Secrets, Cloudflare Worker Secrets | Client bundles, `.env` in git, HTML, `/api/*` responses |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | GitHub Secrets, Cloudflare Worker Secrets | Client bundles, `.env` in git, HTML, public APIs |
| `EMAIL_API_URL` | GitHub Secrets, Cloudflare Worker Secrets | Client bundles, `env.ts` defaults, HTML, client fetch calls |
| `EMAIL_RECIPIENT` | GitHub Secrets, Cloudflare Worker Secrets | Client bundles, `env.ts` defaults, HTML, client fetch calls |
| `CLOUDFLARE_API_TOKEN` | GitHub Secrets | Cloudflare Worker store, client bundles, git history |
| `FIREBASE_API_KEY` | Cloudflare Worker Secrets, Protected `/api/session/env` | HTML `<script>` tags, unauthenticated public `/api/config` |

---

## 2. Build-Time Static Isolation
- The Vite build command in `.github/workflows/deploy-cloudflare.yml` must run as a **pure static build**:
  ```bash
  npm run build
  ```
- **Zero secrets passed into the build environment**: Never pass secrets via `env:` or `--mode production` arguments to `npm run build`.
- Post-build step audits `dist/assets/*.js` for leaked strings using grep.

---

## 3. Runtime Edge Injection Isolation
- Never inject `<script>window.__APP_CONFIG__=...</script>` into HTML at request time.
- Use the **Protected Session Handshake** (`/api/session/env`) with `Sec-Fetch-Site: same-origin` validation and anti-curl user-agent filtering.
- Client decodes configuration in-memory only during application bootstrap.
