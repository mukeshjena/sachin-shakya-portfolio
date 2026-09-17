// domain/entities/profile/Experience.ts
// Pure domain entity modeling corporate leadership and cloud architecture career history.

export interface Experience {
  /** Deterministic Firestore document ID (e.g. "exp-eptura", "exp-ltimindtree") */
  readonly id: string;
  readonly company: string;
  readonly role: string;
  readonly client?: string;
  readonly location: string;
  readonly period: string;
  readonly startDate: string;
  readonly endDate?: string;
  readonly isCurrent: boolean;
  readonly summary: string;
  readonly achievements: readonly string[];
  readonly technologies: readonly string[];
  /** Chronological presentation sort order */
  readonly order: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type CreateExperienceInput = Omit<Experience, "id" | "createdAt" | "updatedAt">;
export type UpdateExperienceInput = Partial<Omit<Experience, "id" | "createdAt" | "updatedAt">>;
