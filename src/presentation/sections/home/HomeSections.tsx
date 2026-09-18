// presentation/sections/home/HomeSections.tsx
// Pure declarative container dynamically mapping visible homepage sections in order.
// Zero inline calculations, shadow-free, and adheres to Universal Separation of Concerns (Rule 13).

import type React from "react";
import { SectionRenderer } from "../../pages/dynamic/components/SectionRenderer";
import { useHomeSections } from "./HomeSections.hooks";

export const HomeSections: React.FC = () => {
  const sections = useHomeSections();

  return (
    <>
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
};
