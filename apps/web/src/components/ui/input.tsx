"use client";

import React, { forwardRef } from "react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  sizeVariant?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      className = "",
      id,
      sizeVariant = "md",
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const sizeClasses = {
      sm: "h-8 px-2.5 text-xs",
      md: "h-10 px-3.5 text-xs",
      lg: "h-12 px-4 text-sm",
    }[sizeVariant];

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-semibold text-[var(--ink-soft)] tracking-wider uppercase font-mono"
          >
            {label}
          </label>
        )}
        <div
          className={`relative flex items-center w-full rounded-lg border bg-white transition-all duration-150 ${
            error
              ? "border-rose-400 ring-2 ring-rose-100"
              : "border-[var(--line)] focus-within:border-[var(--primary)] focus-within:ring-3 focus-within:ring-[#548cff25]"
          } ${disabled ? "opacity-60 bg-gray-50 cursor-not-allowed" : ""}`}
        >
          {leftElement && (
            <div className="pl-3.5 pr-1 text-gray-400 flex items-center pointer-events-none select-none text-sm">
              {leftElement}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full bg-transparent text-[var(--ink)] placeholder:text-[#9aa3b0] focus:outline-none disabled:cursor-not-allowed ${sizeClasses} ${
              leftElement ? "pl-2" : ""
            } ${rightElement ? "pr-2" : ""} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="pr-2.5 flex items-center">{rightElement}</div>
          )}
        </div>
        {error ? (
          <p className="text-[11px] text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[var(--muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

