// App.tsx — Application root container.
// Pure declarative JSX markup (agent rule #3 / Rule 13).
// All logic, state, and DI hooks live in App.hooks.ts.

import { useAppState } from "./App.hooks";
import { AdminLogin } from "./presentation/admin/login/AdminLogin";
import { DynamicPage } from "./presentation/pages/dynamic/DynamicPage";
import { PipelineTest } from "./presentation/pages/pipeline-test/PipelineTest";
import { PromoPopupModal } from "./presentation/promo/PromoPopupModal";
import { AppProviders } from "./presentation/providers/AppProviders";
import { HomeSections } from "./presentation/sections/home/HomeSections";
import { PwaInstallPrompt } from "./presentation/shared/pwa/PwaInstallPrompt";
import { SeoHead } from "./presentation/shared/seo/SeoHead";
import { AppLayout } from "./presentation/shell/layout/AppLayout";

function App() {
  const { showPipelineTest, isDynamicRoute, activeSlug, isAdminRoute } = useAppState();

  return (
    <AppProviders>
      <PromoPopupModal />
      <PwaInstallPrompt />
      <AppLayout>
        {showPipelineTest ? (
          <div className="p-6 md:p-12 flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <PipelineTest />
            </div>
          </div>
        ) : isAdminRoute ? (
          <AdminLogin />
        ) : isDynamicRoute ? (
          <DynamicPage slug={activeSlug} />
        ) : (
          <>
            <SeoHead
              title="Sachin Shakya — Lead Cloud Architect & DevOps Consultant"
              description="AI-Native Lead Cloud Architect managing 2,000+ multi-cloud resources with $170K/month verified cost optimization and 40% MTTR reduction across AWS, Microsoft Azure, and Kubernetes."
              canonicalPath="/"
              ogImage="/og-image.png"
            />
            <HomeSections />
          </>
        )}
      </AppLayout>
    </AppProviders>
  );
}

export default App;
