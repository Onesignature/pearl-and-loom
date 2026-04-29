"use client";

// Audio bus — singleton AudioContext + master gain. All cues route through
// the master gain so one toggle mutes everything. The context is created
// lazily on the first playCue() call so it never violates the browser
// auto-play rule (which requires a prior user gesture).

import { useSettings } from "@/lib/store/settings";

interface AudioBus {
  ctx: AudioContext;
  master: GainNode;
}

let bus: AudioBus | null = null;

/** Lazily create (or reuse) the audio context and master gain. */
export function getBus(): AudioBus | null {
  if (typeof window === "undefined") return null;
  if (bus) return bus;
  const Ctx =
    (window.AudioContext as typeof AudioContext) ||
    (
      window as unknown as {
        webkitAudioContext: typeof AudioContext;
      }
    ).webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0.6;
  master.connect(ctx.destination);
  bus = { ctx, master };
  return bus;
}

/** True iff audio output should currently play, gated by the settings store. */
export function isAudioEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return useSettings.getState().audioEnabled;
}

/** Resume the context if it was suspended (browsers do this until a gesture). */
export function resumeIfSuspended() {
  const b = getBus();
  if (b && b.ctx.state === "suspended") {
    void b.ctx.resume();
  }
}
