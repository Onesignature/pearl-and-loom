"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PatternOp, PearlBead } from "@/lib/pattern-engine/types";

export type PearlGrade = "common" | "fine" | "royal";

export interface CollectedPearl {
  id: string;
  grade: PearlGrade;
  size: number; // 1..5
  luster: number; // 1..5
  diveId: string;
  collectedAt: number;
  wovenIntoTapestry: boolean;
}

export type QuizPath = "layla" | "saif";

export interface QuizResult {
  /** Score out of 5. Null until first attempt. */
  score: number | null;
  /** Best score across all attempts. */
  bestScore: number | null;
  /** Total attempts taken. */
  attempts: number;
  /** Timestamp of last attempt. */
  lastAttemptAt: number | null;
}

export const EMPTY_QUIZ_RESULT: QuizResult = {
  score: null,
  bestScore: null,
  attempts: 0,
  lastAttemptAt: null,
};

interface ProgressState {
  version: 3;
  seed: string;
  ops: PatternOp[];
  beads: PearlBead[];
  pearls: CollectedPearl[];
  loomLessonsCompleted: string[];
  diveLessonsCompleted: string[];
  /** IDs of unlocked achievements (Sadu motif badges). */
  achievements: string[];
  /** Last calendar date (YYYY-MM-DD) on which a lesson was completed. */
  lastWeaveDate: string | null;
  /** Consecutive-day weave streak. */
  streak: number;
  /** IDs of items purchased from the Souk al-Lulu shop. */
  unlockedItems: string[];
  /** Quiz scores per path (Layla = math, Saif = science). */
  quizScores: Record<QuizPath, QuizResult>;
  /** Timestamp of first lesson completion — anchors leaderboard time-taken. */
  startedAt: number | null;
  /** Timestamp of heirloom completion. */
  completedAt: number | null;

  appendOp: (op: PatternOp) => void;
  completeLoomLesson: (lessonId: string, op: PatternOp) => void;
  completeDiveLesson: (lessonId: string) => void;
  collectPearl: (pearl: Omit<CollectedPearl, "collectedAt" | "wovenIntoTapestry">) => void;
  weavePearlIntoTapestry: (pearlId: string, column: number) => void;
  unlockAchievement: (id: string) => void;
  spendPearls: (itemId: string, cost: { common?: number; fine?: number; royal?: number }) => boolean;
  recordQuizScore: (path: QuizPath, score: number) => void;
  markCompleted: () => void;
  reset: () => void;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function bumpStreak(current: number, lastDate: string | null): number {
  const today = todayKey();
  if (lastDate === today) return current;
  if (!lastDate) return 1;
  const last = new Date(lastDate + "T00:00:00");
  const now = new Date(today + "T00:00:00");
  const dayMs = 86400000;
  const diff = Math.round((now.getTime() - last.getTime()) / dayMs);
  if (diff === 1) return current + 1;
  return 1;
}

function makeSeed(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `seed-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const initial = (): Pick<
  ProgressState,
  | "version"
  | "seed"
  | "ops"
  | "beads"
  | "pearls"
  | "loomLessonsCompleted"
  | "diveLessonsCompleted"
  | "achievements"
  | "lastWeaveDate"
  | "streak"
  | "unlockedItems"
  | "quizScores"
  | "startedAt"
  | "completedAt"
> => ({
  version: 3,
  seed: makeSeed(),
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

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial(),

      appendOp: (op) =>
        set((s) => ({ ops: [...s.ops, op] })),

      completeLoomLesson: (lessonId, op) =>
        set((s) => {
          if (s.loomLessonsCompleted.includes(lessonId)) return s;
          const today = todayKey();
          const now = Date.now();
          return {
            loomLessonsCompleted: [...s.loomLessonsCompleted, lessonId],
            ops: [...s.ops, op],
            streak: bumpStreak(s.streak, s.lastWeaveDate),
            lastWeaveDate: today,
            // First-ever lesson stamps the journey's start time. Powers the
            // leaderboard's "time-taken-till-completion" column.
            startedAt: s.startedAt ?? now,
          };
        }),

      completeDiveLesson: (lessonId) =>
        set((s) => {
          if (s.diveLessonsCompleted.includes(lessonId)) return s;
          const today = todayKey();
          const now = Date.now();
          return {
            diveLessonsCompleted: [...s.diveLessonsCompleted, lessonId],
            streak: bumpStreak(s.streak, s.lastWeaveDate),
            lastWeaveDate: today,
            startedAt: s.startedAt ?? now,
          };
        }),

      collectPearl: (pearl) =>
        set((s) => ({
          pearls: [
            ...s.pearls,
            {
              ...pearl,
              collectedAt: Date.now(),
              wovenIntoTapestry: false,
            },
          ],
        })),

      weavePearlIntoTapestry: (pearlId, column) =>
        set((s) => {
          const pearl = s.pearls.find((p) => p.id === pearlId);
          if (!pearl || pearl.wovenIntoTapestry) return s;
          const bead: PearlBead = { pearlId, column, grade: pearl.grade };
          const op: PatternOp = {
            kind: "bead",
            pearlId,
            column,
            lessonId: pearl.diveId,
          };
          return {
            beads: [...s.beads, bead],
            ops: [...s.ops, op],
            pearls: s.pearls.map((p) =>
              p.id === pearlId ? { ...p, wovenIntoTapestry: true } : p,
            ),
          };
        }),

      unlockAchievement: (id) =>
        set((s) =>
          s.achievements.includes(id)
            ? s
            : { achievements: [...s.achievements, id] },
        ),

      spendPearls: (itemId, cost) => {
        let success = false;
        set((s) => {
          if (s.unlockedItems.includes(itemId)) return s;
          // Spend oldest un-woven pearls of the requested tiers first.
          const need = {
            common: cost.common ?? 0,
            fine: cost.fine ?? 0,
            royal: cost.royal ?? 0,
          };
          const consumed = new Set<string>();
          const sorted = [...s.pearls]
            .filter((p) => !p.wovenIntoTapestry)
            .sort((a, b) => a.collectedAt - b.collectedAt);
          for (const p of sorted) {
            if (need[p.grade] > 0) {
              consumed.add(p.id);
              need[p.grade]--;
            }
          }
          if (need.common > 0 || need.fine > 0 || need.royal > 0) {
            return s;
          }
          success = true;
          return {
            pearls: s.pearls.filter((p) => !consumed.has(p.id)),
            unlockedItems: [...s.unlockedItems, itemId],
          };
        });
        return success;
      },

      recordQuizScore: (path, score) =>
        set((s) => {
          const prior = s.quizScores[path];
          const bestScore = Math.max(prior.bestScore ?? 0, score);
          return {
            quizScores: {
              ...s.quizScores,
              [path]: {
                score,
                bestScore,
                attempts: prior.attempts + 1,
                lastAttemptAt: Date.now(),
              },
            },
          };
        }),

      markCompleted: () =>
        set((s) => (s.completedAt ? s : { completedAt: Date.now() })),

      reset: () => set(() => initial()),
    }),
    {
      name: "pearl-and-loom:progress",
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted, fromVersion) => {
        const p = (persisted ?? {}) as Partial<ProgressState>;
        // v1 → v2: add achievements/streak/items fields with safe defaults.
        if (fromVersion < 2) {
          Object.assign(p, {
            achievements: p.achievements ?? [],
            lastWeaveDate: p.lastWeaveDate ?? null,
            streak: p.streak ?? 0,
            unlockedItems: p.unlockedItems ?? [],
          });
        }
        // v2 → v3: add quizScores + startedAt + completedAt.
        if (fromVersion < 3) {
          return {
            ...p,
            version: 3,
            quizScores: p.quizScores ?? {
              layla: { ...EMPTY_QUIZ_RESULT },
              saif: { ...EMPTY_QUIZ_RESULT },
            },
            startedAt: p.startedAt ?? null,
            completedAt: p.completedAt ?? null,
          } as ProgressState;
        }
        return p as ProgressState;
      },
    },
  ),
);
