// Pattern engine — types
// The Sadu tapestry is described entirely by an op log + seed; everything
// else is derived. Tests in tests/pattern-engine.test.ts pin this down.

export type MotifId =
  | "mthalath" // triangles — al-mthalath
  | "shajarah" // tree — al-shajarah
  | "eyoun" // eyes — al-eyoun
  | "mushat" // comb — al-mushat
  | "diamond"
  | "blank";

export type SaduColor = "indigo" | "madder" | "saffron" | "charcoal" | "wool";

export type Rotation = 0 | 60 | 90 | 120 | 180 | 270;

export type PearlGrade = "common" | "fine" | "royal";

export interface MotifCell {
  kind: "motif";
  motif: MotifId;
  color: SaduColor;
  rotation: Rotation;
  /** When this cell is the "highlight" of a fraction operation, render it bolder. */
  emphasized?: boolean;
}

export interface BeadCell {
  kind: "bead";
  grade: PearlGrade;
  pearlId: string;
}

export type Cell = MotifCell | BeadCell;

export type RowBand = "border" | "field" | "feature";

export interface Row {
  index: number; // 0 = bottom (oldest), grows upward
  cells: Cell[];
  band: RowBand;
  /** The op responsible for this row (null = baseline/border row). */
  op: PatternOp | null;
}

// ---- Op log ----

export type PatternOp =
  | {
      kind: "symmetry";
      axis: "vertical" | "horizontal" | "diagonal";
      lessonId: string;
    }
  | {
      kind: "fraction";
      numerator: number;
      denominator: number;
      lessonId: string;
    }
  | {
      kind: "tessellation";
      motif: MotifId;
      tilesPerRow: number;
      lessonId: string;
    }
  | {
      kind: "arrays";
      rows: number;
      cols: number;
      lessonId: string;
    }
  | {
      kind: "angles";
      rotation: Rotation;
      lessonId: string;
    }
  | {
      kind: "bead";
      pearlId: string;
      column: number;
      lessonId: string;
    };

export interface PearlBead {
  pearlId: string;
  column: number;
  grade: PearlGrade;
}

export interface TapestryState {
  seed: string;
  ops: PatternOp[];
  beads: PearlBead[];
}

export interface TapestryConfig {
  /** Width of the tapestry in cells. Default 12. */
  width?: number;
  /** Number of border rows at the bottom. Default 2. */
  borderRows?: number;
}
