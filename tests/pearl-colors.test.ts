import { describe, it, expect } from "vitest";
import { PEARL_TIERS } from "@/lib/pearl/colors";
import type { PearlGrade } from "@/lib/store/progress";

const GRADES: PearlGrade[] = ["common", "fine", "royal"];

describe("PEARL_TIERS — single source of truth", () => {
  it("defines all three pearl grades", () => {
    for (const g of GRADES) {
      expect(PEARL_TIERS[g], g).toBeDefined();
    }
  });

  it("every tier has a valid CSS variable token matching its grade", () => {
    for (const g of GRADES) {
      expect(PEARL_TIERS[g].cssVar).toBe(`var(--pearl-${g})`);
    }
  });

  it("every tier defines well-formed hex colours", () => {
    const hex = /^#[0-9A-F]{6}$/i;
    for (const g of GRADES) {
      const t = PEARL_TIERS[g];
      expect(t.mid, `${g}.mid`).toMatch(hex);
      expect(t.core, `${g}.core`).toMatch(hex);
      expect(t.shadow, `${g}.shadow`).toMatch(hex);
    }
  });

  it("every tier has a well-formed rgba glow", () => {
    for (const g of GRADES) {
      expect(PEARL_TIERS[g].glow).toMatch(/^rgba\(/);
    }
  });

  it("every tier ships a CSS radial-gradient + a canvas exportPair", () => {
    for (const g of GRADES) {
      const t = PEARL_TIERS[g];
      expect(t.simpleGradient).toMatch(/^radial-gradient/);
      expect(t.exportPair).toHaveLength(2);
      expect(t.exportPair[0]).toMatch(/^#/);
      expect(t.exportPair[1]).toMatch(/^#/);
    }
  });

  it("only the royal tier draws a brass ring", () => {
    expect(PEARL_TIERS.common.ring).toBe(false);
    expect(PEARL_TIERS.fine.ring).toBe(false);
    expect(PEARL_TIERS.royal.ring).toBe(true);
  });

  it("glow size escalates strictly by tier (common < fine < royal)", () => {
    expect(PEARL_TIERS.common.glowSize).toBeLessThan(PEARL_TIERS.fine.glowSize);
    expect(PEARL_TIERS.fine.glowSize).toBeLessThan(PEARL_TIERS.royal.glowSize);
  });
});
