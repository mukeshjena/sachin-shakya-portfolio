// presentation/shell/layout/AppLayout.types.ts
// Contract and props for the master AppLayout chrome wrapper.

import type { ReactNode } from "react";

export interface AppLayoutProps {
  readonly children: ReactNode;
  readonly hidePublicChrome?: boolean;
}
