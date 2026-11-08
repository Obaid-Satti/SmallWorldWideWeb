import React from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "outline"
  | "mono";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  hasDot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[#f1f5f9] text-[#475569] border-transparent",
  primary: "bg-[#eaf1ff] text-[#2c65db] border-transparent",
  success: "bg-[#e8f8ee] text-[#1c8141] border-transparent",
  warning: "bg-[#fff7e6] text-[#b45309] border-transparent",
  danger: "bg-[#fee8e8] text-[#c53030] border-transparent",
  outline: "bg-white text-[var(--ink-soft)] border-[var(--line)]",
  mono: "bg-[#f8fafc] text-[#334155] border-[#e2e8f0] font-mono",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-gray-400",
  primary: "bg-[#3c72e6]",
  success: "bg-[#1da64a]",
  warning: "bg-[#d97706]",
  danger: "bg-[#dc2626]",
  outline: "bg-gray-400",
  mono: "bg-slate-500",
};

export function Badge({
  children,
  variant = "default",
  hasDot = false,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border tracking-wide select-none ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {hasDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

