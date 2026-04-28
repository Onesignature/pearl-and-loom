// Pattern engine — entry point.
//
// generatePattern(state) is a pure function: same TapestryState always
// produces the same Row[]. The op log is the source of truth; tapestry
// state on disk only persists ops + beads + seed. The visual tapestry
// is always derived.
//
// This is the technical centerpiece of "The Pearl and the Loom" —
// math concepts (symmetry, fractions, tessellation) translate to
// pattern-engine operations that produce woven rows.

import { borderRow, embedBeads, rowFromOp } from "./operations";
import type {
  PatternOp,
  PearlBead,
  Row,
  TapestryConfig,
  TapestryState,
} from "./types";

export const DEFAULT_WIDTH = 12;
export const DEFAULT_BORDER_ROWS = 2;

export function generatePattern(state: TapestryState, config?: TapestryConfig): Row[] {
  const width = config?.width ?? DEFAULT_WIDTH;
  const borderRows = config?.borderRows ?? DEFAULT_BORDER_ROWS;

  // Index pearls by id so bead ops can resolve their grade.
  const pearlsById = new Map<string, PearlBead>(
    state.beads.map((b) => [b.pearlId, b]),
  );

  const rows: Row[] = [];

  // Bottom border.
  for (let i = 0; i < borderRows; i++) {
    rows.push(borderRow(i, width, state.seed));
  }

  // Replay the op log in order. Bead ops decorate the most-recent row;
  // every other op produces a fresh row.
  for (const op of state.ops) {
    if (op.kind === "bead") {
      decorateMostRecentRowWithBead(rows, op, pearlsById);
      continue;
    }
    const rowIndex = rows.length;
    rows.push(rowFromOp(op, rowIndex, width, state.seed));
  }

  return rows;
}

function decorateMostRecentRowWithBead(
  rows: Row[],
  op: Extract<PatternOp, { kind: "bead" }>,
  pearlsById: Map<string, PearlBead>,
): void {
  const targetRowIndex = rows.length - 1;
  if (targetRowIndex < 0) return;
  const bead = pearlsById.get(op.pearlId);
  if (!bead) return;
  const target = rows[targetRowIndex];
  if (!target) return;
  rows[targetRowIndex] = embedBeads(target, [{ ...bead, column: op.column }]);
}

/** Number of rows in the tapestry for the given state + config. */
export function rowCount(state: TapestryState, config?: TapestryConfig): number {
  const borderRows = config?.borderRows ?? DEFAULT_BORDER_ROWS;
  const lessonOps = state.ops.filter((op) => op.kind !== "bead").length;
  return borderRows + lessonOps;
}

export type { Row, PatternOp, PearlBead, TapestryState, TapestryConfig } from "./types";
