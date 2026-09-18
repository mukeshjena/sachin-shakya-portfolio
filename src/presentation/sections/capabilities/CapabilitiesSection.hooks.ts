// presentation/sections/capabilities/CapabilitiesSection.hooks.ts
// State and filtering logic for the Capabilities competency grid.
// Universal Separation of Concerns (Rule 13).

import { useMemo, useState } from "react";
import type { CapabilitiesSectionState } from "./CapabilitiesSection.types";
import {
  CAPABILITY_CARDS,
  type CapabilityCardItem,
  type CapabilityCategory,
} from "./constants/capabilities.constants";

export function useCapabilitiesSectionLogic(): CapabilitiesSectionState {
  const [selectedCategory, setSelectedCategory] = useState<CapabilityCategory>("all");

  const filteredCards = useMemo<readonly CapabilityCardItem[]>(() => {
    if (selectedCategory === "all") {
      return CAPABILITY_CARDS;
    }
    return CAPABILITY_CARDS.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  return {
    selectedCategory,
    setSelectedCategory,
    filteredCards,
  };
}
