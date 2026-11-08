"use client";

import React, { forwardRef } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "subtle";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-white hover:bg-[var(--primary-deep)] border-transparent shadow-xs active:translate-y-px",
  secondary:
    "bg-[var(--sky)] text-[var(--primary-deep)] hover:bg-[#dbe7ff] border-transparent font-medium",
  outline:
    "bg-white text-[var(--ink)] border-[var(--line)] hover:bg-[#f8fafc] hover:border-[#ccd4e0]",
  ghost:
    "bg-transparent text-[var(--ink-soft)] hover:bg-[#edf2f9] border-transparent",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 border-transparent shadow-xs",
  subtle:
    "bg-[#f1f4f9] text-[var(--ink-soft)] hover:bg-[#e4ebf5] border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-[11px] rounded gap-1",
  sm: "h-8 px-3 text-xs rounded-md gap-1.5",
  md: "h-10 px-4 text-xs font-semibold rounded-lg gap-2",
  lg: "h-12 px-6 text-sm font-semibold rounded-lg gap-2.5",
  icon: "h-9 w-9 p-0 grid place-items-center rounded-lg text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-medium border transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${
          variantStyles[variant]
        } ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

