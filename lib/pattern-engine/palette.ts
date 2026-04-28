import type { SaduColor } from "./types";

// Hex values match CSS variables in app/globals.css.
export const SADU_COLORS: Record<SaduColor, string> = {
  indigo: "#1B2D5C",
  madder: "#B5341E",
  saffron: "#E8A33D",
  charcoal: "#2A2522",
  wool: "#F0E4C9",
};

export const FOREGROUND_COLORS: SaduColor[] = ["indigo", "madder", "saffron", "charcoal"];
export const BACKGROUND_COLOR: SaduColor = "wool";

export function colorHex(c: SaduColor): string {
  return SADU_COLORS[c];
}
