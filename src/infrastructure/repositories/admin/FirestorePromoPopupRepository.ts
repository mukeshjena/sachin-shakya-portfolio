// infrastructure/repositories/admin/FirestorePromoPopupRepository.ts
// Concrete Firestore implementation of IPromoPopupRepository.
// Manages the singleton promoPopup/global configuration.

import { doc, getDoc, setDoc } from "firebase/firestore";
import type { PromoPopup, UpdatePromoPopupInput } from "../../../domain/entities/admin/PromoPopup";
import type { IPromoPopupRepository } from "../../../domain/repositories/promo/IPromoPopupRepository";
import { getDb } from "../../firebase/firebaseClient";

const COLLECTION_NAME = "promoPopup";
const DOC_ID = "global";

interface FirestorePromoDoc {
  id?: string;
  isEnabled?: boolean;
  heading?: string;
  subheading?: string;
  badgeText?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  displayDelaySeconds?: number;
  recurrenceDays?: number;
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

function mapDocToPromo(data: FirestorePromoDoc): PromoPopup {
  return {
    id: "global",
    isEnabled: data.isEnabled ?? false,
    heading: data.heading ?? "Optimize Your Cloud Infrastructure",
    subheading:
      data.subheading ??
      "Looking to reduce Azure/AWS spend or accelerate your DevOps delivery pipeline? Let's schedule a 30-minute cloud architecture review.",
    badgeText: data.badgeText ?? "FINOPS & DEVOPS CONSULTATION",
    ctaText: data.ctaText ?? "Schedule Cloud Review",
    ctaLink: data.ctaLink ?? "#contact",
    imageUrl: data.imageUrl,
    displayDelaySeconds:
      typeof data.displayDelaySeconds === "number" ? data.displayDelaySeconds : 6,
    recurrenceDays: typeof data.recurrenceDays === "number" ? data.recurrenceDays : 7,
    createdAt: parseDate(data.createdAt),
    updatedAt: parseDate(data.updatedAt),
  };
}

export class FirestorePromoPopupRepository implements IPromoPopupRepository {
  /**
   * Fetches the singleton promo popup document from Firestore.
   */
  async get(): Promise<PromoPopup | null> {
    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return mapDocToPromo(docSnap.data() as FirestorePromoDoc);
  }

  /**
   * Updates or merges promo popup settings into Firestore.
   */
  async update(input: UpdatePromoPopupInput): Promise<PromoPopup> {
    const db = getDb();
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const now = new Date();

    const updatePayload: Record<string, unknown> = {
      ...input,
      updatedAt: now.toISOString(),
    };

    await setDoc(docRef, updatePayload, { merge: true });

    const updated = await this.get();
    if (!updated) {
      throw new Error("Failed to retrieve updated promo popup document.");
    }

    return updated;
  }
}
