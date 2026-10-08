"use client";

import React, { useEffect, useRef, useState } from "react";

/** Reusable searchable select. `options` must contain `{ name, value }` objects. */
export const SearchableSelect = ({
  id,
  name,
  value,
  options = [],
  onChange,
  onBlur,
  placeholder = "Search or select an option",
  disabled = false,
  error = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);
  const displayedValue = isOpen ? query : selectedOption?.name || "";
  const filteredOptions = options.filter(({ name: optionName }) =>
    optionName.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  );

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className="relative mt-1">
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={`${id}-options`}
        aria-invalid={Boolean(error)}
        value={displayedValue}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => {
          if (disabled) return;
          setQuery("");
          setIsOpen(true);
        }}
        onClick={() => {
          if (!disabled) setIsOpen(true);
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
          // Clear the old selection while the user is searching, so typed text
          // cannot accidentally be submitted as an unselected option.
          if (value) onChange("");
        }}
        onBlur={() => {
          onBlur?.();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
            setQuery("");
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            setIsOpen(true);
          } else if (event.key === "Enter" && isOpen && filteredOptions.length) {
            event.preventDefault();
            handleSelect(filteredOptions[0]);
          }
        }}
        className={`w-full border rounded px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:text-gray-500 ${error ? "border-red-500" : "border-gray-300"}`}
      />
      <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
        {isOpen ? "⌃" : "⌄"}
      </span>

      {isOpen && !disabled && (
        <ul
          id={`${id}-options`}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
          {filteredOptions.length ? (
            filteredOptions.map((option) => (
              <li key={`${option.value}`} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(option)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${option.value === value ? "bg-gray-100 font-medium" : ""}`}
                >
                  {option.name}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-500">No matches found</li>
          )}
        </ul>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
