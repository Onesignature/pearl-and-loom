interface SeaSceneProps {
  time?: "dawn" | "night";
  children?: React.ReactNode;
}

export function SeaScene({ time = "dawn", children }: SeaSceneProps) {
  const bg =
    time === "dawn"
      ? "linear-gradient(to bottom, #F8C977 0%, #F4A56B 12%, #C26A60 26%, #6B4A8C 40%, #2A4A70 55%, #0E5E7B 70%, #051E2C 100%)"
      : "linear-gradient(to bottom, #051E2C 0%, #08374A 100%)";

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
      {/* Atmospheric haze layer 1 — distant warm glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 40% at 50% 35%, rgba(255,220,180,0.35), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Sun + bloom */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          insetInlineEnd: "14%",
          top: "10%",
          width: "clamp(80px, 8vw, 130px)",
          aspectRatio: "1",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #FFF4DD 0%, #FFD89A 35%, #F4B860 60%, transparent 78%)",
          boxShadow: "0 0 120px 40px rgba(255,212,150,0.45)",
        }}
      />
      {/* Sun glare on water */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          insetInlineEnd: "8%",
          top: "38%",
          width: "clamp(120px, 14vw, 220px)",
          height: "clamp(60px, 8vw, 120px)",
          background: "radial-gradient(ellipse, rgba(255,212,150,0.4) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(8px)",
        }}
      />
      {/* Distant island silhouette */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: "30%",
          insetInlineStart: "5%",
          width: "30%",
          height: "8%",
          pointerEvents: "none",
          opacity: 0.45,
        }}
        preserveAspectRatio="none"
        viewBox="0 0 400 60"
      >
        <path
          d="M 0 60 Q 50 40 110 36 Q 180 28 240 32 Q 320 40 400 50 L 400 60 Z"
          fill="#3A4A5C"
        />
        <path
          d="M 0 60 Q 50 44 110 42 Q 180 36 240 40 Q 320 46 400 54 L 400 60 Z"
          fill="#5A6878"
          opacity="0.6"
        />
      </svg>
      {/* Atmospheric perspective haze stripe */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          insetInlineStart: 0,
          insetInlineEnd: 0,
          top: "32%",
          height: "8%",
          background:
            "linear-gradient(to bottom, transparent, rgba(255,220,180,0.18), transparent)",
          pointerEvents: "none",
          filter: "blur(2px)",
        }}
      />
      {/* Distant horizon dhows */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: "34%",
          left: 0,
          width: "100%",
          height: "5%",
          pointerEvents: "none",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1366 60"
      >
        <g opacity="0.55">
          <path d="M 240 38 L 290 38 L 285 50 L 245 50 Z" fill="#2A1810" />
          <path d="M 265 38 L 265 10 L 282 38 Z" fill="#3D2A1E" />
          <path d="M 265 14 L 282 38" stroke="#1A0E08" strokeWidth="0.8" />
        </g>
        <g opacity="0.35">
          <path d="M 920 42 L 960 42 L 956 50 L 924 50 Z" fill="#2A1810" />
          <path d="M 940 42 L 940 22 L 953 42 Z" fill="#3D2A1E" />
        </g>
      </svg>
      {/* Water surface — animated ripples + sun-reflection sheen */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          top: "40%",
          left: 0,
          width: "100%",
          height: "60%",
          pointerEvents: "none",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1366 600"
      >
        <defs>
          <linearGradient id="seaSheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4B860" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F4B860" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 18, 40, 70, 110, 160, 220, 290, 380, 480].map((y, i) => (
          <path
            key={y}
            d={`M 0 ${y} Q 200 ${y - 4 + (i % 2) * 2} 400 ${y} T 800 ${y} T 1200 ${y} T 1366 ${y}`}
            stroke="#FFD89A"
            strokeWidth={i < 3 ? 1.2 : 0.6}
            fill="none"
            opacity={0.6 - i * 0.05}
          >
            <animate
              attributeName="d"
              dur={`${4 + i * 0.5}s`}
              repeatCount="indefinite"
              values={`M 0 ${y} Q 200 ${y - 4} 400 ${y} T 800 ${y} T 1200 ${y} T 1366 ${y};M 0 ${y} Q 200 ${y + 3} 400 ${y} T 800 ${y} T 1200 ${y} T 1366 ${y};M 0 ${y} Q 200 ${y - 4} 400 ${y} T 800 ${y} T 1200 ${y} T 1366 ${y}`}
            />
          </path>
        ))}
        <rect x="1080" y="0" width="160" height="600" fill="url(#seaSheen)" opacity="0.4" />
      </svg>
      {children}
    </div>
  );
}
