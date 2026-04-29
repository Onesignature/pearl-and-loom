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

interface ProgressState {
  version: 2;
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

  appendOp: (op: PatternOp) => void;
  completeLoomLesson: (lessonId: string, op: PatternOp) => void;
  completeDiveLesson: (lessonId: string) => void;
  collectPearl: (pearl: Omit<CollectedPearl, "collectedAt" | "wovenIntoTapestry">) => void;
  weavePearlIntoTapestry: (pearlId: string, column: number) => void;
  unlockAchievement: (id: string) => void;
  spendPearls: (itemId: string, cost: { common?: number; fine?: number; royal?: number }) => boolean;
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
> => ({
  version: 2,
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
          return {
            loomLessonsCompleted: [...s.loomLessonsCompleted, lessonId],
            ops: [...s.ops, op],
            streak: bumpStreak(s.streak, s.lastWeaveDate),
            lastWeaveDate: today,
          };
        }),

      completeDiveLesson: (lessonId) =>
        set((s) => {
          if (s.diveLessonsCompleted.includes(lessonId)) return s;
          const today = todayKey();
          return {
            diveLessonsCompleted: [...s.diveLessonsCompleted, lessonId],
            streak: bumpStreak(s.streak, s.lastWeaveDate),
            lastWeaveDate: today,
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

      reset: () => set(() => initial()),
    }),
    {
      name: "pearl-and-loom:progress",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted, fromVersion) => {
        // v1 → v2: add achievements/streak/items fields with safe defaults.
        const p = (persisted ?? {}) as Partial<ProgressState>;
        if (fromVersion < 2) {
          return {
            ...p,
            version: 2,
            achievements: p.achievements ?? [],
            lastWeaveDate: p.lastWeaveDate ?? null,
            streak: p.streak ?? 0,
            unlockedItems: p.unlockedItems ?? [],
          } as ProgressState;
        }
        return p as ProgressState;
      },
    },
  ),
);
