// infrastructure/repositories/settings/FirestoreSiteSettingsRepository.ts
// Concrete Firestore implementation of ISiteSettingsRepository.
// Uses multi-tab IndexedDB cache and provides real-time snapshot subscription.

import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import type {
  SiteSettings,
  SocialLink,
  UpdateSiteSettingsInput,
} from "../../../domain/entities/admin/SiteSettings";
import type { ISiteSettingsRepository } from "../../../domain/repositories/settings/ISiteSettingsRepository";
import { getDb } from "../../firebase/firebaseClient";

const COLLECTION_NAME = "siteSettings";
const DOCUMENT_ID = "global";

interface FirestoreSiteSettingsDoc {
  id?: string;
  fullName?: string;
  headline?: string;
  shortBio?: string;
  email?: string;
  phone?: string;
  location?: string;
  logoUrl?: string;
  avatarUrl?: string;
  resumePdfUrl?: string;
  socialLinks?: SocialLink[];
  availabilityStatus?: "available" | "consulting_only" | "unavailable";
  availabilityNote?: string;
  createdAt?: string | { toDate: () => Date };
  updatedAt?: string | { toDate: () => Date };
}

function parseDate(val: unknown): Date {
  if (!val) return new Date();
  if (typeof val === "object" && val !== null && "toDate" in val) {
    return (val as { toDate: () => Date }).toDate();
  }
  if (typeof val === "string") {
    const parsed = new Date(val);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

function mapDocToSiteSettings(data: FirestoreSiteSettingsDoc): SiteSettings {
  return {
    id: "global",
    fullName: data.fullName ?? "Sachin Shakya",
    headline: data.headline ?? "Lead Cloud Architect & DevOps Consultant",
    shortBio:
      data.shortBio ??
      "Results-driven Cloud Architect with 8+ years architecting enterprise multi-cloud platforms, FinOps governance, and automated CI/CD pipelines.",
    email: data.email ?? "sachin.shakya@live.com",
    phone: data.phone ?? "+91 99112 00473",
    location: data.location ?? "Faridabad, Haryana, India",
    logoUrl: data.logoUrl ?? "/assets/sachin-logo.png",
    avatarUrl: data.avatarUrl,
    resumePdfUrl: data.resumePdfUrl ?? "/Sachin_Shakya_Resume.pdf",
    socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
    availabilityStatus: data.availabilityStatus ?? "available",
    availabilityNote: data.availabilityNote,
    createdAt: parseDate(data.createdAt),
    updatedAt: parseDate(data.updatedAt),
  };
}

export class FirestoreSiteSettingsRepository implements ISiteSettingsRepository {
  async getSettings(): Promise<SiteSettings | null> {
    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return null;
    }

    return mapDocToSiteSettings(snap.data() as FirestoreSiteSettingsDoc);
  }

  subscribeSettings(
    onUpdate: (settings: SiteSettings) => void,
    onError?: (error: Error) => void
  ): () => void {
    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);

    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          onUpdate(mapDocToSiteSettings(snap.data() as FirestoreSiteSettingsDoc));
        }
      },
      (err) => {
        if (onError) {
          onError(err);
        } else {
          console.error("[FirestoreSiteSettingsRepository] Snapshot error:", err);
        }
      }
    );
  }

  async updateSettings(input: UpdateSiteSettingsInput): Promise<void> {
    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const now = new Date();

    const payload = {
      ...input,
      updatedAt: now.toISOString(),
    };

    await setDoc(docRef, payload, { merge: true });
  }
}
