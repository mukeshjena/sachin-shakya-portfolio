// presentation/shared/menu/ThreeDotMenu.hooks.ts
// Hook managing open/close state, click-outside listener, and keyboard accessibility for ThreeDotMenu.

import { useCallback, useEffect, useRef, useState } from "react";
import type { MenuItemAction, ThreeDotMenuViewModel } from "./ThreeDotMenu.types";

export function useThreeDotMenu(): ThreeDotMenuViewModel {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleActionClick = useCallback(
    (action: MenuItemAction) => {
      if (action.disabled) return;
      close();
      action.onClick();
    },
    [close]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    },
    [close]
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, close]);

  return {
    isOpen,
    menuRef,
    triggerRef,
    toggle,
    close,
    handleKeyDown,
    handleActionClick,
  };
}
