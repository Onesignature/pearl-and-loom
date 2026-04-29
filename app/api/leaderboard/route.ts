// /api/leaderboard — GET endpoint that returns the seeded mock
// leaderboard. The brief explicitly accepts mock data, but Pearl-and-
// Loom's seed lives in `lib/leaderboard/seed.ts` so the consumer side
// of the app can fetch it via a real route handler instead of bundling
// the seed straight into the client. Demonstrates a clean fetch +
// route-handler pattern without inventing a backend the app doesn't
// need.
//
// Static at build time (no per-request work). Consumers call
// `fetch("/api/leaderboard")` from a client component and merge the
// "you" entry locally via the existing `buildLeaderboard()` helper.

import { NextResponse } from "next/server";
import { SEED_ENTRIES } from "@/lib/leaderboard/seed";

// One-day cache — the seed is deterministic and re-builds on next
// deploy. No reason to recompute per request.
export const dynamic = "force-static";
export const revalidate = 86_400;

export interface LeaderboardSeedResponse {
  seed: typeof SEED_ENTRIES;
  /** Server timestamp in ms — clients use this to anchor their own
   *  "elapsed time" calculations against a known reference. */
  generatedAt: number;
  version: 1;
}

export function GET() {
  const body: LeaderboardSeedResponse = {
    seed: SEED_ENTRIES,
    generatedAt: Date.now(),
    version: 1,
  };
  return NextResponse.json(body, {
    headers: {
      // Match the Next route-segment cache for downstream CDNs.
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
