// presentation/theme/ThemeProvider.tsx
// Declarative Theme Context Provider wrapping the component tree.
// Universal Separation of Concerns: pure JSX and provider binding only.

import type { ReactNode } from "react";
import { ThemeContext } from "./themeContext";
import { useTheme } from "./useTheme";

export interface ThemeProviderProps {
  readonly children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeValue = useTheme();

  return <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>;
}
