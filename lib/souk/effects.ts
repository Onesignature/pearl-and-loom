"use client";

// Souk effects — translates the user's `unlockedItems` ID list into the
// concrete numeric / boolean modifiers the rest of the app reads. Single
// source of truth; surfaces (DiveScene, TentScene, tapestry, chest, home)
// import from here so when the catalog gains a new item the effect math
// only changes in one place.

import { useMemo } from "react";
import { useProgress } from "@/lib/store/progress";

export interface SoukEffects {
  // ── Diving gear ─────────────────────────────────────────────────────
  /** Fattam noseclip — extra starting breath. */
  extraBreath: number;
  /** Fattam — multiplier on breath-drain rate (0.85 = 15% slower). */
  breathDrainMultiplier: number;
  /** Honed diveen stone — multiplier on descent + ascent speed. */
  descentMultiplier: number;
  /** Heritage al-deyeen net — extra common pearls awarded on dive completion. */
  bonusCommonPearlsPerDive: number;

  // ── Tent heirlooms ──────────────────────────────────────────────────
  /** Dawn sky cosmetic — home tent uses the dawn palette instead of dusk. */
  dawnSky: boolean;
  /** Brass pearling lantern — adds a hung lantern element to the home tent. */
  brassLantern: boolean;
  /** Framed father photo — appears on the chest screen. */
  framedPhoto: boolean;

  // ── Sadu threads ────────────────────────────────────────────────────
  /** Active tapestry thread palette (when any are owned the user can pick one). */
  ownedThreadPalettes: ThreadPaletteId[];
}

export type ThreadPaletteId =
  | "thread.saffron-charcoal"
  | "thread.royal-wool"
  | "thread.pearling-coast";

const THREAD_IDS = new Set<string>([
  "thread.saffron-charcoal",
  "thread.royal-wool",
  "thread.pearling-coast",
]);

/** Pure derivation — exported for tests. */
export function deriveSoukEffects(unlockedItems: string[]): SoukEffects {
  const has = (id: string) => unlockedItems.includes(id);
  return {
    extraBreath: has("gear.fattam") ? 10 : 0,
    breathDrainMultiplier: has("gear.fattam") ? 0.85 : 1,
    descentMultiplier: has("gear.diveen-stone") ? 1.5 : 1,
    bonusCommonPearlsPerDive: has("gear.heritage-net") ? 1 : 0,
    dawnSky: has("heirloom.dawn-sky"),
    brassLantern: has("heirloom.brass-lantern"),
    framedPhoto: has("heirloom.father-photo"),
    ownedThreadPalettes: unlockedItems.filter((id): id is ThreadPaletteId =>
      THREAD_IDS.has(id),
    ),
  };
}

/** React hook — subscribes to the progress store. */
export function useSoukEffects(): SoukEffects {
  const unlockedItems = useProgress((s) => s.unlockedItems);
  return useMemo(() => deriveSoukEffects(unlockedItems), [unlockedItems]);
}
