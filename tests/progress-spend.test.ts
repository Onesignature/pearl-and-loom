import { describe, it, expect, beforeEach } from "vitest";
import { useProgress } from "@/lib/store/progress";
import type { CollectedPearl } from "@/lib/store/progress";

function pearl(
  id: string,
  grade: CollectedPearl["grade"],
  collectedAt: number,
  woven = false,
): CollectedPearl {
  return {
    id,
    grade,
    size: 3,
    luster: 3,
    diveId: "shallowBank",
    collectedAt,
    wovenIntoTapestry: woven,
  };
}

describe("useProgress.spendPearls", () => {
  beforeEach(() => {
    // Wipe persisted state so each test starts clean.
    useProgress.persist.clearStorage();
    useProgress.getState().reset();
  });

  it("refuses and returns false when there are not enough pearls", () => {
    useProgress.setState({
      pearls: [pearl("p1", "common", 100)],
    });
    const ok = useProgress.getState().spendPearls("item.x", { fine: 1 });
    expect(ok).toBe(false);
    expect(useProgress.getState().pearls).toHaveLength(1);
    expect(useProgress.getState().unlockedItems).toHaveLength(0);
  });

  it("returns true and consumes oldest un-woven pearls of the requested tiers", () => {
    useProgress.setState({
      pearls: [
        pearl("p1", "fine", 100),
        pearl("p2", "fine", 200),
        pearl("p3", "fine", 300),
      ],
    });
    const ok = useProgress.getState().spendPearls("item.x", { fine: 2 });
    expect(ok).toBe(true);
    const left = useProgress.getState().pearls;
    expect(left).toHaveLength(1);
    // The newest pearl should be the survivor.
    expect(left[0].id).toBe("p3");
    expect(useProgress.getState().unlockedItems).toContain("item.x");
  });

  it("is idempotent — buying the same item twice spends pearls only once", () => {
    useProgress.setState({
      pearls: [
        pearl("p1", "common", 100),
        pearl("p2", "common", 200),
        pearl("p3", "common", 300),
      ],
    });
    const first = useProgress.getState().spendPearls("item.x", { common: 1 });
    const second = useProgress.getState().spendPearls("item.x", { common: 1 });
    expect(first).toBe(true);
    expect(second).toBe(false);
    expect(useProgress.getState().pearls).toHaveLength(2);
    expect(
      useProgress
        .getState()
        .unlockedItems.filter((i) => i === "item.x"),
    ).toHaveLength(1);
  });

  it("does not spend pearls already woven into the tapestry", () => {
    useProgress.setState({
      pearls: [
        pearl("p1", "fine", 100, /* woven */ true),
        pearl("p2", "fine", 200, /* woven */ true),
      ],
    });
    const ok = useProgress.getState().spendPearls("item.x", { fine: 1 });
    expect(ok).toBe(false);
    expect(useProgress.getState().pearls).toHaveLength(2);
    expect(useProgress.getState().unlockedItems).toHaveLength(0);
  });

  it("supports mixed-tier costs (e.g. royal-on-wool skein)", () => {
    useProgress.setState({
      pearls: [
        pearl("c1", "common", 50),
        pearl("c2", "common", 60),
        pearl("f1", "fine", 100),
        pearl("f2", "fine", 110),
        pearl("r1", "royal", 200),
      ],
    });
    const ok = useProgress
      .getState()
      .spendPearls("thread.royal-wool", { royal: 1, fine: 2 });
    expect(ok).toBe(true);
    const left = useProgress.getState().pearls.map((p) => p.id);
    // Common pearls untouched, both fines + the royal consumed.
    expect(left).toEqual(["c1", "c2"]);
  });
});
