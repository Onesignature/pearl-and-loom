interface SeaSceneProps {
  time?: "dawn" | "night";
  children?: React.ReactNode;
}

export function SeaScene({ time = "dawn", children }: SeaSceneProps) {
  const bg =
    time === "dawn"
      ? "linear-gradient(to bottom, #F4B860 0%, #E07856 18%, #6B4A8C 38%, #0E5E7B 60%, #051E2C 100%)"
      : "linear-gradient(to bottom, #051E2C 0%, #08374A 100%)";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100dvh",
        background: bg,
        overflow: "hidden",
      }}
    >
      {/* Sun */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          insetInlineEnd: "12%",
          top: "8%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #FFEFD3 0%, #F4B860 60%, transparent 80%)",
          boxShadow: "0 0 80px 20px rgba(244,184,96,0.4)",
        }}
      />
      {/* Distant horizon dhows */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: "32%",
          left: 0,
          width: "100%",
          height: 40,
          pointerEvents: "none",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1366 40"
      >
        <g opacity="0.6">
          <path
            d="M 200 28 L 240 28 L 236 36 L 204 36 Z M 220 28 L 220 8 L 232 28 Z"
            fill="#2A1810"
          />
        </g>
        <g opacity="0.4">
          <path
            d="M 800 30 L 840 30 L 836 38 L 804 38 Z M 820 30 L 820 14 L 832 30 Z"
            fill="#2A1810"
          />
        </g>
      </svg>
      {/* Water ripples */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: "38%",
          left: 0,
          width: "100%",
          height: "62%",
          pointerEvents: "none",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1366 600"
      >
        {[0, 60, 120, 200, 300, 440].map((y, i) => (
          <path
            key={y}
            d={`M 0 ${y} Q 341 ${y - 4} 683 ${y} T 1366 ${y}`}
            stroke="#F4B860"
            strokeWidth="1"
            fill="none"
            opacity={0.5 - i * 0.06}
          />
        ))}
      </svg>
      {children}
    </div>
  );
}
