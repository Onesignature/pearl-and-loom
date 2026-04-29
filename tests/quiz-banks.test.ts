import { describe, it, expect } from "vitest";
import { QUIZ_BANKS, QUIZ_LENGTH } from "@/lib/quiz/banks";

describe("Quiz banks", () => {
  it("provides exactly QUIZ_LENGTH questions per path", () => {
    expect(QUIZ_BANKS.layla).toHaveLength(QUIZ_LENGTH);
    expect(QUIZ_BANKS.saif).toHaveLength(QUIZ_LENGTH);
  });

  it("every question has a valid 0-3 correct index", () => {
    for (const path of ["layla", "saif"] as const) {
      for (const q of QUIZ_BANKS[path]) {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThanOrEqual(3);
      }
    }
  });

  it("every question has 4 EN options and 4 AR options", () => {
    for (const path of ["layla", "saif"] as const) {
      for (const q of QUIZ_BANKS[path]) {
        expect(q.optionsEn).toHaveLength(4);
        expect(q.optionsAr).toHaveLength(4);
      }
    }
  });

  it("every question has bilingual prompt + explainer", () => {
    for (const path of ["layla", "saif"] as const) {
      for (const q of QUIZ_BANKS[path]) {
        expect(q.promptEn.length).toBeGreaterThan(0);
        expect(q.promptAr.length).toBeGreaterThan(0);
        expect(q.explainEn.length).toBeGreaterThan(0);
        expect(q.explainAr.length).toBeGreaterThan(0);
      }
    }
  });

  it("question ids are unique within each path", () => {
    for (const path of ["layla", "saif"] as const) {
      const ids = QUIZ_BANKS[path].map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
