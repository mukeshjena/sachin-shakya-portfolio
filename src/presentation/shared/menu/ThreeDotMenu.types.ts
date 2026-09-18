// presentation/shared/menu/ThreeDotMenu.types.ts
// Type definitions for the universal 3-dot overflow contextual menu.

import type React from "react";

export interface MenuItemAction {
  readonly id: string;
  readonly label: string;
  readonly icon?: React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  readonly danger?: boolean;
  readonly disabled?: boolean;
  readonly onClick: () => void;
}

export interface ThreeDotMenuProps {
  readonly actions: readonly MenuItemAction[];
  readonly label?: string;
  readonly align?: "left" | "right";
  readonly triggerClassName?: string;
}

export interface ThreeDotMenuViewModel {
  readonly isOpen: boolean;
  readonly menuRef: React.RefObject<HTMLDivElement | null>;
  readonly triggerRef: React.RefObject<HTMLButtonElement | null>;
  readonly toggle: () => void;
  readonly close: () => void;
  readonly handleKeyDown: (e: React.KeyboardEvent) => void;
  readonly handleActionClick: (action: MenuItemAction) => void;
}
