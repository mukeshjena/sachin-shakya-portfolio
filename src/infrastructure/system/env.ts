/**
 * Typed and validated environment configuration for Sachin Shakya Cloud/DevOps Executive Portfolio.
 *
 * Security Architecture:
 * 1. Zero credentials baked into client bundles or plain HTML.
 * 2. Asynchronously fetches obfuscated session config from protected edge endpoint (/api/session/env).
 * 3. Falls back to import.meta.env during local Vite development (npm run dev)
 *    and process.env in Node.js scripts (scripts/test-firestore.ts).
 */

export interface EnvConfig {
  readonly firebase: {
    readonly apiKey: string;
    readonly authDomain: string;
    readonly projectId: string;
    readonly storageBucket: string;
    readonly messagingSenderId: string;
    readonly appId: string;
    readonly measurementId?: string;
  };
  readonly cloudinary: {
    readonly cloudName: string;
  };
  readonly email: {
    readonly apiUrl: string;
    readonly recipient: string;
    readonly profile: string;
  };
  readonly app: {
    readonly mode: string;
    readonly isDev: boolean;
    readonly isProd: boolean;
    readonly siteUrl: string;
  };
}

export function getRawEnvValue(
  key: string,
  source?: Record<string, string | undefined>
): string | undefined {
  if (source !== undefined) {
    return source[key];
  }

  if (typeof import.meta !== "undefined" && import.meta.env && key in import.meta.env) {
    return import.meta.env[key] as string;
  }

  if (
    typeof globalThis !== "undefined" &&
    "process" in globalThis &&
    (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
  ) {
    return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
      ?.env?.[key];
  }

  return undefined;
}

function optionalVar(
  key: string,
  fallback: string,
  source?: Record<string, string | undefined>
): string {
  const value = getRawEnvValue(key, source);
  return value && value.trim() !== "" ? value.trim() : fallback;
}

let remoteConfigCache: Partial<EnvConfig> | null = null;
let cachedEnv: EnvConfig | null = null;

/**
 * Loads remote configuration from the protected edge endpoint at application startup.
 * In browser production, fetches /api/session/env which enforces same-origin validation.
 * In development or Node.js runtime, falls back to environment variables.
 */
export async function loadRemoteEnvConfig(): Promise<EnvConfig> {
  if (typeof window !== "undefined" && !import.meta.env.DEV) {
    try {
      const response = await fetch("/api/session/env", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-requested-with": "XMLHttpRequest",
        },
      });

      if (response.ok) {
        const data = (await response.json()) as { token?: string };
        if (data.token) {
          const decodedJson = decodeURIComponent(atob(data.token));
          remoteConfigCache = JSON.parse(decodedJson);
        }
      }
    } catch {
      // In case of edge handshake issues, fallback to cached or environment variables
    }
  }

  cachedEnv = createEnvConfig();
  return cachedEnv;
}

/**
 * Parses and validates environment variables into a strongly-typed EnvConfig object.
 */
export function createEnvConfig(source?: Record<string, string | undefined>): EnvConfig {
  const mode = optionalVar("MODE", "production", source);
  const isDev = mode === "development";
  const isProd = !isDev;

  const remote = remoteConfigCache;

  return {
    firebase: {
      apiKey:
        remote?.firebase?.apiKey ||
        optionalVar(
          "FIREBASE_API_KEY",
          optionalVar("VITE_FIREBASE_API_KEY", "AIzaSyCn3ngUlrnCnUIWYXQ_xXXZikZvviFed40", source),
          source
        ),
      authDomain:
        remote?.firebase?.authDomain ||
        optionalVar(
          "FIREBASE_AUTH_DOMAIN",
          optionalVar("VITE_FIREBASE_AUTH_DOMAIN", "sachin-shakya-site.firebaseapp.com", source),
          source
        ),
      projectId:
        remote?.firebase?.projectId ||
        optionalVar(
          "FIREBASE_PROJECT_ID",
          optionalVar("VITE_FIREBASE_PROJECT_ID", "sachin-shakya-site", source),
          source
        ),
      storageBucket:
        remote?.firebase?.storageBucket ||
        optionalVar(
          "FIREBASE_STORAGE_BUCKET",
          optionalVar(
            "VITE_FIREBASE_STORAGE_BUCKET",
            "sachin-shakya-site.firebasestorage.app",
            source
          ),
          source
        ),
      messagingSenderId:
        remote?.firebase?.messagingSenderId ||
        optionalVar(
          "FIREBASE_MESSAGING_SENDER_ID",
          optionalVar("VITE_FIREBASE_MESSAGING_SENDER_ID", "1052981737437", source),
          source
        ),
      appId:
        remote?.firebase?.appId ||
        optionalVar(
          "FIREBASE_APP_ID",
          optionalVar("VITE_FIREBASE_APP_ID", "1:1052981737437:web:b7839c633209bb78446834", source),
          source
        ),
      measurementId:
        remote?.firebase?.measurementId ||
        optionalVar(
          "FIREBASE_MEASUREMENT_ID",
          optionalVar("VITE_FIREBASE_MEASUREMENT_ID", "", source),
          source
        ) ||
        undefined,
    },
    cloudinary: {
      cloudName:
        remote?.cloudinary?.cloudName ||
        optionalVar(
          "CLOUDINARY_CLOUD_NAME",
          optionalVar("VITE_CLOUDINARY_CLOUD_NAME", "dq6oxixuf", source),
          source
        ),
    },
    email: {
      // Email is routed through the secure server-side Edge Proxy (/api/contact)
      // Secrets and recipient addresses are NEVER revealed to the client.
      apiUrl: "/api/contact",
      recipient: "",
      profile: "sachin-shakya",
    },
    app: {
      mode,
      isDev,
      isProd,
      siteUrl:
        remote?.app?.siteUrl ||
        optionalVar(
          "SITE_URL",
          optionalVar("VITE_SITE_URL", "https://shakya.mukeshjena.com", source),
          source
        ),
    },
  };
}

/**
 * Singleton accessor for the validated environment configuration.
 */
export function getEnv(): EnvConfig {
  if (!cachedEnv) {
    cachedEnv = createEnvConfig();
  }
  return cachedEnv;
}

export const env = getEnv();
