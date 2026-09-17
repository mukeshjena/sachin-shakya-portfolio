// domain/entities/profile/Competency.ts
// Pure domain entity modeling technical domains, cloud platforms, and tooling skills.

export interface Competency {
  /** Deterministic Firestore document ID (e.g. "comp-cloud", "comp-devops-iac") */
  readonly id: string;
  readonly category: string;
  readonly description?: string;
  readonly skills: readonly string[];
  readonly proficiencyLevel?: "expert" | "advanced" | "proficient";
  /** Cupertino / Phosphor icon identifier */
  readonly iconName?: string;
  readonly order: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type CreateCompetencyInput = Omit<Competency, "id" | "createdAt" | "updatedAt">;
export type UpdateCompetencyInput = Partial<Omit<Competency, "id" | "createdAt" | "updatedAt">>;
