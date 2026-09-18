// presentation/sections/capabilities/CapabilitiesSection.hooks.ts
// State and filtering logic for the Capabilities competency grid.
// Universal Separation of Concerns (Rule 13).

import { useMemo, useState } from "react";
import type { CapabilitiesSectionState } from "./CapabilitiesSection.types";
import {
  CAPABILITIES_COPY,
  CAPABILITY_CARDS,
  type CapabilityCardItem,
  type CapabilityCategory,
} from "./constants/capabilities.constants";

export function useCapabilitiesSectionLogic(
  content?: Record<string, unknown>
): CapabilitiesSectionState {
  const [selectedCategory, setSelectedCategory] = useState<CapabilityCategory>("all");

  const cards = useMemo<readonly CapabilityCardItem[]>(() => {
    if (content?.cards && Array.isArray(content.cards) && content.cards.length > 0) {
      return content.cards as readonly CapabilityCardItem[];
    }
    return CAPABILITY_CARDS;
  }, [content?.cards]);

  const filteredCards = useMemo<readonly CapabilityCardItem[]>(() => {
    if (selectedCategory === "all") {
      return cards;
    }
    return cards.filter((c) => c.category === selectedCategory);
  }, [cards, selectedCategory]);

  const headline =
    typeof content?.heading === "string"
      ? content.heading
      : typeof content?.headline === "string"
        ? content.headline
        : CAPABILITIES_COPY.headline;

  const subheadline =
    typeof content?.subheading === "string"
      ? content.subheading
      : typeof content?.subheadline === "string"
        ? content.subheadline
        : CAPABILITIES_COPY.subheadline;

  return {
    selectedCategory,
    setSelectedCategory,
    filteredCards,
    headline,
    subheadline,
  };
}
