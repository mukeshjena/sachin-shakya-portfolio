---
name: edge-security-and-credentials-protection
description: >-
  Edge security architecture, zero public credentials exposure, protected session handshakes, server-side edge proxies, and Google Cloud API lockdown.
  Activate when designing, reviewing, or implementing security perimeters, edge gateways, API authentication, secrets management, CORS/CSP policies, or anti-scraping defenses.
---

# Edge Security & Credentials Protection Skill

This skill enforces strict perimeter security, zero-trust secrets isolation, and edge-level proxying for the Sachin Shakya Executive Portfolio. It prevents credential leakage, unauthorized API harvesting, and direct backend abuse.

---

## 1. Zero Credentials in HTML & Bundles (The Non-Negotiable Baseline)
- **Zero Script Injection**: NEVER inject runtime secrets, API keys, endpoints, or emails into `index.html` via `<script>window.__APP_CONFIG__=...</script>` or equivalent.
- **Pure Static Bundles**: `npm run build` MUST compile with zero environment variables baked in. Inspect `dist/assets/*.js` to ensure no API keys or backend URLs are embedded.
- **Verification Command**:
  ```bash
  curl -s https://shakya.mukeshjena.com | grep -E "(apiKey|APP_CONFIG|@|secret)"
  ```
  MUST return **ZERO** matches.

---

## 2. Protected Session Handshake (`GET /api/session/env`)
When the client application requires connection parameters (e.g. Firebase project ID, Cloudinary cloud name):
- **Sec-Fetch-Site Enforcement**: The edge worker MUST verify `request.headers.get("sec-fetch-site") === "same-origin"`. This is a browser-controlled forbidden header that cross-site scripts cannot forge.
- **Anti-Automated Tooling Filter**: Inspect `User-Agent`. Immediately reject `curl`, `wget`, `python`, `postman`, `insomnia`, `httpie`, and automated scrapers with `403 Forbidden`.
- **Allowed Hostname Restriction**: Verify `Origin` and `Referer` against whitelist (`shakya.mukeshjena.com`, `localhost`).
- **Obfuscated Payload**: Encode payload as an obfuscated base64 token so raw JSON keys are never exposed in plaintext network streams.
- **Strict Headers**: Serve with `Cache-Control: no-store, private` and `Pragma: no-cache`.

---

## 3. Server-Side Edge Proxying (Zero Client-Side Secrets)
Sensitive backend operations MUST NEVER expose their endpoints or keys to the browser:
- **Email Microservice (`POST /api/contact`)**:
  - Client sends `{ name, email, message, subject? }` to `/api/contact` on its own domain.
  - The Edge Worker validates input length, sanitizes strings, checks email regex, and enforces IP rate-limiting (max 5 requests / 10 min).
  - Worker dispatches the email server-side using Worker secrets (`EMAIL_API_URL`, `EMAIL_RECIPIENT`, `EMAIL_PROFILE`).
  - The browser NEVER knows the internal email microservice URL or Sachin's private email address.
- **Cloudinary Signed Uploads (`POST /api/cloudinary/sign`)**:
  - `CLOUDINARY_API_SECRET` and `CLOUDINARY_API_KEY` remain 100% on the Worker edge.
  - Client requests a signature for admin uploads; Worker computes SHA-1/SHA-256 signature server-side.

---

## 4. Enterprise HTTP Security Headers
Every response served by the Cloudflare Edge Worker MUST include:
- `Content-Security-Policy`:
  `default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://res.cloudinary.com; img-src 'self' data: https://res.cloudinary.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-ancestors 'none'; object-src 'none'; base-uri 'self';`
- `X-Content-Type-Options: nosniff` (prevents MIME-type sniffing)
- `X-Frame-Options: DENY` (prevents clickjacking)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`

---

## 5. Google Cloud Console API Key Lockdown
All Firebase Web API keys (`AIzaSy...`) MUST be locked down in Google Cloud Console (`console.cloud.google.com`):
1. **Application Restriction**: Restrict to HTTP referrers:
   - `https://shakya.mukeshjena.com/*`
   - `https://*.mukeshjena.com/*`
   - `http://localhost:*`
2. **API Restrictions**: Restrict key strictly to:
   - Cloud Firestore API
   - Identity Toolkit API
   - Cloud Storage API
3. **Defense in Depth**: Even if an attacker extracts the public client identifier, Google's API Gateway drops any request not originating from `shakya.mukeshjena.com`.
