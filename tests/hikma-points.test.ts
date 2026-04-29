import { describe, it, expect } from "vitest";
import {
  computeHikma,
  hikmaTier,
  HIKMA_REWARDS,
} from "@/lib/hikma/points";
import type { CollectedPearl } from "@/lib/store/progress";

function pearl(grade: CollectedPearl["grade"], id = `p-${grade}`): CollectedPearl {
  return {
    id,
    grade,
    size: 3,
    luster: 3,
    diveId: "shallowBank",
    collectedAt: 0,
    wovenIntoTapestry: false,
  };
}

describe("computeHikma", () => {
  it("returns zero on a brand-new account", () => {
    expect(
      computeHikma({
        loomLessonsCompleted: [],
        pearls: [],
        achievements: [],
        streak: 0,
      }),
    ).toBe(0);
  });

  it("rewards loom lessons at the documented rate", () => {
    expect(
      computeHikma({
        loomLessonsCompleted: ["symmetry", "fractions"],
        pearls: [],
        achievements: [],
        streak: 0,
      }),
    ).toBe(2 * HIKMA_REWARDS.loomLesson);
  });

  it("scores pearls by grade with the documented tier values", () => {
    const points = computeHikma({
      loomLessonsCompleted: [],
      pearls: [pearl("common", "1"), pearl("fine", "2"), pearl("royal", "3")],
      achievements: [],
      streak: 0,
    });
    expect(points).toBe(
      HIKMA_REWARDS.pearl.common +
        HIKMA_REWARDS.pearl.fine +
        HIKMA_REWARDS.pearl.royal,
    );
  });

  it("adds streak milestone bonuses cumulatively at 3, 7, and 14 days", () => {
    const base = {
      loomLessonsCompleted: [],
      pearls: [],
      achievements: [],
    };
    expect(computeHikma({ ...base, streak: 2 })).toBe(0);
    expect(computeHikma({ ...base, streak: 3 })).toBe(30);
    expect(computeHikma({ ...base, streak: 7 })).toBe(30 + 70);
    expect(computeHikma({ ...base, streak: 14 })).toBe(30 + 70 + 140);
  });

  it("composes loom + pearls + achievements + streak into a single total", () => {
    const points = computeHikma({
      loomLessonsCompleted: ["symmetry", "fractions", "tessellation"],
      pearls: [pearl("common", "a"), pearl("fine", "b"), pearl("royal", "c")],
      achievements: ["first_row", "first_pearl"],
      streak: 7,
    });
    // 3 lessons (50×3=150) + pearls (20+50+100=170) + achievements (30×2=60)
    // + streak >=7 (30 + 70 = 100) = 480
    expect(points).toBe(480);
  });
});

describe("hikmaTier", () => {
  it("partitions points into novice / weaver / diver / master bands", () => {
    expect(hikmaTier(0)).toBe("novice");
    expect(hikmaTier(149)).toBe("novice");
    expect(hikmaTier(150)).toBe("weaver");
    expect(hikmaTier(399)).toBe("weaver");
    expect(hikmaTier(400)).toBe("diver");
    expect(hikmaTier(799)).toBe("diver");
    expect(hikmaTier(800)).toBe("master");
    expect(hikmaTier(10_000)).toBe("master");
  });
});
