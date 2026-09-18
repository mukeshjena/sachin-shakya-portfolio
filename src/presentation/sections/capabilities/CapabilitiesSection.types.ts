// presentation/sections/capabilities/CapabilitiesSection.types.ts
// Contract types and UI state for the Capabilities filterable section.

import type { CapabilityCardItem, CapabilityCategory } from "./constants/capabilities.constants";

export interface CapabilitiesSectionProps {
  readonly content?: Record<string, unknown>;
}

export interface CapabilitiesSectionState {
  readonly selectedCategory: CapabilityCategory;
  readonly setSelectedCategory: (category: CapabilityCategory) => void;
  readonly filteredCards: readonly CapabilityCardItem[];
  readonly headline?: string;
  readonly subheadline?: string;
}
