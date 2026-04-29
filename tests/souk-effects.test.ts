import { describe, it, expect } from "vitest";
import { deriveSoukEffects } from "@/lib/souk/effects";

describe("deriveSoukEffects", () => {
  it("returns identity defaults for an empty inventory", () => {
    const e = deriveSoukEffects([]);
    expect(e.extraBreath).toBe(0);
    expect(e.breathDrainMultiplier).toBe(1);
    expect(e.descentMultiplier).toBe(1);
    expect(e.bonusCommonPearlsPerDive).toBe(0);
    expect(e.dawnSky).toBe(false);
    expect(e.brassLantern).toBe(false);
    expect(e.framedPhoto).toBe(false);
    expect(e.ownedThreadPalettes).toEqual([]);
  });

  it("fattam noseclip awards +10 breath and slower drain", () => {
    const e = deriveSoukEffects(["gear.fattam"]);
    expect(e.extraBreath).toBe(10);
    expect(e.breathDrainMultiplier).toBeLessThan(1);
    expect(e.breathDrainMultiplier).toBeCloseTo(0.85, 5);
  });

  it("honed diveen stone speeds up descent", () => {
    const e = deriveSoukEffects(["gear.diveen-stone"]);
    expect(e.descentMultiplier).toBeGreaterThan(1);
  });

  it("heritage al-deyeen net awards a free common pearl per dive", () => {
    const e = deriveSoukEffects(["gear.heritage-net"]);
    expect(e.bonusCommonPearlsPerDive).toBe(1);
  });

  it("dawn-sky heirloom sets the cosmetic flag", () => {
    expect(deriveSoukEffects(["heirloom.dawn-sky"]).dawnSky).toBe(true);
    expect(deriveSoukEffects([]).dawnSky).toBe(false);
  });

  it("brass-lantern heirloom sets the cosmetic flag", () => {
    expect(deriveSoukEffects(["heirloom.brass-lantern"]).brassLantern).toBe(
      true,
    );
  });

  it("collects all owned thread palettes for the tapestry overlay picker", () => {
    const e = deriveSoukEffects([
      "thread.saffron-charcoal",
      "thread.pearling-coast",
      // Non-thread items must be ignored.
      "gear.fattam",
      "heirloom.dawn-sky",
    ]);
    expect(e.ownedThreadPalettes).toEqual([
      "thread.saffron-charcoal",
      "thread.pearling-coast",
    ]);
  });

  it("composes multiple gear bonuses additively / multiplicatively as designed", () => {
    const e = deriveSoukEffects([
      "gear.fattam",
      "gear.diveen-stone",
      "gear.heritage-net",
    ]);
    // All three bonuses apply on top of one another.
    expect(e.extraBreath).toBe(10);
    expect(e.descentMultiplier).toBe(1.5);
    expect(e.bonusCommonPearlsPerDive).toBe(1);
    expect(e.breathDrainMultiplier).toBeCloseTo(0.85, 5);
  });

  it("ignores unknown item ids without throwing", () => {
    const e = deriveSoukEffects([
      "ghost.unknown-item",
      "another.bogus.id",
    ]);
    expect(e.extraBreath).toBe(0);
    expect(e.dawnSky).toBe(false);
    expect(e.ownedThreadPalettes).toEqual([]);
  });
});
