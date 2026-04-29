import { describe, it, expect } from "vitest";
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_BY_ID,
  type AchievementCheckInput,
} from "@/lib/achievements/registry";

const empty: AchievementCheckInput = {
  loomLessonsCompleted: [],
  diveLessonsCompleted: [],
  pearls: [],
  ops: [],
  streak: 0,
  unlockedItems: [],
  hasToggledLang: false,
  hasToggledNumerals: false,
  quizBestScores: { layla: 0, saif: 0 },
};

function withOverrides(o: Partial<AchievementCheckInput>): AchievementCheckInput {
  return { ...empty, ...o };
}

describe("ACHIEVEMENT predicates", () => {
  it("registers every id uniquely", () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(ACHIEVEMENT_BY_ID[id]).toBeDefined();
    }
  });

  it("first_row fires after one loom lesson and not before", () => {
    const def = ACHIEVEMENT_BY_ID.first_row;
    expect(def.check(empty)).toBe(false);
    expect(def.check(withOverrides({ loomLessonsCompleted: ["symmetry"] }))).toBe(true);
  });

  it("first_pearl fires once any pearl is collected", () => {
    const def = ACHIEVEMENT_BY_ID.first_pearl;
    expect(def.check(empty)).toBe(false);
    expect(
      def.check(
        withOverrides({ pearls: [{ grade: "common", diveId: "shallowBank" }] }),
      ),
    ).toBe(true);
  });

  it("royal_catch fires only on a royal pearl", () => {
    const def = ACHIEVEMENT_BY_ID.royal_catch;
    expect(
      def.check(
        withOverrides({ pearls: [{ grade: "fine", diveId: "deepReef" }] }),
      ),
    ).toBe(false);
    expect(
      def.check(
        withOverrides({
          pearls: [
            { grade: "fine", diveId: "deepReef" },
            { grade: "royal", diveId: "coralGarden" },
          ],
        }),
      ),
    ).toBe(true);
  });

  it("master_weaver requires 10+ non-bead ops", () => {
    const def = ACHIEVEMENT_BY_ID.master_weaver;
    const nineOps = Array.from({ length: 9 }, () => ({ kind: "symmetry" }));
    const tenOps = Array.from({ length: 10 }, () => ({ kind: "symmetry" }));
    expect(def.check(withOverrides({ ops: nineOps }))).toBe(false);
    expect(def.check(withOverrides({ ops: tenOps }))).toBe(true);
  });

  it("master_weaver does not count bead ops toward the row total", () => {
    const def = ACHIEVEMENT_BY_ID.master_weaver;
    const beads = Array.from({ length: 12 }, () => ({ kind: "bead" }));
    expect(def.check(withOverrides({ ops: beads }))).toBe(false);
  });

  it("polyglot fires only after the user has toggled language at least once", () => {
    const def = ACHIEVEMENT_BY_ID.polyglot;
    expect(def.check(empty)).toBe(false);
    expect(def.check(withOverrides({ hasToggledLang: true }))).toBe(true);
  });

  it("numerical fires only after the numeral toggle has been used", () => {
    const def = ACHIEVEMENT_BY_ID.numerical;
    expect(def.check(empty)).toBe(false);
    expect(def.check(withOverrides({ hasToggledNumerals: true }))).toBe(true);
  });

  it("deep_diver fires after deepReef or coralGarden completion", () => {
    const def = ACHIEVEMENT_BY_ID.deep_diver;
    expect(def.check(empty)).toBe(false);
    expect(
      def.check(withOverrides({ diveLessonsCompleted: ["shallowBank"] })),
    ).toBe(false);
    expect(
      def.check(withOverrides({ diveLessonsCompleted: ["deepReef"] })),
    ).toBe(true);
    expect(
      def.check(withOverrides({ diveLessonsCompleted: ["coralGarden"] })),
    ).toBe(true);
  });

  it("souk_visitor fires once any souk item is unlocked", () => {
    const def = ACHIEVEMENT_BY_ID.souk_visitor;
    expect(def.check(empty)).toBe(false);
    expect(def.check(withOverrides({ unlockedItems: ["thread.saffron-charcoal"] }))).toBe(true);
  });

  it("streak_3 / streak_7 fire at thresholds", () => {
    const s3 = ACHIEVEMENT_BY_ID.streak_3;
    const s7 = ACHIEVEMENT_BY_ID.streak_7;
    expect(s3.check(withOverrides({ streak: 2 }))).toBe(false);
    expect(s3.check(withOverrides({ streak: 3 }))).toBe(true);
    expect(s7.check(withOverrides({ streak: 6 }))).toBe(false);
    expect(s7.check(withOverrides({ streak: 7 }))).toBe(true);
  });

  it("heirloom_complete requires 25 non-bead rows AND 12 pearls", () => {
    const def = ACHIEVEMENT_BY_ID.heirloom_complete;
    const ops = Array.from({ length: 25 }, () => ({ kind: "tessellation" }));
    const pearls = Array.from({ length: 12 }, () => ({
      grade: "common" as const,
      diveId: "shallowBank",
    }));
    expect(def.check(withOverrides({ ops, pearls: [] }))).toBe(false);
    expect(def.check(withOverrides({ ops: [], pearls }))).toBe(false);
    expect(def.check(withOverrides({ ops, pearls }))).toBe(true);
  });

  it("laylas_apprentice fires at quiz score 4/5 or better", () => {
    const def = ACHIEVEMENT_BY_ID.laylas_apprentice;
    expect(def.check(empty)).toBe(false);
    expect(def.check(withOverrides({ quizBestScores: { layla: 3, saif: 0 } }))).toBe(false);
    expect(def.check(withOverrides({ quizBestScores: { layla: 4, saif: 0 } }))).toBe(true);
    expect(def.check(withOverrides({ quizBestScores: { layla: 5, saif: 0 } }))).toBe(true);
  });

  it("saifs_apprentice fires at quiz score 4/5 or better", () => {
    const def = ACHIEVEMENT_BY_ID.saifs_apprentice;
    expect(def.check(empty)).toBe(false);
    expect(def.check(withOverrides({ quizBestScores: { layla: 0, saif: 3 } }))).toBe(false);
    expect(def.check(withOverrides({ quizBestScores: { layla: 0, saif: 4 } }))).toBe(true);
    expect(def.check(withOverrides({ quizBestScores: { layla: 0, saif: 5 } }))).toBe(true);
  });

  it("every achievement registers a non-empty bilingual title and motif", () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.titleEn.length).toBeGreaterThan(0);
      expect(a.titleAr.length).toBeGreaterThan(0);
      expect(a.taglineEn.length).toBeGreaterThan(0);
      expect(a.taglineAr.length).toBeGreaterThan(0);
      expect(a.noteEn.length).toBeGreaterThan(0);
      expect(a.noteAr.length).toBeGreaterThan(0);
      expect(a.motif.length).toBeGreaterThan(0);
    }
  });
});
