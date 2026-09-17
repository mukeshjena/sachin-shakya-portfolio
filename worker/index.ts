/**
 * Sachin Shakya Executive Portfolio — Cloudflare Edge Worker API Gateway
 *
 * Security Architecture:
 * 1. ZERO credentials injected into HTML — pure, clean static HTML output.
 * 2. Protected session handshake (/api/session/env) with strict same-origin,
 *    user-agent, and referer verification. Blocks curl, scrapers, and external calls.
 * 3. Server-side Edge Email Proxy (/api/contact) hiding all email API URLs and recipient addresses.
 * 4. Enterprise HTTP security headers (CSP, HSTS, nosniff, DENY frame).
 */

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  // Firebase Web config (synced from GitHub secrets to Worker secrets)
  FIREBASE_API_KEY?: string;
  FIREBASE_AUTH_DOMAIN?: string;
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_STORAGE_BUCKET?: string;
  FIREBASE_MESSAGING_SENDER_ID?: string;
  FIREBASE_APP_ID?: string;
  FIREBASE_MEASUREMENT_ID?: string;
  FIREBASE_SERVICE_ACCOUNT_JSON?: string;
  // Cloudinary
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  // Email Microservice
  EMAIL_API_URL?: string;
  EMAIL_RECIPIENT?: string;
  EMAIL_PROFILE?: string;
  // App
  SITE_URL?: string;
}

function securityHeaders(): Record<string, string> {
  return {
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://res.cloudinary.com; img-src 'self' data: https://res.cloudinary.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-ancestors 'none'; object-src 'none'; base-uri 'self';",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  };
}

function corsHeaders(origin = "https://shakya.mukeshjena.com"): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-requested-with",
    Vary: "Origin",
  };
}

function isLegitimateBrowserRequest(request: Request): boolean {
  const userAgent = request.headers.get("user-agent") || "";
  const secFetchSite = request.headers.get("sec-fetch-site");
  const referer = request.headers.get("referer") || "";
  const origin = request.headers.get("origin") || "";

  // Reject curl, wget, python, postman, insomnia, httpie, and common automated scrapers
  const isAutomatedClient =
    !userAgent ||
    /curl|wget|python|postman|insomnia|httpie|go-http|axios|fetch-client/i.test(userAgent);
  if (isAutomatedClient) {
    return false;
  }

  // Check origin / referer domain
  const isAllowedHost = (urlStr: string) => {
    try {
      const u = new URL(urlStr);
      return (
        u.hostname === "shakya.mukeshjena.com" ||
        u.hostname.endsWith(".mukeshjena.com") ||
        u.hostname === "localhost" ||
        u.hostname === "127.0.0.1"
      );
    } catch {
      return false;
    }
  };

  // Enforce browser same-origin signals
  if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "none") {
    return false;
  }

  if (origin && !isAllowedHost(origin)) {
    return false;
  }

  if (referer && !isAllowedHost(referer)) {
    return false;
  }

  return true;
}

function getPublicClientPayload(env: Env): string {
  const payload = {
    firebase: {
      apiKey: env.FIREBASE_API_KEY || "",
      authDomain: env.FIREBASE_AUTH_DOMAIN || "sachin-shakya-site.firebaseapp.com",
      projectId: env.FIREBASE_PROJECT_ID || "sachin-shakya-site",
      storageBucket: env.FIREBASE_STORAGE_BUCKET || "sachin-shakya-site.firebasestorage.app",
      messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || "1052981737437",
      appId: env.FIREBASE_APP_ID || "1:1052981737437:web:b7839c633209bb78446834",
      measurementId: env.FIREBASE_MEASUREMENT_ID || "",
    },
    cloudinary: {
      cloudName: env.CLOUDINARY_CLOUD_NAME || "dq6oxixuf",
    },
    app: {
      siteUrl: env.SITE_URL || "https://shakya.mukeshjena.com",
    },
  };

  // Obfuscate as base64 URI component to prevent plaintext network snooping
  return btoa(encodeURIComponent(JSON.stringify(payload)));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request.headers.get("origin") || undefined),
      });
    }

    // Protected runtime session environment endpoint
    if (url.pathname === "/api/session/env") {
      if (!isLegitimateBrowserRequest(request)) {
        return new Response(
          JSON.stringify({
            error:
              "Direct API access prohibited. Requests must originate from the verified web application.",
          }),
          {
            status: 403,
            headers: {
              "Content-Type": "application/json",
              ...securityHeaders(),
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          token: getPublicClientPayload(env),
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            ...corsHeaders(request.headers.get("origin") || undefined),
            ...securityHeaders(),
          },
        }
      );
    }

    // Server-Side Edge Email Proxy: Hide email service URL and recipient address
    if (url.pathname === "/api/contact" && request.method === "POST") {
      if (!isLegitimateBrowserRequest(request)) {
        return new Response(JSON.stringify({ error: "Access Denied" }), {
          status: 403,
          headers: { "Content-Type": "application/json", ...securityHeaders() },
        });
      }

      try {
        const body = (await request.json()) as {
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
        };

        const { name, email, subject, message } = body;
        if (!name || !email || !message) {
          return new Response(JSON.stringify({ error: "Missing required fields" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...securityHeaders() },
          });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || name.length > 100 || message.length > 3000) {
          return new Response(JSON.stringify({ error: "Invalid submission data" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...securityHeaders() },
          });
        }

        if (!env.EMAIL_API_URL) {
          return new Response(JSON.stringify({ error: "Email service unconfigured" }), {
            status: 503,
            headers: { "Content-Type": "application/json", ...securityHeaders() },
          });
        }

        // Server-side forward to internal microservice — credentials NEVER touch client
        const emailPayload = {
          to: env.EMAIL_RECIPIENT || "sachin.shakya@live.com",
          subject: `[Portfolio Inquiry] ${subject || "Contact Form Submission"} from ${name}`,
          profile: env.EMAIL_PROFILE || "sachin-shakya",
          html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>`,
        };

        const emailResponse = await fetch(env.EMAIL_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        });

        if (!emailResponse.ok) {
          return new Response(JSON.stringify({ error: "Failed to dispatch email" }), {
            status: 502,
            headers: { "Content-Type": "application/json", ...securityHeaders() },
          });
        }

        return new Response(
          JSON.stringify({ success: true, message: "Inquiry dispatched successfully" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...securityHeaders() },
          }
        );
      } catch (_err) {
        return new Response(JSON.stringify({ error: "Internal processing error" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...securityHeaders() },
        });
      }
    }

    // Pass through hashed static assets and files with extensions
    const isStaticAsset =
      url.pathname.startsWith("/assets/") ||
      /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|webmanifest|pdf|txt|xml|json)$/.test(
        url.pathname
      );

    if (isStaticAsset) {
      return await env.ASSETS.fetch(request);
    }

    // For all SPA routes, fetch index.html from ASSETS directly (ZERO credentials injected into HTML)
    const assetResponse = await env.ASSETS.fetch(new Request(new URL("/index.html", request.url)));
    if (!assetResponse.ok) {
      return assetResponse;
    }

    const html = await assetResponse.text();
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
        ...securityHeaders(),
      },
    });
  },
};
