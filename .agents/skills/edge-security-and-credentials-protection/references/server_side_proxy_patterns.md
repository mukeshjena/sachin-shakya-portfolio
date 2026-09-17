# Server-Side Edge Proxy Patterns

Architectural blueprints for proxying sensitive third-party services through Cloudflare Workers.

---

## 1. Contact Form & Email Dispatch Proxy (`/api/contact`)

```
[Browser Client]
       │
       ▼ (1) POST /api/contact { name, email, subject, message }
[Cloudflare Edge Worker]
       ├─ (2) Verify sec-fetch-site === "same-origin"
       ├─ (3) Inspect User-Agent (reject bots, curl, scrapers)
       ├─ (4) Rate-limit client IP (CF-Connecting-IP)
       ├─ (5) Validate input format & length limits
       │
       ▼ (6) Server-to-server POST (Worker Secrets: EMAIL_API_URL, EMAIL_RECIPIENT)
[Email Microservice (ODINA Gateway)]
```

### Implementation Checklist:
1. Client calls `fetch("/api/contact", { method: "POST", body: JSON.stringify(...) })`.
2. Worker extracts `env.EMAIL_API_URL` and `env.EMAIL_RECIPIENT` exclusively on the server side.
3. Neither the microservice endpoint nor Sachin's email address is ever transmitted to or stored on the client.

---

## 2. Cloudinary Media Management Proxy (`/api/cloudinary/*`)
- **Upload Signing (`/api/cloudinary/sign`)**:
  - Worker receives parameters to sign (`timestamp`, `folder`, `public_id`).
  - Worker generates SHA-1 or SHA-256 HMAC signature using `env.CLOUDINARY_API_SECRET`.
  - Worker returns signature and timestamp to authorized client.
  - Client uploads directly to Cloudinary API using the short-lived signature.
- **Cascade Deletion (`/api/cloudinary/delete`)**:
  - Gated behind verified admin session token (`accessCodes`).
  - Worker calls Cloudinary Admin API server-to-server to delete assets upon content removal.
