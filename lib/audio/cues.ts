"use client";

// Cue catalog — every named sound effect in the app composed from the synth
// primitives. Call `playCue("loom.thump")` from anywhere; the bus respects
// the audioEnabled setting and won't play unless the user has opted in.

import { getBus, isAudioEnabled, resumeIfSuspended } from "./bus";
import { bell, chord, noise, tone } from "./synth";

export type CueId =
  | "loom.thump"
  | "loom.shimmer"
  | "pearl.ping"
  | "pearl.royal"
  | "dive.splash"
  | "ui.tap"
  | "achievement.unlock"
  | "ceremony.heirloom";

export function playCue(id: CueId) {
  if (!isAudioEnabled()) return;
  const bus = getBus();
  if (!bus) return;
  resumeIfSuspended();

  switch (id) {
    case "loom.thump": {
      // Wooden hit on a row weave — short low-pass noise burst with a
      // muted thump tone underneath for body.
      noise({
        dur: 0.04,
        attack: 0.002,
        release: 0.18,
        gain: 0.32,
        filterType: "lowpass",
        filterFreq: 320,
        filterFreqEnd: 90,
        filterQ: 1.2,
      });
      tone({
        freq: 92,
        dur: 0.04,
        type: "sine",
        attack: 0.001,
        release: 0.22,
        gain: 0.22,
      });
      break;
    }
    case "loom.shimmer": {
      // Soft bell used for milestones (lesson unlock, achievement).
      bell({ freq: 1320, dur: 0.5, gain: 0.13 });
      bell({ freq: 1980, dur: 0.4, gain: 0.07, startAt: 0.04 });
      break;
    }
    case "pearl.ping": {
      // Glass chime on pearl collect.
      bell({ freq: 1100, dur: 0.7, gain: 0.18 });
      break;
    }
    case "pearl.royal": {
      // Royal pearl flourish — fundamental + perfect fifth + octave.
      chord([660, 990, 1320], 1.2, 0.14);
      bell({ freq: 1980, dur: 0.6, gain: 0.08, startAt: 0.18 });
      break;
    }
    case "dive.splash": {
      // Filtered noise sweeping down — water entry.
      noise({
        dur: 0.12,
        attack: 0.005,
        release: 0.5,
        gain: 0.28,
        filterType: "lowpass",
        filterFreq: 2400,
        filterFreqEnd: 220,
        filterQ: 0.7,
      });
      break;
    }
    case "ui.tap": {
      // Small wood-tick on primary CTAs.
      noise({
        dur: 0.012,
        attack: 0.001,
        release: 0.05,
        gain: 0.18,
        filterType: "highpass",
        filterFreq: 1800,
        filterQ: 0.8,
      });
      break;
    }
    case "achievement.unlock": {
      // Two-bell rising arpeggio + soft thump under.
      bell({ freq: 660, dur: 0.5, gain: 0.16 });
      bell({ freq: 990, dur: 0.6, gain: 0.14, startAt: 0.12 });
      bell({ freq: 1320, dur: 0.7, gain: 0.12, startAt: 0.24 });
      tone({
        freq: 110,
        dur: 0.05,
        type: "sine",
        attack: 0.002,
        release: 0.28,
        gain: 0.16,
      });
      break;
    }
    case "ceremony.heirloom": {
      // Layered chord + low drone — the emotional payoff cue. ~3 s total.
      tone({
        freq: 110,
        dur: 0.4,
        type: "sine",
        attack: 0.4,
        release: 2.2,
        gain: 0.18,
      });
      chord([330, 495, 660], 1.4, 0.13, 0.05);
      chord([660, 990, 1320], 1.6, 0.11, 0.55);
      bell({ freq: 1980, dur: 1.2, gain: 0.09, startAt: 1.05 });
      bell({ freq: 2640, dur: 1.0, gain: 0.07, startAt: 1.45 });
      break;
    }
  }
}
