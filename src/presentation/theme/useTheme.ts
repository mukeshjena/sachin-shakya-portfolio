// presentation/theme/useTheme.ts
// Custom hook managing theme state, localStorage persistence, and DOM attribute synchronization.

import { useCallback, useEffect, useState } from "react";
import type { Theme, ThemeContextValue } from "./themeContext";

const THEME_STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // LocalStorage unavailable (e.g. strict security mode)
  }

  return "light";
}

export function useTheme(): ThemeContextValue {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const applyTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", nextTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch {
        // Storage fail-safe
      }
    }
  }, []);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      applyTheme(newTheme);
    },
    [applyTheme]
  );

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme, applyTheme]);

  // Synchronize on mount and handle system preference changes if unset
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
          applyTheme(e.matches ? "light" : "dark");
        }
      } catch {
        // Ignore storage error
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [theme, applyTheme]);

  return { theme, toggleTheme, setTheme };
}
