"use client";

// Synth primitives — small Web Audio building blocks the cue recipes
// compose into named sound effects. No external sample files; everything
// is rendered live so the bundle stays lean and there's nothing to license.

import { getBus } from "./bus";

interface ToneOptions {
  freq: number;
  dur: number;
  type?: OscillatorType;
  attack?: number;
  release?: number;
  gain?: number;
  detune?: number;
  startAt?: number;
}

/** Fire a single oscillator with an attack-release envelope, scheduled at `startAt`. */
export function tone(opts: ToneOptions) {
  const bus = getBus();
  if (!bus) return;
  const { ctx, master } = bus;
  const t0 = (opts.startAt ?? 0) + ctx.currentTime;
  const attack = opts.attack ?? 0.01;
  const release = opts.release ?? 0.18;
  const gain = opts.gain ?? 0.18;
  const osc = ctx.createOscillator();
  osc.type = opts.type ?? "sine";
  osc.frequency.value = opts.freq;
  if (opts.detune) osc.detune.value = opts.detune;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, t0);
  env.gain.linearRampToValueAtTime(gain, t0 + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur + release);
  osc.connect(env);
  env.connect(master);
  osc.start(t0);
  osc.stop(t0 + opts.dur + release + 0.05);
}

interface NoiseOptions {
  dur: number;
  attack?: number;
  release?: number;
  gain?: number;
  filterType?: BiquadFilterType;
  filterFreq?: number;
  filterFreqEnd?: number;
  filterQ?: number;
  startAt?: number;
}

/** Burst of filtered white noise — used for thumps, splashes, and impact ticks. */
export function noise(opts: NoiseOptions) {
  const bus = getBus();
  if (!bus) return;
  const { ctx, master } = bus;
  const t0 = (opts.startAt ?? 0) + ctx.currentTime;
  const attack = opts.attack ?? 0.005;
  const release = opts.release ?? 0.12;
  const gain = opts.gain ?? 0.22;

  const totalDur = opts.dur + release;
  const buffer = ctx.createBuffer(
    1,
    Math.max(1, Math.ceil(ctx.sampleRate * totalDur)),
    ctx.sampleRate,
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = opts.filterType ?? "lowpass";
  filter.frequency.value = opts.filterFreq ?? 1200;
  filter.Q.value = opts.filterQ ?? 0.6;
  if (opts.filterFreqEnd != null) {
    filter.frequency.setValueAtTime(opts.filterFreq ?? 1200, t0);
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(40, opts.filterFreqEnd),
      t0 + opts.dur + release,
    );
  }

  const env = ctx.createGain();
  env.gain.setValueAtTime(0, t0);
  env.gain.linearRampToValueAtTime(gain, t0 + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur + release);

  src.connect(filter);
  filter.connect(env);
  env.connect(master);
  src.start(t0);
  src.stop(t0 + totalDur + 0.05);
}

interface BellOptions {
  freq: number;
  dur?: number;
  gain?: number;
  startAt?: number;
}

/** Glass-bell tone via fundamental + 2 inharmonic partials with quick decay. */
export function bell({ freq, dur = 0.6, gain = 0.16, startAt = 0 }: BellOptions) {
  const partials: { mul: number; gain: number; release: number }[] = [
    { mul: 1, gain: gain * 1.0, release: dur * 1.0 },
    { mul: 2.01, gain: gain * 0.5, release: dur * 0.7 },
    { mul: 3.03, gain: gain * 0.25, release: dur * 0.45 },
  ];
  for (const p of partials) {
    tone({
      freq: freq * p.mul,
      dur: 0.03,
      type: "sine",
      attack: 0.003,
      release: p.release,
      gain: p.gain,
      startAt,
    });
  }
}

/** Layered chord — pleasant when the partials are within an octave. */
export function chord(freqs: number[], dur = 0.8, gain = 0.14, startAt = 0) {
  for (const f of freqs) {
    bell({ freq: f, dur, gain, startAt });
  }
}
