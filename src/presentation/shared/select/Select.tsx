// presentation/shared/select/Select.tsx
// High-Prestige Searchable Combobox & Select Component (DIIRA reference implementation).
// Strictly shadow-free (Rule 2), emoji-free (Rule 3), hairline borders, modern rounded corners.

import type React from "react";
import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { IoCheckmarkOutline, IoChevronDownOutline } from "react-icons/io5";
import type { SelectOption, SelectProps } from "./Select.types";

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      children,
      containerClassName = "",
      className = "",
      id,
      name,
      disabled,
      required,
      allowCustom = true,
      customPlaceholder,
      placeholder,
      value = "",
      onChange,
      onCustomValueChange,
      onFocus,
      onBlur,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : generatedId);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const listboxRef = useRef<HTMLDivElement>(null);

    // Extract options from children if passed as standard <option> elements
    const parsedChildrenOptions = useMemo(() => {
      if (!children) return [];
      const opts: SelectOption[] = [];
      const iterateChildren = (nodes: React.ReactNode) => {
        if (!nodes) return;
        if (Array.isArray(nodes)) {
          for (const node of nodes) {
            iterateChildren(node);
          }
          return;
        }
        if (typeof nodes === "object" && "props" in nodes) {
          const element = nodes as React.ReactElement<{
            value?: string | number;
            children?: React.ReactNode;
            disabled?: boolean;
          }>;
          if (element.props) {
            const val = element.props.value !== undefined ? element.props.value : "";
            const lbl =
              typeof element.props.children === "string" ? element.props.children : String(val);
            opts.push({
              value: val,
              label: lbl,
              disabled: element.props.disabled,
            });
          }
        }
      };
      iterateChildren(children);
      return opts;
    }, [children]);

    const allOptions: readonly SelectOption[] = useMemo(() => {
      if (options && options.length > 0) return options;
      return parsedChildrenOptions;
    }, [options, parsedChildrenOptions]);

    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const [isTyping, setIsTyping] = useState(false);
    const [typedQuery, setTypedQuery] = useState("");

    // Find the currently selected option by value
    const selectedOption = useMemo(() => {
      const strVal = value !== undefined && value !== null ? String(value) : "";
      return allOptions.find((opt) => String(opt.value) === strVal);
    }, [allOptions, value]);

    // Computed display value for the input field
    const displayValue = useMemo(() => {
      if (isTyping) return typedQuery;
      if (selectedOption) return selectedOption.label;
      if (value !== undefined && value !== null && value !== "") return String(value);
      return "";
    }, [isTyping, typedQuery, selectedOption, value]);

    // Filter options in real time based on what the user typed
    const filteredOptions = useMemo(() => {
      if (!isTyping || !typedQuery.trim()) {
        return allOptions;
      }
      const lowerQuery = typedQuery.toLowerCase().trim();
      return allOptions.filter((opt) => {
        const matchLabel = opt.label.toLowerCase().includes(lowerQuery);
        const matchValue = String(opt.value).toLowerCase().includes(lowerQuery);
        return matchLabel || matchValue;
      });
    }, [allOptions, isTyping, typedQuery]);

    // Emit change event compatible with both standard HTML select and custom handlers
    const emitChange = useCallback(
      (newVal: string | number) => {
        const strVal = String(newVal);
        if (onCustomValueChange) {
          onCustomValueChange(strVal);
        }
        if (onChange) {
          const synthEvent = {
            target: {
              id: selectId,
              name: name || selectId,
              value: strVal,
            },
            currentTarget: {
              id: selectId,
              name: name || selectId,
              value: strVal,
            },
            preventDefault: () => {},
            stopPropagation: () => {},
          } as unknown as React.ChangeEvent<HTMLSelectElement>;
          onChange(synthEvent);
        }
      },
      [onChange, onCustomValueChange, selectId, name]
    );

    // Select an option from the list
    const handleSelectOption = useCallback(
      (opt: SelectOption) => {
        if (opt.disabled) return;
        setIsTyping(false);
        setTypedQuery("");
        setIsOpen(false);
        setHighlightedIndex(-1);
        emitChange(opt.value);
      },
      [emitChange]
    );

    // Handle typing in the text field
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setIsTyping(true);
      setTypedQuery(val);
      setIsOpen(true);
      setHighlightedIndex(0);

      // If allowCustom is enabled, immediately propagate the typed value
      if (allowCustom) {
        emitChange(val);
      }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handlePointerDownOutside = (e: MouseEvent | TouchEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setIsTyping(false);
          setHighlightedIndex(-1);

          // If allowCustom is false and user left an unselected query, revert display
          if (!allowCustom && isTyping) {
            if (selectedOption) {
              setTypedQuery("");
            } else {
              emitChange("");
            }
          }
        }
      };

      document.addEventListener("mousedown", handlePointerDownOutside);
      document.addEventListener("touchstart", handlePointerDownOutside);
      return () => {
        document.removeEventListener("mousedown", handlePointerDownOutside);
        document.removeEventListener("touchstart", handlePointerDownOutside);
      };
    }, [allowCustom, isTyping, selectedOption, emitChange]);

    // Handle Keyboard Navigation (ArrowUp, ArrowDown, Enter, Escape)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) onKeyDown(e);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(filteredOptions.length - 1);
        } else {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        }
      } else if (e.key === "Enter") {
        if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          e.preventDefault();
          handleSelectOption(filteredOptions[highlightedIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        setIsTyping(false);
      }
    };

    // Auto scroll highlighted item into view
    useEffect(() => {
      if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
        const item = listboxRef.current.children[highlightedIndex] as HTMLElement;
        if (item) {
          item.scrollIntoView({ block: "nearest" });
        }
      }
    }, [highlightedIndex, isOpen]);

    const activePlaceholder = placeholder || customPlaceholder || "Type or select an option...";

    return (
      <div
        ref={containerRef}
        className={`relative flex flex-col gap-1.5 w-full ${containerClassName}`}
      >
        {label && (
          <label
            htmlFor={selectId}
            className="text-[10px] font-mono uppercase tracking-widest text-[var(--mist-dim)] select-none cursor-pointer"
          >
            {label} {required && <span className="text-[var(--amber)]">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {/* Main Searchable Input */}
          <input
            ref={(el) => {
              inputRef.current = el;
              if (typeof ref === "function") ref(el);
              else if (ref) ref.current = el;
            }}
            id={selectId}
            name={name}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls={`${selectId}-listbox`}
            aria-invalid={Boolean(error)}
            autoComplete="off"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={(e) => {
              setIsOpen(true);
              setIsTyping(false);
              setTypedQuery("");
              if (onFocus) onFocus(e);
            }}
            onBlur={(e) => {
              if (onBlur) onBlur(e);
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            required={required}
            placeholder={activePlaceholder}
            className={`w-full bg-[var(--ink-800)] text-[var(--paper)] text-xs font-mono px-3.5 py-2.5 pr-10 rounded-xl border transition-colors cursor-text ${
              error
                ? "border-red-500/80 focus:border-red-400"
                : "border-[var(--line)] focus:border-[var(--amber)]"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
            {...props}
          />

          {/* Outlined Chevron Dropdown Trigger */}
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                setIsOpen((prev) => !prev);
                inputRef.current?.focus();
              }
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[var(--mist-dim)] hover:text-[var(--paper)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-0"
            aria-label="Toggle options dropdown"
          >
            <IoChevronDownOutline
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-[var(--amber)]" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Dropdown Options Menu */}
        {isOpen && (
          <div
            id={`${selectId}-listbox`}
            ref={listboxRef}
            role="listbox"
            className="absolute left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto rounded-xl bg-[var(--ink-850)] border border-[var(--line)] py-1.5 z-50 text-xs font-mono select-none"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const isSelected = String(opt.value) === String(value);
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    type="button"
                    key={String(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectOption(opt)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectOption(opt);
                      }
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full text-left flex items-center justify-between px-3.5 py-2 cursor-pointer transition-colors border-0 bg-transparent ${
                      isSelected
                        ? "bg-[var(--ink-700)] text-[var(--amber)] font-bold"
                        : isHighlighted
                          ? "bg-[var(--ink-800)] text-[var(--paper)]"
                          : "text-[var(--mist)] hover:bg-[var(--ink-800)] hover:text-[var(--paper)]"
                    } ${opt.disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <IoCheckmarkOutline className="w-4 h-4 text-[var(--amber)] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3.5 py-2.5 text-[var(--mist-dim)] text-center">
                {allowCustom ? (
                  <span>
                    Press <span className="text-[var(--amber)] font-semibold">Enter</span> to use
                    custom: &ldquo;{typedQuery}&rdquo;
                  </span>
                ) : (
                  <span>No matching options found</span>
                )}
              </div>
            )}
          </div>
        )}

        {error && <span className="text-[11px] font-mono text-red-400 mt-0.5">{error}</span>}
        {helperText && !error && (
          <span className="text-[10px] font-mono text-[var(--mist-dim)] mt-0.5">{helperText}</span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
