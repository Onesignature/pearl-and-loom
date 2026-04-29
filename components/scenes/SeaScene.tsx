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
      {/* ─────────────────────────────────────────────────────────── */}
      {/* SKY LAYERS — atmospheric depth from far → near                 */}

      {/* Distant warm haze — broad wash behind everything */}
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

      {/* Drifting wispy cloud band — slow lateral pan, far layer */}
      <svg
        aria-hidden
        className="sea-cloud sea-cloud-far"
        viewBox="0 0 1600 200"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: "8%",
          left: "-20%",
          width: "140%",
          height: "12%",
          pointerEvents: "none",
          opacity: 0.55,
        }}
      >
        <path
          d="M 60 120 Q 180 80 320 100 Q 500 80 680 110 Q 880 80 1080 110 Q 1260 80 1440 100 Q 1560 90 1600 100 L 1600 200 L 0 200 Z"
          fill="rgba(255,220,180,0.32)"
        />
        <path
          d="M 180 160 Q 360 130 540 150 Q 760 130 980 160 Q 1180 140 1380 160"
          stroke="rgba(255,232,200,0.4)"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Mid-layer cloud — slower drift for parallax depth */}
      <svg
        aria-hidden
        className="sea-cloud sea-cloud-mid"
        viewBox="0 0 1600 160"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: "16%",
          left: "-30%",
          width: "160%",
          height: "10%",
          pointerEvents: "none",
          opacity: 0.4,
        }}
      >
        <path
          d="M 0 100 Q 300 60 600 80 Q 900 50 1200 80 Q 1450 60 1600 70 L 1600 160 L 0 160 Z"
          fill="rgba(255,210,170,0.25)"
        />
      </svg>

      {/* Sun + bloom — wrapped so the bloom can pulse subtly */}
      <div
        aria-hidden
        className="sea-sun-wrap"
        style={{
          position: "absolute",
          insetInlineEnd: "14%",
          top: "10%",
          width: "clamp(80px, 8vw, 130px)",
          aspectRatio: "1",
        }}
      >
        <div
          aria-hidden
          className="sea-sun-disc"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #FFF4DD 0%, #FFD89A 35%, #F4B860 60%, transparent 78%)",
            boxShadow: "0 0 120px 40px rgba(255,212,150,0.45)",
          }}
        />
        {/* Soft outer corona — breathes slowly */}
        <div
          aria-hidden
          className="sea-sun-corona"
          style={{
            position: "absolute",
            inset: "-60%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,212,150,0.32) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* HORIZON & MID-DEPTH                                           */}

      {/* Birds — small V formation drifting slowly across the sky */}
      <svg
        aria-hidden
        className="sea-birds"
        viewBox="0 0 200 30"
        style={{
          position: "absolute",
          top: "18%",
          left: "10%",
          width: "180px",
          height: "20px",
          pointerEvents: "none",
          opacity: 0.55,
        }}
      >
        {[
          { x: 100, y: 14 },
          { x: 86, y: 18 },
          { x: 114, y: 18 },
          { x: 72, y: 22 },
          { x: 128, y: 22 },
          { x: 58, y: 26 },
          { x: 142, y: 26 },
        ].map((b, i) => (
          <path
            key={i}
            d={`M ${b.x - 5} ${b.y} Q ${b.x - 2.5} ${b.y - 2.5} ${b.x} ${b.y} Q ${b.x + 2.5} ${b.y - 2.5} ${b.x + 5} ${b.y}`}
            stroke="#3A2820"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            className={`sea-bird sea-bird-${i % 3}`}
          />
        ))}
      </svg>

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

      {/* Horizon haze — softens the seam where sky meets water */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          insetInlineStart: 0,
          insetInlineEnd: 0,
          top: "32%",
          height: "10%",
          background:
            "linear-gradient(to bottom, transparent, rgba(255,220,180,0.22), rgba(255,220,180,0.12), transparent)",
          pointerEvents: "none",
          filter: "blur(3px)",
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
        <g opacity="0.28">
          <path d="M 1220 44 L 1248 44 L 1245 50 L 1223 50 Z" fill="#2A1810" />
          <path d="M 1234 44 L 1234 30 L 1244 44 Z" fill="#3D2A1E" />
        </g>
      </svg>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SEA SURFACE                                                   */}

      {/* Water surface — animated ripples + sun-glints. The previous
          rectangular sun-path column is gone; the sparkles plus the
          existing sheen rect carry the reflection more naturally. */}
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
          {/* Sun-glint specular dots — small bright sparkles on the
              water surface, scattered across the sun path. */}
          <radialGradient id="seaGlint">
            <stop offset="0%" stopColor="#FFF4DD" stopOpacity="1" />
            <stop offset="60%" stopColor="#FFD89A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFD89A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Wave ripples — denser near surface, sparser deeper */}
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

        {/* Sun-glint sparkles — twinkle on the sun path */}
        {[
          { cx: 1100, cy: 60, r: 4, dur: 2.4 },
          { cx: 1180, cy: 120, r: 3, dur: 3.2 },
          { cx: 1060, cy: 180, r: 5, dur: 2.8 },
          { cx: 1140, cy: 240, r: 3, dur: 3.6 },
          { cx: 1200, cy: 320, r: 4, dur: 2.6 },
          { cx: 1080, cy: 400, r: 3, dur: 3.4 },
        ].map((g, i) => (
          <circle
            key={i}
            cx={g.cx}
            cy={g.cy}
            r={g.r}
            fill="url(#seaGlint)"
          >
            <animate
              attributeName="opacity"
              values="0.2;1;0.2"
              dur={`${g.dur}s`}
              repeatCount="indefinite"
              begin={`${i * 0.4}s`}
            />
          </circle>
        ))}

      </svg>

      {/* Mist on the water — soft fog rising from the horizon line */}
      <div
        aria-hidden
        className="sea-mist"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "38%",
          height: "8%",
          background:
            "linear-gradient(to bottom, rgba(240,232,210,0.20), rgba(240,232,210,0.08), transparent)",
          filter: "blur(6px)",
          pointerEvents: "none",
        }}
      />

      <style>{`
        /* Slow pan on cloud layers — different speeds give parallax. */
        .sea-cloud-far {
          animation: cloudDriftFar 110s linear infinite;
        }
        .sea-cloud-mid {
          animation: cloudDriftMid 160s linear infinite;
        }
        @keyframes cloudDriftFar {
          from { transform: translateX(0); }
          to { transform: translateX(-20%); }
        }
        @keyframes cloudDriftMid {
          from { transform: translateX(0); }
          to { transform: translateX(-15%); }
        }

        /* Birds drift across the sky on a long loop. The flock is one
           SVG so the whole formation moves together. */
        .sea-birds {
          animation: birdsDrift 70s linear infinite;
        }
        @keyframes birdsDrift {
          0% { transform: translateX(0); opacity: 0; }
          5% { opacity: 0.55; }
          90% { opacity: 0.55; }
          100% { transform: translateX(85vw); opacity: 0; }
        }
        /* Wing-flap — three subtle stagger groups so the flock isn't
           in lock-step. */
        .sea-bird {
          transform-box: fill-box;
          transform-origin: center;
        }
        .sea-bird-0 { animation: wingFlap 1.2s ease-in-out infinite; }
        .sea-bird-1 { animation: wingFlap 1.4s ease-in-out infinite 0.2s; }
        .sea-bird-2 { animation: wingFlap 1.1s ease-in-out infinite 0.4s; }
        @keyframes wingFlap {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5); }
        }

        /* Sun corona breathes on a slow cycle — gives the whole
           right side a living warmth without a hard column overlay. */
        .sea-sun-corona {
          animation: sunBreathe 8s ease-in-out infinite;
        }
        @keyframes sunBreathe {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }

        /* Mist drifts side to side gently. */
        .sea-mist {
          animation: mistDrift 14s ease-in-out infinite;
        }
        @keyframes mistDrift {
          0%, 100% { transform: translateX(0); opacity: 0.85; }
          50% { transform: translateX(-3%); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sea-cloud-far,
          .sea-cloud-mid,
          .sea-birds,
          .sea-bird-0,
          .sea-bird-1,
          .sea-bird-2,
          .sea-sun-corona,
          .sea-mist {
            animation: none !important;
          }
        }
      `}</style>

      {children}
    </div>
  );
}
