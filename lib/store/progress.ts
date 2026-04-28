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
  version: 1;
  seed: string;
  ops: PatternOp[];
  beads: PearlBead[];
  pearls: CollectedPearl[];
  loomLessonsCompleted: string[];
  diveLessonsCompleted: string[];

  appendOp: (op: PatternOp) => void;
  completeLoomLesson: (lessonId: string, op: PatternOp) => void;
  completeDiveLesson: (lessonId: string) => void;
  collectPearl: (pearl: Omit<CollectedPearl, "collectedAt" | "wovenIntoTapestry">) => void;
  weavePearlIntoTapestry: (pearlId: string, column: number) => void;
  reset: () => void;
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
> => ({
  version: 1,
  seed: makeSeed(),
  ops: [],
  beads: [],
  pearls: [],
  loomLessonsCompleted: [],
  diveLessonsCompleted: [],
});

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial(),

      appendOp: (op) =>
        set((s) => ({ ops: [...s.ops, op] })),

      completeLoomLesson: (lessonId, op) =>
        set((s) =>
          s.loomLessonsCompleted.includes(lessonId)
            ? s
            : {
                loomLessonsCompleted: [...s.loomLessonsCompleted, lessonId],
                ops: [...s.ops, op],
              },
        ),

      completeDiveLesson: (lessonId) =>
        set((s) =>
          s.diveLessonsCompleted.includes(lessonId)
            ? s
            : {
                diveLessonsCompleted: [...s.diveLessonsCompleted, lessonId],
              },
        ),

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

      reset: () => set(() => initial()),
    }),
    {
      name: "pearl-and-loom:progress",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
