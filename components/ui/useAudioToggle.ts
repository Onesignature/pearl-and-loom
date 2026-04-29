"use client";

// Shared audio-toggle hook. The 🔊/🔇 chip lives in three nav surfaces
// (HomeHeader chip row, TopChrome chip row, MobileNav drawer settings) —
// each with its own class names. Centralising the state + toggle handler
// keeps the gesture-warmup + ui.tap cue logic in one place.

import { useSettings } from "@/lib/store/settings";
import { resumeIfSuspended } from "@/lib/audio/bus";
import { playCue } from "@/lib/audio/cues";

export function useAudioToggle(): {
  audioEnabled: boolean;
  toggle: () => void;
} {
  const audioEnabled = useSettings((s) => s.audioEnabled);
  const toggleAudio = useSettings((s) => s.toggleAudio);

  function toggle() {
    const next = !audioEnabled;
    toggleAudio();
    if (next) {
      // Re-enabling: warm up the AudioContext (browsers suspend it without
      // a user gesture) and play a faint click as feedback.
      resumeIfSuspended();
      playCue("ui.tap");
    }
  }

  return { audioEnabled, toggle };
}
