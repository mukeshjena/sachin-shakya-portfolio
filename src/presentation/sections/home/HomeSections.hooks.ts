// presentation/sections/home/HomeSections.hooks.ts
// Hook managing realtime homepage section synchronization and ordering.

import { useMemo } from "react";
import type { SectionDTO } from "../../../application/dto/SectionDTO";
import type { Section } from "../../../domain/entities/content/Section";
import { useRealtimeSync } from "../../shared/hooks/useRealtimeSync";
import { DEFAULT_HOME_SECTIONS } from "./HomeSections.constants";

export function useHomeSections(): readonly SectionDTO[] {
  const { data: realtimeSections } = useRealtimeSync<Section>("sections", {
    orderByField: "order",
    orderDirection: "asc",
  });

  return useMemo(() => {
    const homeSections = realtimeSections.filter(
      (s) => (!s.pageId || s.pageId === "home") && s.isVisible !== false
    );

    if (homeSections.length > 0) {
      return [...homeSections]
        .sort((a, b) => a.order - b.order)
        .map((s) => ({
          id: s.id,
          pageId: s.pageId || "home",
          type: s.type,
          title: s.title,
          content: s.content || {},
          order: s.order,
          isVisible: s.isVisible,
          createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : String(s.createdAt),
          updatedAt: s.updatedAt instanceof Date ? s.updatedAt.toISOString() : String(s.updatedAt),
        }));
    }

    return DEFAULT_HOME_SECTIONS;
  }, [realtimeSections]);
}
