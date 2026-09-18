// presentation/theme/toggle/ThemeToggle.tsx
// Pure declarative Cupertino outline theme toggle button.
// Universal Separation of Concerns: pure JSX markup, zero emojis, zero shadows.

import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useThemeToggle } from "./ThemeToggle.hooks";
import "./ThemeToggle.css";

export function ThemeToggle() {
  const { isDark, ariaLabel, handleToggle } = useThemeToggle();

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="theme-toggle-btn"
    >
      {isDark ? (
        <IoSunnyOutline className="theme-toggle-icon" aria-hidden="true" />
      ) : (
        <IoMoonOutline className="theme-toggle-icon" aria-hidden="true" />
      )}
    </button>
  );
}
