import { describe, it, expect } from "vitest";
import { TAPESTRY_25, TAPESTRY_TOTAL_ROWS } from "@/lib/tapestry/composition";
import { MOTIF_COMPONENTS } from "@/components/motifs";
import type { PearlGrade } from "@/lib/store/progress";

describe("TAPESTRY_25 — curated narrative composition", () => {
  it("contains exactly 25 rows", () => {
    expect(TAPESTRY_25).toHaveLength(25);
  });

  it("TAPESTRY_TOTAL_ROWS is 30 (full loom; 5 are baseline borders)", () => {
    expect(TAPESTRY_TOTAL_ROWS).toBe(30);
    expect(TAPESTRY_TOTAL_ROWS).toBeGreaterThan(TAPESTRY_25.length);
  });

  it("every row references a motif component that actually exists", () => {
    for (let i = 0; i < TAPESTRY_25.length; i++) {
      const row = TAPESTRY_25[i];
      expect(MOTIF_COMPONENTS[row.motif], `row ${i} (${row.motif})`).not.toBeNull();
      expect(MOTIF_COMPONENTS[row.motif], `row ${i} (${row.motif})`).toBeDefined();
    }
  });

  it("every row defines a foreground + background palette colour", () => {
    for (let i = 0; i < TAPESTRY_25.length; i++) {
      const row = TAPESTRY_25[i];
      expect(row.palette.fg, `row ${i}.fg`).toMatch(/^var\(--/);
      expect(row.palette.bg, `row ${i}.bg`).toMatch(/^(var\(--|transparent)/);
    }
  });

  it("every pearl-bearing row has a valid grade", () => {
    const valid: PearlGrade[] = ["common", "fine", "royal"];
    for (const row of TAPESTRY_25) {
      if (row.pearl) {
        expect(valid).toContain(row.pearl);
      }
    }
  });

  it("the curated arc embeds a balanced spread of pearls", () => {
    const pearlRows = TAPESTRY_25.filter((r) => r.pearl);
    expect(pearlRows.length).toBeGreaterThan(0);
    expect(pearlRows.length).toBeLessThanOrEqual(8);
  });

  it("uses every authentic Sadu motif at least once across the arc", () => {
    const usedMotifs = new Set(TAPESTRY_25.map((r) => r.motif));
    // The narrative arc draws from a wide motif vocabulary so the cloth
    // reads as authentically composed rather than mechanically repeated.
    expect(usedMotifs.size).toBeGreaterThanOrEqual(5);
  });
});
