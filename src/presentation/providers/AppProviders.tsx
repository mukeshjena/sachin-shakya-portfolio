// presentation/providers/AppProviders.tsx
// Root composition for all application-level providers.
// ErrorBoundary -> ThemeProvider -> SiteConfigProvider -> AuthProvider -> ToastProvider.

import { ThemeProvider } from "../theme/ThemeProvider";
import type { AppProvidersProps } from "./AppProviders.types";
import { AuthProvider } from "./auth/AuthProvider";
import { ErrorBoundary } from "./errors/ErrorBoundary";
import { SiteConfigProvider } from "./site-config/SiteConfigProvider";
import { ToastProvider } from "./toast/ToastProvider";

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SiteConfigProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </SiteConfigProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
