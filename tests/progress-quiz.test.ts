import { describe, it, expect, beforeEach } from "vitest";
import { useProgress, EMPTY_QUIZ_RESULT } from "@/lib/store/progress";

function reset() {
  useProgress.setState({
    version: 3,
    seed: "test-seed",
    ops: [],
    beads: [],
    pearls: [],
    loomLessonsCompleted: [],
    diveLessonsCompleted: [],
    achievements: [],
    lastWeaveDate: null,
    streak: 0,
    unlockedItems: [],
    quizScores: {
      layla: { ...EMPTY_QUIZ_RESULT },
      saif: { ...EMPTY_QUIZ_RESULT },
    },
    startedAt: null,
    completedAt: null,
  });
}

describe("progress · recordQuizScore", () => {
  beforeEach(reset);

  it("records the score and stamps lastAttemptAt", () => {
    useProgress.getState().recordQuizScore("layla", 4);
    const r = useProgress.getState().quizScores.layla;
    expect(r.score).toBe(4);
    expect(r.attempts).toBe(1);
    expect(r.lastAttemptAt).not.toBeNull();
  });

  it("tracks bestScore as the maximum across attempts", () => {
    const s = useProgress.getState();
    s.recordQuizScore("saif", 3);
    s.recordQuizScore("saif", 5);
    s.recordQuizScore("saif", 2);
    const r = useProgress.getState().quizScores.saif;
    expect(r.bestScore).toBe(5);
    expect(r.score).toBe(2);
    expect(r.attempts).toBe(3);
  });

  it("layla and saif scores are tracked independently", () => {
    const s = useProgress.getState();
    s.recordQuizScore("layla", 4);
    s.recordQuizScore("saif", 2);
    const got = useProgress.getState().quizScores;
    expect(got.layla.bestScore).toBe(4);
    expect(got.saif.bestScore).toBe(2);
  });
});

describe("progress · markCompleted", () => {
  beforeEach(reset);

  it("stamps completedAt the first time it fires", () => {
    expect(useProgress.getState().completedAt).toBeNull();
    useProgress.getState().markCompleted();
    expect(useProgress.getState().completedAt).not.toBeNull();
  });

  it("is idempotent — second call leaves the original timestamp untouched", () => {
    useProgress.getState().markCompleted();
    const first = useProgress.getState().completedAt as number;
    // Tiny tick so a fresh Date.now() would differ.
    const later = first + 1;
    useProgress.setState({});
    useProgress.getState().markCompleted();
    const second = useProgress.getState().completedAt as number;
    expect(second).toBe(first);
    expect(second).not.toBe(later);
  });
});

describe("progress · startedAt", () => {
  beforeEach(reset);

  it("stamps startedAt on first loom lesson", () => {
    expect(useProgress.getState().startedAt).toBeNull();
    useProgress.getState().completeLoomLesson("symmetry", {
      kind: "symmetry",
      axis: "vertical",
      lessonId: "symmetry",
    });
    expect(useProgress.getState().startedAt).not.toBeNull();
  });

  it("stamps startedAt on first dive lesson if no loom started yet", () => {
    useProgress.getState().completeDiveLesson("shallowBank");
    expect(useProgress.getState().startedAt).not.toBeNull();
  });

  it("does not overwrite the original startedAt on later completions", () => {
    useProgress.getState().completeLoomLesson("symmetry", {
      kind: "symmetry",
      axis: "vertical",
      lessonId: "symmetry",
    });
    const first = useProgress.getState().startedAt as number;
    useProgress.getState().completeDiveLesson("shallowBank");
    expect(useProgress.getState().startedAt).toBe(first);
  });
});
