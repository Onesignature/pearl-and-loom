"use client";

import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-sadu-saffron text-sadu-charcoal hover:bg-[color-mix(in_oklab,var(--sadu-saffron),white_8%)] active:translate-y-px shadow-[0_2px_0_rgba(42,37,34,0.18)]",
  secondary:
    "bg-sadu-indigo text-sadu-wool hover:bg-[color-mix(in_oklab,var(--sadu-indigo),black_8%)] active:translate-y-px",
  ghost:
    "bg-transparent text-foreground hover:bg-black/5 active:bg-black/10 border border-[var(--border-soft)]",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-full font-medium",
        "transition-[background-color,transform,box-shadow] duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sadu-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
});
