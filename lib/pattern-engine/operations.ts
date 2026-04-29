import type {
  Cell,
  MotifCell,
  MotifId,
  PatternOp,
  PearlBead,
  Rotation,
  Row,
  SaduColor,
} from "./types";
import { BORDER_MOTIFS, FIELD_MOTIFS } from "./motifs";
import { FOREGROUND_COLORS } from "./palette";
import { pick, seededRng } from "./seedrandom";

/**
 * Apply a single PatternOp to produce a row of cells.
 * Pure function — same inputs always produce the same row.
 */
export function rowFromOp(op: PatternOp, rowIndex: number, width: number, seed: string): Row {
  const rng = seededRng(seed, `op:${op.kind}:${op.lessonId}:${rowIndex}`);

  switch (op.kind) {
    case "symmetry":
      return {
        index: rowIndex,
        band: "feature",
        op,
        cells: applySymmetry(op.axis, width, rng),
      };

    case "fraction":
      return {
        index: rowIndex,
        band: "feature",
        op,
        cells: applyFraction(op.numerator, op.denominator, width, rng),
      };

    case "tessellation":
      return {
        index: rowIndex,
        band: "feature",
        op,
        cells: applyTessellation(op.motif, op.tilesPerRow, width, rng),
      };

    case "arrays":
      return {
        index: rowIndex,
        band: "feature",
        op,
        cells: applyArrays(op.rows, op.cols, width, rng),
      };

    case "angles":
      return {
        index: rowIndex,
        band: "feature",
        op,
        cells: applyAngles(op.rotation, width, rng),
      };

    case "bead":
      // bead ops do not produce their own row — they decorate the next field row.
      // This branch should never be the "primary" producer of a row.
      return {
        index: rowIndex,
        band: "field",
        op,
        cells: fieldRow(width, rng),
      };
  }
}

// ----------------------------------------------------------------------
// Pure operations — math concepts → cell sequences
// ----------------------------------------------------------------------

export function applySymmetry(
  axis: "vertical" | "horizontal" | "diagonal",
  width: number,
  rng: () => number,
): Cell[] {
  const half = Math.ceil(width / 2);
  const motif = pick(rng, FIELD_MOTIFS);
  const color = pick(rng, FOREGROUND_COLORS);
  const halfCells: MotifCell[] = Array.from({ length: half }, (_, i) => ({
    kind: "motif",
    motif: i === half - 1 ? motif : pick(rng, FIELD_MOTIFS),
    color,
    rotation: 0,
  }));

  if (axis === "vertical") {
    // mirror around the vertical axis
    const mirrored = [...halfCells].reverse();
    return [...halfCells, ...mirrored.slice(width % 2 === 0 ? 0 : 1)];
  }

  if (axis === "diagonal") {
    // diagonal: rotate each cell by 90° on the back half
    const mirrored = [...halfCells].reverse().map<MotifCell>((c) => ({
      ...c,
      rotation: 90,
    }));
    return [...halfCells, ...mirrored.slice(width % 2 === 0 ? 0 : 1)];
  }

  // horizontal symmetry — every cell is its own mirror, all identical
  return Array.from({ length: width }, () => ({
    kind: "motif" as const,
    motif,
    color,
    rotation: 0,
  }));
}

export function applyFraction(
  numerator: number,
  denominator: number,
  width: number,
  rng: () => number,
): Cell[] {
  // Visualize numerator/denominator across `width` cells.
  // E.g. 3/8 with width=12 ⇒ 4.5 cells highlighted; we round and emphasize.
  const ratio = denominator === 0 ? 0 : numerator / denominator;
  const highlighted = Math.round(ratio * width);
  const motif = pick(rng, FIELD_MOTIFS);
  const fg = "madder" as SaduColor;
  const bg = pick(rng, FOREGROUND_COLORS.filter((c) => c !== fg));
  return Array.from({ length: width }, (_, i) => ({
    kind: "motif" as const,
    motif,
    color: i < highlighted ? fg : bg,
    rotation: 0,
    emphasized: i < highlighted,
  }));
}

export function applyTessellation(
  motif: MotifId,
  tilesPerRow: number,
  width: number,
  rng: () => number,
): Cell[] {
  const color = pick(rng, FOREGROUND_COLORS);
  const cellsPerTile = Math.max(1, Math.floor(width / Math.max(1, tilesPerRow)));
  return Array.from({ length: width }, (_, i) => {
    const tileSlot = Math.floor(i / cellsPerTile);
    const rotation: Rotation = (tileSlot % 2 === 0 ? 0 : 60) as Rotation;
    return {
      kind: "motif" as const,
      motif,
      color,
      rotation,
    };
  });
}

export function applyArrays(rows: number, cols: number, width: number, rng: () => number): Cell[] {
  const motif = pick(rng, FIELD_MOTIFS);
  const color = pick(rng, FOREGROUND_COLORS);
  const filled = rows * cols;
  return Array.from({ length: width }, (_, i) => ({
    kind: "motif" as const,
    motif: i < filled ? motif : "blank",
    color,
    rotation: 0,
  }));
}

export function applyAngles(rotation: Rotation, width: number, rng: () => number): Cell[] {
  const motif: MotifId = "mthalath";
  const color = pick(rng, FOREGROUND_COLORS);
  return Array.from({ length: width }, () => ({
    kind: "motif" as const,
    motif,
    color,
    rotation,
  }));
}

// ----------------------------------------------------------------------
// Baseline rows (border + filler "field" rows for visual density)
// ----------------------------------------------------------------------

export function borderRow(rowIndex: number, width: number, seed: string): Row {
  const rng = seededRng(seed, `border:${rowIndex}`);
  const motif = pick(rng, BORDER_MOTIFS);
  const color = pick(rng, FOREGROUND_COLORS);
  return {
    index: rowIndex,
    band: "border",
    op: null,
    cells: Array.from({ length: width }, () => ({
      kind: "motif" as const,
      motif,
      color,
      rotation: 0,
    })),
  };
}

export function fieldRow(width: number, rng: () => number): Cell[] {
  const motif = pick(rng, FIELD_MOTIFS);
  const color = pick(rng, FOREGROUND_COLORS);
  return Array.from({ length: width }, () => ({
    kind: "motif" as const,
    motif,
    color,
    rotation: 0,
  }));
}

// ----------------------------------------------------------------------
// Bead embedding
// ----------------------------------------------------------------------

export function embedBeads(row: Row, beads: PearlBead[]): Row {
  if (beads.length === 0) return row;
  const cells = [...row.cells];
  for (const bead of beads) {
    if (bead.column < 0 || bead.column >= cells.length) continue;
    cells[bead.column] = {
      kind: "bead",
      grade: bead.grade,
      pearlId: bead.pearlId,
    };
  }
  return { ...row, cells };
}

