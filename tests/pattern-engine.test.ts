import { describe, it, expect } from "vitest";
import { generatePattern, rowCount, DEFAULT_WIDTH } from "@/lib/pattern-engine";
import {
  applyArrays,
  applyFraction,
  applySymmetry,
  applyTessellation,
  embedBeads,
} from "@/lib/pattern-engine/operations";
import { hashSeed, mulberry32, pick, pickInt, seededRng } from "@/lib/pattern-engine/seedrandom";
import type {
  PatternOp,
  PearlBead,
  Row,
  TapestryState,
} from "@/lib/pattern-engine/types";

const SYMMETRY_OP: PatternOp = { kind: "symmetry", axis: "vertical", lessonId: "L1" };
const FRACTION_OP: PatternOp = {
  kind: "fraction",
  numerator: 3,
  denominator: 8,
  lessonId: "L2",
};
const TESS_OP: PatternOp = {
  kind: "tessellation",
  motif: "mthalath",
  tilesPerRow: 3,
  lessonId: "L3",
};

const baseState = (overrides: Partial<TapestryState> = {}): TapestryState => ({
  seed: "test-seed-001",
  ops: [],
  beads: [],
  ...overrides,
});

// ----------------------------------------------------------------------
// PRNG
// ----------------------------------------------------------------------

describe("seedrandom", () => {
  it("hashSeed is deterministic", () => {
    expect(hashSeed("abc")).toBe(hashSeed("abc"));
    expect(hashSeed("abc")).not.toBe(hashSeed("abd"));
  });

  it("mulberry32 produces a deterministic sequence", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 10; i++) {
      expect(a()).toBe(b());
    }
  });

  it("seededRng with same seed/salt is deterministic", () => {
    const a = seededRng("seed", "row:0");
    const b = seededRng("seed", "row:0");
    expect(a()).toBe(b());
  });

  it("seededRng with different salt diverges", () => {
    const a = seededRng("seed", "row:0");
    const b = seededRng("seed", "row:1");
    expect(a()).not.toBe(b());
  });

  it("pick returns a value from the array", () => {
    const arr = ["a", "b", "c", "d"] as const;
    const rng = mulberry32(1);
    expect(arr).toContain(pick(rng, arr));
  });

  it("pickInt returns within bounds inclusive", () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 50; i++) {
      const n = pickInt(rng, 5, 10);
      expect(n).toBeGreaterThanOrEqual(5);
      expect(n).toBeLessThanOrEqual(10);
    }
  });
});

// ----------------------------------------------------------------------
// Pure operations
// ----------------------------------------------------------------------

describe("applySymmetry", () => {
  it("vertical symmetry produces a palindromic row", () => {
    const rng = seededRng("s", "0");
    const cells = applySymmetry("vertical", DEFAULT_WIDTH, rng);
    expect(cells).toHaveLength(DEFAULT_WIDTH);
    // Each cell at i should mirror cell at (width-1-i) on motif/color.
    for (let i = 0; i < Math.floor(DEFAULT_WIDTH / 2); i++) {
      const a = cells[i]!;
      const b = cells[DEFAULT_WIDTH - 1 - i]!;
      if (a.kind === "motif" && b.kind === "motif") {
        expect(b.color).toBe(a.color);
      }
    }
  });

  it("horizontal symmetry yields all cells with the same motif/color", () => {
    const rng = seededRng("s", "h");
    const cells = applySymmetry("horizontal", DEFAULT_WIDTH, rng);
    const first = cells[0];
    if (first?.kind !== "motif") throw new Error("expected motif cell");
    for (const c of cells) {
      expect(c.kind).toBe("motif");
      if (c.kind === "motif") {
        expect(c.motif).toBe(first.motif);
        expect(c.color).toBe(first.color);
      }
    }
  });
});

describe("applyFraction", () => {
  it("emphasizes ⌊numerator/denominator * width⌉ cells", () => {
    const rng = seededRng("s", "frac");
    const cells = applyFraction(3, 8, 16, rng);
    const emphasized = cells.filter(
      (c) => c.kind === "motif" && c.emphasized,
    ).length;
    // 3/8 of 16 = 6 exactly
    expect(emphasized).toBe(6);
  });

  it("handles denominator 0 gracefully (no highlight, no crash)", () => {
    const rng = seededRng("s", "frac0");
    const cells = applyFraction(3, 0, 12, rng);
    expect(cells).toHaveLength(12);
    expect(
      cells.every((c) => c.kind === "motif" && !c.emphasized),
    ).toBe(true);
  });

  it("3/8 and 6/16 emphasize the same number of cells (equivalence)", () => {
    const rngA = seededRng("equiv", "a");
    const rngB = seededRng("equiv", "b");
    const cellsA = applyFraction(3, 8, 24, rngA);
    const cellsB = applyFraction(6, 16, 24, rngB);
    const countA = cellsA.filter((c) => c.kind === "motif" && c.emphasized).length;
    const countB = cellsB.filter((c) => c.kind === "motif" && c.emphasized).length;
    expect(countA).toBe(countB);
    expect(countA).toBe(9); // 3/8 of 24 = 9
  });
});

describe("applyTessellation", () => {
  it("uses the chosen motif for every cell", () => {
    const rng = seededRng("t", "0");
    const cells = applyTessellation("eyoun", 3, 12, rng);
    expect(cells).toHaveLength(12);
    for (const c of cells) {
      expect(c.kind).toBe("motif");
      if (c.kind === "motif") expect(c.motif).toBe("eyoun");
    }
  });

  it("alternates rotation between adjacent tiles", () => {
    const rng = seededRng("t", "1");
    const cells = applyTessellation("mthalath", 4, 12, rng);
    // tile 0 (cols 0-2) rot 0, tile 1 (cols 3-5) rot 60, tile 2 rot 0, tile 3 rot 60
    const rotations = cells
      .map((c) => (c.kind === "motif" ? c.rotation : -1));
    expect(new Set(rotations).size).toBeGreaterThan(1);
  });
});

describe("applyArrays", () => {
  it("fills exactly rows*cols cells with the motif, rest blank", () => {
    const rng = seededRng("a", "0");
    const cells = applyArrays(2, 3, 12, rng); // 6 filled, 6 blank
    const filled = cells.filter(
      (c) => c.kind === "motif" && c.motif !== "blank",
    ).length;
    expect(filled).toBe(6);
  });
});

// ----------------------------------------------------------------------
// embedBeads
// ----------------------------------------------------------------------

describe("embedBeads", () => {
  it("replaces target columns with bead cells, preserves others", () => {
    const baseRow: Row = {
      index: 5,
      band: "field",
      op: null,
      cells: Array.from({ length: 12 }, () => ({
        kind: "motif" as const,
        motif: "mthalath",
        color: "indigo",
        rotation: 0,
      })),
    };
    const beads: PearlBead[] = [
      { pearlId: "p1", column: 3, grade: "royal" },
      { pearlId: "p2", column: 7, grade: "common" },
    ];
    const out = embedBeads(baseRow, beads);
    expect(out.cells[3]).toMatchObject({ kind: "bead", grade: "royal", pearlId: "p1" });
    expect(out.cells[7]).toMatchObject({ kind: "bead", grade: "common", pearlId: "p2" });
    expect(out.cells[0]).toMatchObject({ kind: "motif" });
    expect(out.cells.length).toBe(12);
  });

  it("ignores beads with out-of-range columns", () => {
    const baseRow: Row = {
      index: 0,
      band: "field",
      op: null,
      cells: Array.from({ length: 4 }, () => ({
        kind: "motif" as const,
        motif: "diamond",
        color: "saffron",
        rotation: 0,
      })),
    };
    const out = embedBeads(baseRow, [
      { pearlId: "x", column: -1, grade: "fine" },
      { pearlId: "y", column: 4, grade: "fine" },
      { pearlId: "z", column: 99, grade: "fine" },
    ]);
    expect(out.cells.every((c) => c.kind === "motif")).toBe(true);
  });
});

// ----------------------------------------------------------------------
// generatePattern (the integration of the whole engine)
// ----------------------------------------------------------------------

describe("generatePattern", () => {
  it("with no ops, returns just the bottom border rows", () => {
    const rows = generatePattern(baseState());
    expect(rows).toHaveLength(2); // DEFAULT_BORDER_ROWS
    for (const row of rows) {
      expect(row.band).toBe("border");
      expect(row.op).toBeNull();
      expect(row.cells).toHaveLength(DEFAULT_WIDTH);
    }
  });

  it("each lesson op appends one feature row above the border", () => {
    const rows = generatePattern(
      baseState({ ops: [SYMMETRY_OP, FRACTION_OP, TESS_OP] }),
    );
    expect(rows).toHaveLength(2 + 3);
    expect(rows[0]?.band).toBe("border");
    expect(rows[1]?.band).toBe("border");
    expect(rows[2]?.band).toBe("feature");
    expect(rows[2]?.op?.kind).toBe("symmetry");
    expect(rows[3]?.op?.kind).toBe("fraction");
    expect(rows[4]?.op?.kind).toBe("tessellation");
  });

  it("is fully deterministic from seed + ops", () => {
    const a = generatePattern(
      baseState({ ops: [SYMMETRY_OP, FRACTION_OP, TESS_OP] }),
    );
    const b = generatePattern(
      baseState({ ops: [SYMMETRY_OP, FRACTION_OP, TESS_OP] }),
    );
    expect(a).toEqual(b);
  });

  it("different seeds produce different tapestries (nondegenerate)", () => {
    const a = generatePattern(
      baseState({ seed: "alpha", ops: [SYMMETRY_OP, FRACTION_OP, TESS_OP] }),
    );
    const b = generatePattern(
      baseState({ seed: "beta", ops: [SYMMETRY_OP, FRACTION_OP, TESS_OP] }),
    );
    expect(a).not.toEqual(b);
  });

  it("bead ops decorate the most recent feature row, not produce their own", () => {
    const beadOp: PatternOp = {
      kind: "bead",
      pearlId: "pearl-A",
      column: 5,
      lessonId: "D1",
    };
    const rows = generatePattern(
      baseState({
        ops: [SYMMETRY_OP, beadOp, FRACTION_OP],
        beads: [{ pearlId: "pearl-A", column: 5, grade: "royal" }],
      }),
    );
    // Border (2) + symmetry (1) + fraction (1) — bead does NOT add a row
    expect(rows).toHaveLength(4);
    const symmetryRow = rows[2]!;
    expect(symmetryRow.cells[5]).toMatchObject({ kind: "bead", grade: "royal" });
  });

  it("rowCount matches generated row count", () => {
    const state = baseState({ ops: [SYMMETRY_OP, FRACTION_OP, TESS_OP] });
    expect(rowCount(state)).toBe(generatePattern(state).length);
  });

  it("respects custom width and borderRows", () => {
    const rows = generatePattern(baseState(), { width: 16, borderRows: 1 });
    expect(rows).toHaveLength(1);
    expect(rows[0]!.cells).toHaveLength(16);
  });
});
