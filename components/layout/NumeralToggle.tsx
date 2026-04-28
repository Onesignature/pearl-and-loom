"use client";

import { useI18n } from "@/lib/i18n/provider";
import type { NumeralMode } from "@/lib/i18n/numerals";

const MODES: { value: NumeralMode; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "western", label: "1234567890" },
  { value: "arabic-indic", label: "١٢٣٤٥٦٧٨٩٠" },
];

export function NumeralToggle() {
  const { numeralMode, setNumeralMode } = useI18n();
  return (
    <div
      className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-surface-elevated p-1 text-sm"
      role="group"
      aria-label="Numeral system"
    >
      {MODES.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => setNumeralMode(m.value)}
          aria-pressed={numeralMode === m.value}
          className={[
            "px-3 py-1 rounded-full transition-colors",
            numeralMode === m.value
              ? "bg-sadu-charcoal text-sadu-wool"
              : "text-sadu-charcoal/70 hover:text-sadu-charcoal",
          ].join(" ")}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
