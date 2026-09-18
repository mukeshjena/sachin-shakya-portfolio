// presentation/theme/toggle/ThemeToggle.hooks.ts
// Component hook for ThemeToggle — manages toggle events and accessible labels.

import { useCallback } from "react";
import { useThemeContext } from "../themeContext";

export interface UseThemeToggleResult {
  readonly isDark: boolean;
  readonly ariaLabel: string;
  readonly handleToggle: () => void;
}

export function useThemeToggle(): UseThemeToggleResult {
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === "dark";

  const handleToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const ariaLabel = isDark ? "Switch to accessible light theme" : "Switch to executive dark theme";

  return {
    isDark,
    ariaLabel,
    handleToggle,
  };
}
