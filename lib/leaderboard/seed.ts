// Seeded mock leaderboard. The take-home brief explicitly accepts mock
// data — there is no backend — so the "other learners" are deterministic
// fictional UAE-themed kids whose scores span a believable range. The
// current learner is inserted live, keyed off `learnerName === null`.
//
// Names sourced from common Emirati given names + a couple of regional
// favourites. Avatars cycle through the four learner tokens so the
// visual rhythm matches the rest of the app.

import type { LearnerAvatar } from "@/lib/store/settings";

export interface LeaderboardEntry {
  /** Stable id for keying. "you" reserved for the current learner. */
  id: string;
  name: string;
  avatar: LearnerAvatar;
  hikma: number;
  /** Trophies = unlocked achievements count. */
  trophies: number;
  /** Total elapsed time in milliseconds. null = still in progress. */
  timeMs: number | null;
  /** True if this learner has hit the heirloom-complete milestone. */
  completed: boolean;
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const SEED_ENTRIES: LeaderboardEntry[] = [
  {
    id: "seed-1",
    name: "Mariam",
    avatar: "falcon",
    hikma: 1180,
    trophies: 13,
    timeMs: 5 * DAY + 3 * HOUR,
    completed: true,
  },
  {
    id: "seed-2",
    name: "Hamad",
    avatar: "dhow",
    hikma: 980,
    trophies: 11,
    timeMs: 7 * DAY + 6 * HOUR,
    completed: true,
  },
  {
    id: "seed-3",
    name: "Noura",
    avatar: "pearl",
    hikma: 870,
    trophies: 10,
    timeMs: 4 * DAY,
    completed: true,
  },
  {
    id: "seed-4",
    name: "Khalifa",
    avatar: "palm",
    hikma: 720,
    trophies: 9,
    timeMs: 9 * DAY + 4 * HOUR,
    completed: true,
  },
  {
    id: "seed-5",
    name: "Shamma",
    avatar: "falcon",
    hikma: 540,
    trophies: 7,
    timeMs: null,
    completed: false,
  },
  {
    id: "seed-6",
    name: "Rashid",
    avatar: "dhow",
    hikma: 380,
    trophies: 5,
    timeMs: null,
    completed: false,
  },
  {
    id: "seed-7",
    name: "Aisha",
    avatar: "pearl",
    hikma: 220,
    trophies: 3,
    timeMs: null,
    completed: false,
  },
  {
    id: "seed-8",
    name: "Zayed",
    avatar: "palm",
    hikma: 90,
    trophies: 1,
    timeMs: null,
    completed: false,
  },
];

export interface BuildLeaderboardInput {
  learnerName: string;
  learnerAvatar: LearnerAvatar | null;
  hikma: number;
  trophies: number;
  startedAt: number | null;
  completedAt: number | null;
  /** Wall-clock now — passed in so tests can pin it. */
  now: number;
  /** Optional override for the seed entries — used by the
   *  /api/leaderboard fetch consumer to decouple the seed from the
   *  bundle. Defaults to the local constant. */
  seed?: LeaderboardEntry[];
}

/**
 * Build the live leaderboard list. The current learner is inserted as a
 * "you" entry, then everyone is sorted by hikma desc. If the learner
 * hasn't started a profile yet (no name), the seed list is returned alone.
 */
export function buildLeaderboard(
  input: BuildLeaderboardInput,
): LeaderboardEntry[] {
  const seed = input.seed ?? SEED_ENTRIES;
  const entries: LeaderboardEntry[] = [...seed];
  if (input.learnerName.trim()) {
    const name = input.learnerName.trim().split(/\s+/)[0];
    const elapsed =
      input.startedAt === null
        ? null
        : (input.completedAt ?? input.now) - input.startedAt;
    entries.push({
      id: "you",
      name,
      avatar: input.learnerAvatar ?? "falcon",
      hikma: input.hikma,
      trophies: input.trophies,
      timeMs: elapsed,
      completed: input.completedAt !== null,
    });
  }
  // Primary sort: hikma desc. Tiebreak: completed before in-progress, then
  // shorter completion time wins.
  entries.sort((a, b) => {
    if (b.hikma !== a.hikma) return b.hikma - a.hikma;
    if (a.completed !== b.completed) return a.completed ? -1 : 1;
    const at = a.timeMs ?? Number.POSITIVE_INFINITY;
    const bt = b.timeMs ?? Number.POSITIVE_INFINITY;
    return at - bt;
  });
  return entries;
}

/** Format an elapsed-ms duration into "5d 3h" / "6h 12m" / "42m" / "—". */
export function formatTime(ms: number | null, lang: "en" | "ar"): string {
  if (ms === null || ms < 0) return "—";
  const d = Math.floor(ms / DAY);
  const h = Math.floor((ms % DAY) / HOUR);
  const m = Math.floor((ms % HOUR) / 60_000);
  const dLabel = lang === "en" ? "d" : "ي";
  const hLabel = lang === "en" ? "h" : "س";
  const mLabel = lang === "en" ? "m" : "د";
  if (d > 0) return `${d}${dLabel} ${h}${hLabel}`;
  if (h > 0) return `${h}${hLabel} ${m}${mLabel}`;
  return `${Math.max(1, m)}${mLabel}`;
}
