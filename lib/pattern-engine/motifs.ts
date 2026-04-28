import type { MotifId } from "./types";

// Sadu motif primitives, inspired by traditional Bedouin weaving:
//   al-mthalath  — pairs of opposing triangles
//   al-shajarah  — the tree, a stem with crossing branches
//   al-eyoun     — concentric diamonds (the "eyes")
//   al-mushat    — the comb, a horizontal bar with teeth
//   diamond      — simple rhombus filler
// All motifs are authored on a 100×100 viewBox and rendered as SVG paths
// stroked + filled by the consumer. Strokes use the cell's `color`.

export interface MotifSpec {
  id: MotifId;
  /** Display name (English) */
  name: string;
  /** Display name (Arabic, transliterated romanization in comment) */
  arName: string;
  /** Path 'd' commands. Multiple paths may be concatenated. */
  paths: readonly string[];
  /** Stroke width in viewBox units. */
  strokeWidth: number;
  /** Whether the path should be filled or just stroked. */
  filled: boolean;
}

export const MOTIFS: Record<MotifId, MotifSpec> = {
  mthalath: {
    id: "mthalath",
    name: "al-mthalath (triangles)",
    arName: "المثلث",
    paths: [
      "M 50 8 L 92 50 L 50 50 Z",
      "M 50 50 L 8 50 L 50 92 Z",
    ],
    strokeWidth: 2,
    filled: true,
  },
  shajarah: {
    id: "shajarah",
    name: "al-shajarah (tree)",
    arName: "الشجرة",
    paths: [
      "M 50 8 L 50 92",
      "M 22 22 L 78 22",
      "M 18 50 L 82 50",
      "M 22 78 L 78 78",
      "M 38 35 L 38 65",
      "M 62 35 L 62 65",
    ],
    strokeWidth: 4,
    filled: false,
  },
  eyoun: {
    id: "eyoun",
    name: "al-eyoun (eyes)",
    arName: "العيون",
    paths: [
      "M 50 6 L 94 50 L 50 94 L 6 50 Z",
      "M 50 26 L 74 50 L 50 74 L 26 50 Z",
      "M 50 44 L 56 50 L 50 56 L 44 50 Z",
    ],
    strokeWidth: 2,
    filled: false,
  },
  mushat: {
    id: "mushat",
    name: "al-mushat (comb)",
    arName: "المشط",
    paths: [
      "M 6 28 L 94 28 L 94 38 L 6 38 Z",
      "M 16 38 L 16 88",
      "M 32 38 L 32 88",
      "M 50 38 L 50 88",
      "M 68 38 L 68 88",
      "M 84 38 L 84 88",
    ],
    strokeWidth: 3,
    filled: true,
  },
  diamond: {
    id: "diamond",
    name: "diamond",
    arName: "المعين",
    paths: ["M 50 10 L 90 50 L 50 90 L 10 50 Z"],
    strokeWidth: 2,
    filled: true,
  },
  blank: {
    id: "blank",
    name: "blank",
    arName: "فراغ",
    paths: [],
    strokeWidth: 0,
    filled: false,
  },
};

export const ALL_MOTIFS: MotifId[] = ["mthalath", "shajarah", "eyoun", "mushat", "diamond"];
export const BORDER_MOTIFS: MotifId[] = ["mthalath", "diamond"];
export const FIELD_MOTIFS: MotifId[] = ["mthalath", "shajarah", "eyoun", "mushat", "diamond"];
