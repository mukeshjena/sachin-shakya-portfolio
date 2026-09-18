// App.tsx — Application root container.
// Pure declarative JSX markup (agent rule #3 / Rule 13).
// All logic, state, and DI hooks live in App.hooks.ts.

import { useAppState } from "./App.hooks";
import { BlackholeHero } from "./presentation/hero/BlackholeHero";
import { CustomCursor } from "./presentation/hero/cursor/CustomCursor";
import { ExecutiveOverview } from "./presentation/overview/ExecutiveOverview";
import { DynamicPage } from "./presentation/pages/dynamic/DynamicPage";
import { PipelineTest } from "./presentation/pages/pipeline-test/PipelineTest";
import { PromoPopupModal } from "./presentation/promo/PromoPopupModal";
import { AppProviders } from "./presentation/providers/AppProviders";
import { CapabilitiesSection } from "./presentation/sections/capabilities/CapabilitiesSection";
import { ContactSection } from "./presentation/sections/contact/ContactSection";
import { CredentialsSection } from "./presentation/sections/credentials/CredentialsSection";
import { ExperienceSection } from "./presentation/sections/experience/ExperienceSection";
import { TelemetrySection } from "./presentation/sections/telemetry/TelemetrySection";
import { AppLayout } from "./presentation/shell/layout/AppLayout";

function App() {
  const { showPipelineTest, isDynamicRoute, activeSlug } = useAppState();

  return (
    <AppProviders>
      <CustomCursor />
      <PromoPopupModal />
      <AppLayout>
        {showPipelineTest ? (
          <div className="p-6 md:p-12 flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <PipelineTest />
            </div>
          </div>
        ) : isDynamicRoute ? (
          <DynamicPage slug={activeSlug} />
        ) : (
          <>
            <BlackholeHero />
            <ExecutiveOverview />
            <TelemetrySection />
            <ExperienceSection />
            <CapabilitiesSection />
            <CredentialsSection />
            <ContactSection />
          </>
        )}
      </AppLayout>
    </AppProviders>
  );
}

export default App;
