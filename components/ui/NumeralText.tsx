"use client";

import { useI18n } from "@/lib/i18n/provider";

interface NumeralTextProps {
  n: string | number;
  className?: string;
}

/**
 * Renders a number formatted to the active numeral mode (Western or Arabic-Indic).
 * Use this anywhere you'd otherwise hardcode a number that should localize.
 */
export function NumeralText({ n, className }: NumeralTextProps) {
  const { fmt } = useI18n();
  return <span className={className}>{fmt(n)}</span>;
}
