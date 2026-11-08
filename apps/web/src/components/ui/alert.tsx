"use client";

import React from "react";

export type AlertVariant = "info" | "success" | "warning" | "danger" | "neutral";

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<
  AlertVariant,
  { container: string; iconColor: string; titleColor: string; defaultIcon: string }
> = {
  info: {
    container: "bg-[#edf4ff] border-[#cce0ff] text-[#244577]",
    iconColor: "text-[#3c72e6]",
    titleColor: "text-[#1d3d6e]",
    defaultIcon: "ℹ",
  },
  success: {
    container: "bg-[#edfcf2] border-[#c2f2d1] text-[#1a5b32]",
    iconColor: "text-[#1da64a]",
    titleColor: "text-[#134926]",
    defaultIcon: "✓",
  },
  warning: {
    container: "bg-[#fffbeb] border-[#fde68a] text-[#85530d]",
    iconColor: "text-[#d97706]",
    titleColor: "text-[#714305]",
    defaultIcon: "⚠",
  },
  danger: {
    container: "bg-[#fef2f2] border-[#fecaca] text-[#991b1b]",
    iconColor: "text-[#dc2626]",
    titleColor: "text-[#7f1d1d]",
    defaultIcon: "✕",
  },
  neutral: {
    container: "bg-[#f8fafc] border-[#e2e8f0] text-[#475569]",
    iconColor: "text-[#64748b]",
    titleColor: "text-[#1e293b]",
    defaultIcon: "✳",
  },
};

export function Alert({
  variant = "info",
  title,
  children,
  icon,
  onClose,
  className = "",
}: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 p-4 rounded-xl border text-xs leading-relaxed transition-all ${styles.container} ${className}`}
    >
      <span
        className={`inline-flex shrink-0 w-5 h-5 items-center justify-center rounded-full font-bold text-xs select-none ${styles.iconColor}`}
        aria-hidden="true"
      >
        {icon ?? styles.defaultIcon}
      </span>
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-semibold text-xs mb-1 ${styles.titleColor}`}>
            {title}
          </h4>
        )}
        <div className="text-[12px] opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close alert"
          className="shrink-0 p-1 rounded hover:bg-black/5 opacity-60 hover:opacity-100 transition-opacity text-xs"
        >
          ✕
        </button>
      )}
    </div>
  );
}

