// Hikma — حِكْمة, "wisdom" — the unified score the learner watches grow.
// Pure derivation from existing progress + settings. NOT a separate persisted
// store — there is one source of truth for every action that earns points.
//
// Reward table (round numbers a Grade 4 can read off the screen):
//   loom lesson         +50
//   common pearl        +20
//   fine pearl          +50
//   royal pearl        +100
//   achievement unlock  +30
//   streak milestone    +30 at 3 days, +70 at 7 days, +140 at 14 days
//   souk purchase       +20 (rewards exploration; pearls themselves are the cost)

import type { CollectedPearl } from "@/lib/store/progress";

export const HIKMA_REWARDS = {
  loomLesson: 50,
  pearl: { common: 20, fine: 50, royal: 100 } as const,
  achievement: 30,
  streakMilestones: [
    { atDay: 3, bonus: 30 },
    { atDay: 7, bonus: 70 },
    { atDay: 14, bonus: 140 },
  ] as const,
  soukPurchase: 20,
} as const;

export interface HikmaInput {
  loomLessonsCompleted: string[];
  pearls: CollectedPearl[];
  achievements: string[];
  streak: number;
  unlockedItems: string[];
}

export function computeHikma(input: HikmaInput): number {
  const loom = input.loomLessonsCompleted.length * HIKMA_REWARDS.loomLesson;
  const pearls = input.pearls.reduce(
    (sum, p) => sum + HIKMA_REWARDS.pearl[p.grade],
    0,
  );
  const achievements = input.achievements.length * HIKMA_REWARDS.achievement;
  const streakBonus = HIKMA_REWARDS.streakMilestones
    .filter((m) => input.streak >= m.atDay)
    .reduce((sum, m) => sum + m.bonus, 0);
  const souk = input.unlockedItems.length * HIKMA_REWARDS.soukPurchase;
  return loom + pearls + achievements + streakBonus + souk;
}

/** Display tier — purely cosmetic, used by HomeHeader to swap chip color. */
export type HikmaTier = "novice" | "weaver" | "diver" | "master";

export function hikmaTier(points: number): HikmaTier {
  if (points >= 800) return "master";
  if (points >= 400) return "diver";
  if (points >= 150) return "weaver";
  return "novice";
}
