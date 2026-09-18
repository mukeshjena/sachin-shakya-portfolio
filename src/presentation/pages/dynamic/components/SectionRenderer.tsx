// presentation/pages/dynamic/components/SectionRenderer.tsx
// Maps a domain SectionDTO to its concrete presentation component.
// Declarative dispatching with zero direct database operations.

import { BlackholeHero } from "../../../hero/BlackholeHero";
import { ExecutiveOverview } from "../../../overview/ExecutiveOverview";
import { CapabilitiesSection } from "../../../sections/capabilities/CapabilitiesSection";
import { ContactSection } from "../../../sections/contact/ContactSection";
import { CredentialsSection } from "../../../sections/credentials/CredentialsSection";
import { ExperienceSection } from "../../../sections/experience/ExperienceSection";
import { TelemetrySection } from "../../../sections/telemetry/TelemetrySection";
import type { SectionRendererProps } from "../DynamicPage.types";
import { CustomSection } from "./CustomSection";

export function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.type) {
    case "hero":
      return <BlackholeHero />;

    case "impact":
      return <ExecutiveOverview />;

    case "telemetry":
      return <TelemetrySection />;

    case "experience":
      return <ExperienceSection />;

    case "capabilities":
      return <CapabilitiesSection />;

    case "credentials":
      return <CredentialsSection />;

    case "contact":
      return <ContactSection />;

    default:
      return <CustomSection section={section} />;
  }
}
