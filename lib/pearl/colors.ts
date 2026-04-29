// Single source of truth for pearl tier visuals. The same three-tier
// palette was previously defined in six places with subtly different
// shapes. Consolidated here. The `mid` field matches the CSS variables
// declared in app/globals.css (--pearl-common / --pearl-fine /
// --pearl-royal) so JS-rendered surfaces and CSS-styled surfaces stay
// synchronised.

import type { PearlGrade } from "@/lib/store/progress";

export interface PearlTierStyle {
  /** CSS variable token — `var(--pearl-{grade})`. */
  cssVar: string;
  /** Dominant tier hex — matches the value of `cssVar`. */
  mid: string;
  /** Highlight tint used as the inner stop of radial gradients. */
  core: string;
  /** Deep outer tone for 3D pearl wells (chest-style rendering). */
  shadow: string;
  /** Semi-transparent halo for `box-shadow` glow. */
  glow: string;
  /** Pixel radius for the chest pearl well's box-shadow blur. */
  glowSize: number;
  /** Whether the chest well draws a saffron ring (royal only). */
  ring: boolean;
  /** Two-stop CSS radial-gradient for thumbnails (strip / ceremony / tapestry rows). */
  simpleGradient: string;
  /** `[innerStop, outerStop]` hex pair for canvas radial gradients in exportPng. */
  exportPair: [string, string];
}

export const PEARL_TIERS: Record<PearlGrade, PearlTierStyle> = {
  common: {
    cssVar: "var(--pearl-common)",
    mid: "#F4EBDC",
    core: "#FFFFFF",
    shadow: "#5C4022",
    glow: "rgba(244,235,220,0.55)",
    glowSize: 8,
    ring: false,
    simpleGradient: "radial-gradient(circle at 30% 30%, #FFFFFF, #F4EBDC)",
    exportPair: ["#FFFFFF", "#F4EBDC"],
  },
  fine: {
    cssVar: "var(--pearl-fine)",
    mid: "#F2C7C3",
    core: "#FFFFFF",
    shadow: "#6B2A1E",
    glow: "rgba(242,199,195,0.7)",
    glowSize: 14,
    ring: false,
    simpleGradient: "radial-gradient(circle at 30% 30%, #FFFFFF, #F2C7C3)",
    exportPair: ["#FFFFFF", "#F2C7C3"],
  },
  royal: {
    cssVar: "var(--pearl-royal)",
    mid: "#F4D77A",
    core: "#FFEFD3",
    shadow: "#5A3E0E",
    glow: "rgba(244,200,90,0.85)",
    glowSize: 22,
    ring: true,
    simpleGradient: "radial-gradient(circle at 30% 30%, #FFEFD3, #F4D77A)",
    exportPair: ["#FFEFD3", "#F4D77A"],
  },
};
