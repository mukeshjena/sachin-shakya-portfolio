// presentation/shared/menu/ThreeDotMenu.tsx
// Universal 3-dot overflow menu replacing cluttered per-row action buttons.
// Shadow-free instrument surface with hairline borders and zero emojis.
// All interaction logic lives in ThreeDotMenu.hooks.ts (Rule 13).

import { IoEllipsisVertical } from "react-icons/io5";
import { useThreeDotMenu } from "./ThreeDotMenu.hooks";
import type { ThreeDotMenuProps } from "./ThreeDotMenu.types";

export function ThreeDotMenu({
  actions,
  label = "Actions menu",
  align = "right",
  triggerClassName = "",
}: ThreeDotMenuProps) {
  const { isOpen, menuRef, triggerRef, toggle, handleKeyDown, handleActionClick } =
    useThreeDotMenu();

  return (
    <div className="relative inline-block text-left">
      {/* 3-Dot Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={`inline-flex items-center justify-center p-1.5 rounded-lg text-[var(--mist-dim)] hover:text-[var(--paper)] bg-transparent hover:bg-[var(--ink-700)] border border-transparent hover:border-[var(--line)] transition-colors cursor-pointer focus:outline-none focus:border-[var(--amber)] ${triggerClassName}`}
      >
        <IoEllipsisVertical className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* Overflow Dropdown Surface */}
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          aria-orientation="vertical"
          aria-label={label}
          className={`absolute z-50 mt-1 min-w-[170px] rounded-xl bg-[var(--ink-850)] border border-[var(--line)] py-1.5 focus:outline-none animate-fade-in ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.id}
                role="menuitem"
                type="button"
                disabled={action.disabled}
                onClick={() => handleActionClick(action)}
                className={`w-full text-left px-3.5 py-2 text-xs font-mono flex items-center gap-2.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  action.danger
                    ? "text-red-400 hover:text-red-300 hover:bg-red-950/30"
                    : "text-[var(--paper)] hover:text-[var(--paper)] hover:bg-[var(--ink-800)]"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      action.danger ? "text-red-400" : "text-[var(--mist-dim)]"
                    }`}
                    aria-hidden="true"
                  />
                )}
                <span className="truncate">{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
