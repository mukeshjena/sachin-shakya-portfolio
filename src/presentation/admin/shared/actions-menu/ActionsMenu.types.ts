// presentation/admin/shared/actions-menu/ActionsMenu.types.ts
// Contract types for the reusable 3-dot action dropdown menu.
// Rule 13: Universal Separation of Concerns.

import type { ComponentType, RefObject } from "react";

export interface ActionMenuItem {
  readonly id: string;
  readonly label: string;
  readonly icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  readonly isDestructive?: boolean;
  readonly disabled?: boolean;
  readonly onClick: () => void | Promise<void>;
}

export interface ActionsMenuProps {
  readonly items: readonly ActionMenuItem[];
  readonly align?: "left" | "right";
  readonly ariaLabel?: string;
  readonly triggerClassName?: string;
}

export interface ActionsMenuState {
  readonly isOpen: boolean;
  readonly menuRef: RefObject<HTMLDivElement | null>;
  readonly toggleOpen: () => void;
  readonly close: () => void;
  readonly handleItemClick: (item: ActionMenuItem) => void;
}
