/**
 * Typed and validated environment configuration for Sachin Shakya Cloud/DevOps Executive Portfolio.
 * Follows DIIRA reference pattern for multi-runtime variable extraction (Vite import.meta.env,
 * Node/Worker globalThis.process.env, and window.__APP_CONFIG__).
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

/**
 * Retrieves a raw environment variable safely across Vite (import.meta.env)
 * and Node/Worker runtime (globalThis.process.env).
 */
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

/**
 * Extracts an optional environment variable with a default fallback.
 */
function optionalVar(
  key: string,
  fallback: string,
  source?: Record<string, string | undefined>
): string {
  const value = getRawEnvValue(key, source);
  return value && value.trim() !== "" ? value.trim() : fallback;
}

declare global {
  interface Window {
    __APP_CONFIG__?: {
      firebase?: {
        apiKey?: string;
        authDomain?: string;
        projectId?: string;
        storageBucket?: string;
        messagingSenderId?: string;
        appId?: string;
        measurementId?: string;
      };
      cloudinary?: {
        cloudName?: string;
      };
      email?: {
        apiUrl?: string;
        recipient?: string;
        profile?: string;
      };
      app?: {
        siteUrl?: string;
      };
    };
  }
}

/**
 * Parses and validates environment variables into a strongly-typed EnvConfig object.
 * Priority order:
 * 1. window.__APP_CONFIG__ (injected directly by Cloudflare Worker at edge request time)
 * 2. import.meta.env / process.env (Vite development / test environment)
 * 3. Graceful fallback defaults (ensures build succeeds without baking secrets into bundles)
 */
export function createEnvConfig(source?: Record<string, string | undefined>): EnvConfig {
  const mode = optionalVar("MODE", "production", source);
  const isDev = mode === "development";
  const isProd = !isDev;

  const appConfig =
    typeof window !== "undefined" && window.__APP_CONFIG__ ? window.__APP_CONFIG__ : undefined;

  return {
    firebase: {
      apiKey:
        appConfig?.firebase?.apiKey ||
        optionalVar(
          "FIREBASE_API_KEY",
          optionalVar("VITE_FIREBASE_API_KEY", "AIzaSyCn3ngUlrnCnUIWYXQ_xXXZikZvviFed40", source),
          source
        ),
      authDomain:
        appConfig?.firebase?.authDomain ||
        optionalVar(
          "FIREBASE_AUTH_DOMAIN",
          optionalVar("VITE_FIREBASE_AUTH_DOMAIN", "sachin-shakya-site.firebaseapp.com", source),
          source
        ),
      projectId:
        appConfig?.firebase?.projectId ||
        optionalVar(
          "FIREBASE_PROJECT_ID",
          optionalVar("VITE_FIREBASE_PROJECT_ID", "sachin-shakya-site", source),
          source
        ),
      storageBucket:
        appConfig?.firebase?.storageBucket ||
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
        appConfig?.firebase?.messagingSenderId ||
        optionalVar(
          "FIREBASE_MESSAGING_SENDER_ID",
          optionalVar("VITE_FIREBASE_MESSAGING_SENDER_ID", "1052981737437", source),
          source
        ),
      appId:
        appConfig?.firebase?.appId ||
        optionalVar(
          "FIREBASE_APP_ID",
          optionalVar("VITE_FIREBASE_APP_ID", "1:1052981737437:web:b7839c633209bb78446834", source),
          source
        ),
      measurementId:
        appConfig?.firebase?.measurementId ||
        optionalVar(
          "FIREBASE_MEASUREMENT_ID",
          optionalVar("VITE_FIREBASE_MEASUREMENT_ID", "", source),
          source
        ) ||
        undefined,
    },
    cloudinary: {
      cloudName:
        appConfig?.cloudinary?.cloudName ||
        optionalVar(
          "CLOUDINARY_CLOUD_NAME",
          optionalVar("VITE_CLOUDINARY_CLOUD_NAME", "dq6oxixuf", source),
          source
        ),
    },
    email: {
      apiUrl:
        appConfig?.email?.apiUrl ||
        optionalVar(
          "EMAIL_API_URL",
          optionalVar("VITE_EMAIL_API_URL", "https://odina.mukeshjena.com/api/email/send", source),
          source
        ),
      recipient:
        appConfig?.email?.recipient ||
        optionalVar(
          "EMAIL_RECIPIENT",
          optionalVar("VITE_EMAIL_RECIPIENT", "sachin.shakya@live.com", source),
          source
        ),
      profile:
        appConfig?.email?.profile ||
        optionalVar(
          "EMAIL_PROFILE",
          optionalVar("VITE_EMAIL_PROFILE", "sachin-shakya", source),
          source
        ),
    },
    app: {
      mode,
      isDev,
      isProd,
      siteUrl:
        appConfig?.app?.siteUrl ||
        optionalVar(
          "SITE_URL",
          optionalVar("VITE_SITE_URL", "https://shakya.mukeshjena.com", source),
          source
        ),
    },
  };
}

let cachedEnv: EnvConfig | null = null;

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
