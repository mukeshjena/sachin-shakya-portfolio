// presentation/providers/site-config/SiteConfigProvider.tsx
// Connects to Firestore siteSettings via Clean Architecture DI use-case.
// Provides real-time reactivity without page reloads.

import { type ReactNode, useEffect, useMemo, useState } from "react";
import type { ISubscribeSiteSettingsUseCase } from "../../../application/use-cases/settings/SubscribeSiteSettingsUseCase";
import type { SiteSettings } from "../../../domain/entities/admin/SiteSettings";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { useContainer } from "../../shared/useContainer";
import { DEFAULT_SITE_SETTINGS } from "./constants/siteConfig.constants";
import { SiteConfigContext, type SiteConfigContextValue } from "./siteConfigContext";

export interface SiteConfigProviderProps {
  readonly children: ReactNode;
}

export function SiteConfigProvider({ children }: SiteConfigProviderProps) {
  const subscribeUseCase = useContainer<ISubscribeSiteSettingsUseCase>(
    DI_TOKENS.SubscribeSiteSettings
  );

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeUseCase.execute(
      (freshSettings) => {
        setSiteSettings(freshSettings);
        setLoading(false);
      },
      (err) => {
        console.error("[SiteConfigProvider] Realtime sync error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [subscribeUseCase]);

  const contextValue: SiteConfigContextValue = useMemo(
    () => ({
      siteSettings,
      loading,
      error,
    }),
    [siteSettings, loading, error]
  );

  return <SiteConfigContext.Provider value={contextValue}>{children}</SiteConfigContext.Provider>;
}
