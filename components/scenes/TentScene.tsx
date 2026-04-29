"use client";

// Tent scene backdrop. Three time-of-day palettes — dusk (default), day,
// dawn — chosen via the `time` prop.

interface TentSceneProps {
  time?: "dusk" | "day" | "dawn";
  children?: React.ReactNode;
}

const PALETTE: Record<NonNullable<TentSceneProps["time"]>, string> = {
  dusk: "radial-gradient(ellipse 100% 80% at 50% 70%, #3D2A1E 0%, #1A130D 60%, #0A0805 100%)",
  day: "radial-gradient(ellipse 100% 80% at 50% 70%, #2A1810 0%, #0F0A06 70%, #050302 100%)",
  dawn: "radial-gradient(ellipse 100% 80% at 50% 75%, #4A2D1F 0%, #5C2D2A 30%, #2A1830 60%, #0E1228 100%)",
};

export function TentScene({ time = "dusk", children }: TentSceneProps) {
  const bg = PALETTE[time];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100dvh",
        background: bg,
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* Ambient lantern glow — left, large */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          insetInlineStart: "8%",
          top: "12%",
          width: 380,
          height: 380,
          background:
            time === "dawn"
              ? "radial-gradient(circle, rgba(244,184,96,0.18) 0%, rgba(232,120,86,0.10) 40%, transparent 70%)"
              : "radial-gradient(circle, rgba(244,184,96,0.32) 0%, rgba(232,163,61,0.08) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Ambient lantern glow — right, smaller */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          insetInlineEnd: "10%",
          bottom: "20%",
          width: 280,
          height: 280,
          background:
            "radial-gradient(circle, rgba(244,184,96,0.22) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Tent fabric drape */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "30%",
          pointerEvents: "none",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1366 300"
      >
        <path
          d="M 0 0 L 0 100 Q 200 70 400 90 Q 683 60 966 90 Q 1166 70 1366 100 L 1366 0 Z"
          fill="rgba(0,0,0,0.6)"
        />
        <path
          d="M 0 100 Q 200 70 400 90 Q 683 60 966 90 Q 1166 70 1366 100"
          stroke="#5A4030"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
      </svg>

      {/* Floor cushions hint */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "20%",
          pointerEvents: "none",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1366 200"
      >
        <ellipse cx="200" cy="200" rx="220" ry="40" fill="#8C2614" opacity="0.3" />
        <ellipse cx="1166" cy="200" rx="220" ry="40" fill="#1B2D5C" opacity="0.4" />
      </svg>

      {children}
    </div>
  );
}

