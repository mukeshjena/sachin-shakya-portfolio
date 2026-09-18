// presentation/theme/themeContext.ts
// Context definition for application-wide theme state.
// Universal Separation of Concerns: pure types and context instantiation only.

import { createContext, useContext } from "react";

export type Theme = "dark" | "light";

export interface ThemeContextValue {
  readonly theme: Theme;
  readonly toggleTheme: () => void;
  readonly setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Access the active theme context.
 *
 * @throws {Error} if invoked outside of a <ThemeProvider> tree.
 */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("[Theme] useThemeContext must be used within a <ThemeProvider>");
  }
  return context;
}
