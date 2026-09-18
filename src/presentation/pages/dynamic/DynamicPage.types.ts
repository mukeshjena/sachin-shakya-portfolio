// presentation/pages/dynamic/DynamicPage.types.ts
// Contract and state types for dynamic page resolution and section rendering.
// Adheres strictly to Universal Separation of Concerns (Rule 13).

import type { PageDTO } from "../../../application/dto/PageDTO";
import type { SectionDTO } from "../../../application/dto/SectionDTO";

export interface DynamicPageState {
  readonly slug: string;
  readonly page: PageDTO | null;
  readonly sections: SectionDTO[];
  readonly isLoading: boolean;
  readonly isNotFound: boolean;
  readonly error: string | null;
  readonly handleReload: () => void;
  readonly handleReturnHome: () => void;
}

export interface DynamicPageProps {
  readonly slug?: string;
}

export interface SectionRendererProps {
  readonly section: SectionDTO;
}

export interface CustomSectionProps {
  readonly section: SectionDTO;
}

export interface NotFoundTelemetryProps {
  readonly slug: string;
  readonly onReturnHome: () => void;
}
