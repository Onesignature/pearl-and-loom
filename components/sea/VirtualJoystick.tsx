"use client";

// VirtualJoystick — small circular pad for touch / pointer drag.
// Reports a normalised direction vector (x, y in [-1, 1]) via the
// `onChange` callback. Returns to centre on release. Uses pointer
// events so it works for touch, stylus, and mouse uniformly.

import { useEffect, useRef, useState } from "react";

interface Vec2 {
  x: number;
  y: number;
}

interface Props {
  /** Pad outer diameter in px. Inner stick auto-scales to ~36% of this. */
  size?: number;
  /** Called continuously as the stick moves. (0,0) means centred. */
  onChange: (v: Vec2) => void;
}

export function VirtualJoystick({ size = 110, onChange }: Props) {
  const ringRef = useRef<HTMLDivElement>(null);
  const [stick, setStick] = useState<Vec2>({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  // Stable callback ref so the pointer handlers don't need to re-attach
  // every render (which would also re-fire onChange unnecessarily).
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const el = ringRef.current;
    if (!el) return;
    const radius = size / 2;
    let pointerId: number | null = null;

    function update(e: PointerEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = e.clientX - cx;
      let dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      // Clamp to ring radius — the stick can't leave the pad.
      if (dist > radius) {
        dx = (dx / dist) * radius;
        dy = (dy / dist) * radius;
      }
      setStick({ x: dx, y: dy });
      const nx = dx / radius;
      const ny = dy / radius;
      // Small dead-zone so resting fingers don't drift the avatar.
      const mag = Math.hypot(nx, ny);
      if (mag < 0.12) onChangeRef.current({ x: 0, y: 0 });
      else onChangeRef.current({ x: nx, y: ny });
    }

    function release(e: PointerEvent) {
      if (pointerId !== null && e.pointerId !== pointerId) return;
      pointerId = null;
      setActive(false);
      setStick({ x: 0, y: 0 });
      onChangeRef.current({ x: 0, y: 0 });
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    }

    function onDown(e: PointerEvent) {
      pointerId = e.pointerId;
      setActive(true);
      update(e);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", release);
    }

    function onMove(e: PointerEvent) {
      if (pointerId === null || e.pointerId !== pointerId) return;
      update(e);
    }

    el.addEventListener("pointerdown", onDown);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, [size]);

  const stickSize = Math.round(size * 0.36);

  return (
    <div
      ref={ringRef}
      className="vjoy"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className="vjoy-stick"
        style={{
          width: stickSize,
          height: stickSize,
          transform: `translate(${stick.x}px, ${stick.y}px)`,
          opacity: active ? 1 : 0.85,
        }}
      />
      <style>{`
        .vjoy {
          position: relative;
          border-radius: 50%;
          background: radial-gradient(
            circle at 35% 30%,
            rgba(244,184,96,0.18),
            rgba(8,55,74,0.45) 65%,
            rgba(8,55,74,0.7) 100%
          );
          border: 1.5px solid rgba(244,184,96,0.5);
          box-shadow:
            0 0 24px rgba(244,184,96,0.22),
            inset 0 1px 0 rgba(255,255,255,0.08);
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(6px);
        }
        .vjoy-stick {
          border-radius: 50%;
          background:
            radial-gradient(circle at 35% 30%, #FFE9B8, #F4B860 55%, #8C5A2E 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.4),
            0 4px 14px rgba(0,0,0,0.4);
          transition: transform 0.05s linear, opacity 0.2s ease;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
