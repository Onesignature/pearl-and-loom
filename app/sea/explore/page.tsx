"use client";

// /sea/explore — free-swim exploration mode. Thin route wrapper that
// renders the SeaExplore component (which owns its own scene chrome
// and game loop).

import { SeaExplore } from "@/components/sea/SeaExplore";

export default function SeaExplorePage() {
  return <SeaExplore />;
}
