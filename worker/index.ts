/**
 * Sachin Shakya Executive Portfolio — Cloudflare Edge Worker API Gateway
 *
 * Intercepts incoming requests:
 * 1. For static assets (JS, CSS, images), delegates directly to env.ASSETS.
 * 2. For HTML / SPA page routes, fetches index.html from env.ASSETS and injects
 *    the runtime configuration (window.__APP_CONFIG__) from Cloudflare Worker secrets.
 *    This ensures ZERO credentials are baked into client JS bundles during build time.
 * 3. Provides /api/config for runtime validation.
 * 4. Prepared for /api/cloudinary/* and /api/email/* edge proxies.
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

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, x-cloudinary-key, x-cloudinary-secret, x-cloudinary-cloud",
  };
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });
}

function getClientConfig(env: Env) {
  return {
    firebase: {
      apiKey: env.FIREBASE_API_KEY || "AIzaSyCn3ngUlrnCnUIWYXQ_xXXZikZvviFed40",
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
    email: {
      apiUrl: env.EMAIL_API_URL || "https://odina.mukeshjena.com/api/email/send",
      recipient: env.EMAIL_RECIPIENT || "sachin.shakya@live.com",
      profile: env.EMAIL_PROFILE || "sachin-shakya",
    },
    app: {
      siteUrl: env.SITE_URL || "https://shakya.mukeshjena.com",
    },
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    // Config endpoint for runtime diagnostic inspection
    if (url.pathname === "/api/config") {
      return jsonResponse(getClientConfig(env));
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

    // For all SPA routes, fetch index.html from ASSETS and inject runtime config
    const assetResponse = await env.ASSETS.fetch(new Request(new URL("/index.html", request.url)));
    if (!assetResponse.ok) {
      return assetResponse;
    }

    const html = await assetResponse.text();
    const config = getClientConfig(env);
    const scriptTag = `<script>window.__APP_CONFIG__=${JSON.stringify(config)};</script>`;

    const injectedHtml = html.includes("</head>")
      ? html.replace("</head>", `${scriptTag}</head>`)
      : `${scriptTag}${html}`;

    return new Response(injectedHtml, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
        ...corsHeaders(),
      },
    });
  },
};
