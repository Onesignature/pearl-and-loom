// /api/achievements — GET endpoint that returns the achievement
// definitions (id, motif, bilingual title/tagline/note). Predicates are
// excluded — they're functions and not transport-safe. Consumers that
// need to evaluate predicates use the registry directly from the
// store-mounted `AchievementWatcher`; consumers that only need to
// display badge metadata (a hypothetical /achievements explorer page,
// or a cross-app embed) can fetch this lightweight catalog.

import { NextResponse } from "next/server";
import { ACHIEVEMENTS } from "@/lib/achievements/registry";

export const dynamic = "force-static";
export const revalidate = 86_400;

export interface AchievementCatalogEntry {
  id: string;
  motif: string;
  titleEn: string;
  titleAr: string;
  taglineEn: string;
  taglineAr: string;
  noteEn: string;
  noteAr: string;
}

export interface AchievementCatalogResponse {
  achievements: AchievementCatalogEntry[];
  count: number;
  version: 1;
}

export function GET() {
  const achievements: AchievementCatalogEntry[] = ACHIEVEMENTS.map((a) => ({
    id: a.id,
    motif: a.motif,
    titleEn: a.titleEn,
    titleAr: a.titleAr,
    taglineEn: a.taglineEn,
    taglineAr: a.taglineAr,
    noteEn: a.noteEn,
    noteAr: a.noteAr,
  }));
  const body: AchievementCatalogResponse = {
    achievements,
    count: achievements.length,
    version: 1,
  };
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
