// presentation/admin/shared/actions-menu/ActionsMenu.hooks.ts
// Hook managing open/close state and outside-click listeners for 3-dot menu.
// Rule 13: Universal Separation of Concerns.

import { useCallback, useEffect, useRef, useState } from "react";
import type { ActionMenuItem, ActionsMenuState } from "./ActionsMenu.types";

export function useActionsMenu(): ActionsMenuState {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleItemClick = useCallback(
    (item: ActionMenuItem) => {
      if (item.disabled) return;
      close();
      item.onClick();
    },
    [close]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  return {
    isOpen,
    menuRef,
    toggleOpen,
    close,
    handleItemClick,
  };
}
