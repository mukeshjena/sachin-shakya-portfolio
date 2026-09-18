// presentation/admin/shared/actions-menu/ActionsMenu.tsx
// Reusable 3-dot actions dropdown menu component.
// Flat instrument panel design with zero shadows and zero emojis.
// Rule 13: Universal Separation of Concerns.

import type React from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { useActionsMenu } from "./ActionsMenu.hooks";
import type { ActionsMenuProps } from "./ActionsMenu.types";

export const ActionsMenu: React.FC<ActionsMenuProps> = ({
  items,
  align = "right",
  ariaLabel = "More options",
  triggerClassName,
}) => {
  const { isOpen, menuRef, toggleOpen, handleItemClick } = useActionsMenu();

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={ariaLabel}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={
          triggerClassName ||
          "p-1.5 rounded-lg text-[var(--mist-dim)] hover:text-[var(--paper)] hover:bg-[var(--ink-700)] border border-transparent hover:border-[var(--line)] transition-colors cursor-pointer"
        }
      >
        <IoEllipsisVertical className="w-4 h-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`absolute z-30 mt-1 w-44 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] p-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer text-left ${
                  item.disabled
                    ? "opacity-40 cursor-not-allowed text-[var(--mist-dim)]"
                    : item.isDestructive
                      ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      : "text-[var(--paper)] hover:bg-[var(--ink-700)] hover:text-[var(--amber)]"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
