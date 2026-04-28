export type NumeralMode = "western" | "arabic-indic" | "auto";
export type Lang = "en" | "ar";

const WESTERN_TO_INDIC: Record<string, string> = {
  "0": "٠",
  "1": "١",
  "2": "٢",
  "3": "٣",
  "4": "٤",
  "5": "٥",
  "6": "٦",
  "7": "٧",
  "8": "٨",
  "9": "٩",
};

export function toArabicIndic(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => WESTERN_TO_INDIC[d] ?? d);
}

export function resolveNumeralMode(
  mode: NumeralMode,
  lang: Lang,
): "western" | "arabic-indic" {
  if (mode === "auto") return lang === "ar" ? "arabic-indic" : "western";
  return mode;
}

export function fmtNumber(
  value: string | number,
  mode: NumeralMode,
  lang: Lang,
): string {
  const resolved = resolveNumeralMode(mode, lang);
  return resolved === "arabic-indic" ? toArabicIndic(value) : String(value);
}
