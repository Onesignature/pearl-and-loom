import { describe, it, expect } from "vitest";
import { SOUK_CATALOG, STALLS, type Stall } from "@/lib/souk/catalog";
import { deriveSoukEffects } from "@/lib/souk/effects";

describe("SOUK_CATALOG integrity", () => {
  it("ships nine items, three per stall", () => {
    expect(SOUK_CATALOG).toHaveLength(9);
    for (const stall of STALLS) {
      const items = SOUK_CATALOG.filter((i) => i.stall === stall.id);
      expect(items, `stall ${stall.id} item count`).toHaveLength(3);
    }
  });

  it("every item id is unique", () => {
    const ids = SOUK_CATALOG.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every item declares all bilingual fields and a glyph", () => {
    for (const i of SOUK_CATALOG) {
      expect(i.nameEn.length, i.id).toBeGreaterThan(0);
      expect(i.nameAr.length, i.id).toBeGreaterThan(0);
      expect(i.taglineEn.length, i.id).toBeGreaterThan(0);
      expect(i.taglineAr.length, i.id).toBeGreaterThan(0);
      expect(i.effectEn.length, i.id).toBeGreaterThan(0);
      expect(i.effectAr.length, i.id).toBeGreaterThan(0);
      expect(i.noteEn.length, i.id).toBeGreaterThan(0);
      expect(i.noteAr.length, i.id).toBeGreaterThan(0);
      expect(i.glyph.length, i.id).toBeGreaterThan(0);
    }
  });

  it("every item has a non-zero pearl cost in at least one tier", () => {
    for (const i of SOUK_CATALOG) {
      const total =
        (i.cost.common ?? 0) + (i.cost.fine ?? 0) + (i.cost.royal ?? 0);
      expect(total, i.id).toBeGreaterThan(0);
    }
  });

  it("every item id resolves to a real downstream effect", () => {
    // Owning the item must change at least one field of the derived effects.
    const baseline = JSON.stringify(deriveSoukEffects([]));
    for (const i of SOUK_CATALOG) {
      const withItem = JSON.stringify(deriveSoukEffects([i.id]));
      expect(withItem, `item ${i.id} should change effects`).not.toBe(baseline);
    }
  });

  it("every stall id used by an item exists in STALLS", () => {
    const stallIds = new Set<Stall>(STALLS.map((s) => s.id));
    for (const i of SOUK_CATALOG) {
      expect(stallIds.has(i.stall), i.id).toBe(true);
    }
  });

  it("every item id namespace matches its stall (e.g. gear.* in the gear stall)", () => {
    for (const i of SOUK_CATALOG) {
      const namespace = i.id.split(".")[0];
      switch (i.stall) {
        case "threads":
          expect(namespace, i.id).toBe("thread");
          break;
        case "gear":
          expect(namespace, i.id).toBe("gear");
          break;
        case "heirlooms":
          expect(namespace, i.id).toBe("heirloom");
          break;
      }
    }
  });
});
