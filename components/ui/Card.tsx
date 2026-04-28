import type { HTMLAttributes } from "react";

type Tone = "parchment" | "tent" | "sea" | "elevated";

const toneStyles: Record<Tone, string> = {
  parchment:
    "bg-[#FAF3E2] text-sadu-charcoal border border-[var(--border-soft)] shadow-[0_1px_0_rgba(42,37,34,0.06),0_8px_24px_-12px_rgba(42,37,34,0.16)]",
  tent: "bg-sadu-wool text-sadu-charcoal border border-sadu-charcoal/15",
  sea: "bg-sea-foam text-[#0A2530] border border-[#0A2530]/10",
  elevated:
    "bg-surface-elevated text-foreground shadow-[0_4px_24px_-8px_rgba(42,37,34,0.18)] border border-[var(--border-soft)]",
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
}

export function Card({ tone = "parchment", className = "", children, ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl",
        toneStyles[tone],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
