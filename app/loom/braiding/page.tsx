"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";

const TIMINGS = [800, 600, 1200];

export default function BraidingPage() {
  const router = useRouter();
  const { t, fmt, lang } = useI18n();
  const pearls = useProgress((s) => s.pearls);
  const weavePearlIntoTapestry = useProgress((s) => s.weavePearlIntoTapestry);

  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [woven, setWoven] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => {
      if (phase < 2) {
        setPhase((p) => p + 1);
      } else {
        // commit the bead to the tapestry once the cinematic completes
        const nextPearl = pearls.find((p) => !p.wovenIntoTapestry);
        if (nextPearl && !woven) {
          weavePearlIntoTapestry(nextPearl.id, 6);
          setWoven(true);
        }
        setPlaying(false);
      }
    }, TIMINGS[phase]);
    return () => clearTimeout(id);
  }, [phase, playing, pearls, weavePearlIntoTapestry, woven]);

  function play() {
    setPhase(0);
    setWoven(false);
    setPlaying(true);
  }

  return (
    <TentScene>
      <TopChrome
        onBack={() => router.push("/sea/chest")}
        title={
          lang === "en"
            ? "Saif's pearl meets Layla's loom"
            : "لؤلؤة سيف تلتقي بنول ليلى"
        }
        subtitle={
          lang === "en" ? "BRAIDING THE FAMILY HEIRLOOM" : "ضفر الإرث"
        }
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 86,
          paddingBottom: 88,
          paddingInline: "clamp(16px, 3vw, 40px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ flex: "1 1 220px", minWidth: 220 }}>
              <div
                style={{
                  aspectRatio: "1.3",
                  background: "var(--charcoal-soft)",
                  border:
                    i === phase && playing
                      ? "2px solid var(--saffron)"
                      : "1px solid rgba(240,228,201,0.15)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <BraidKeyframe stage={i} active={i === phase && playing} />
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  color:
                    i === phase && playing
                      ? "var(--saffron)"
                      : "rgba(240,228,201,0.5)",
                  textTransform: "uppercase",
                }}
              >
                <span
                  className="font-display"
                  style={{ fontSize: 14, marginInlineEnd: 8 }}
                >
                  {fmt(i + 1)}
                </span>
                {i === 0 &&
                  (lang === "en"
                    ? "Saif offers his pearl · 800ms"
                    : "سيف يقدّم اللؤلؤة · ٨٠٠م.ث")}
                {i === 1 &&
                  (lang === "en"
                    ? "Sea → tent · Layla reaches · 600ms"
                    : "بحر ← خيمة · ٦٠٠م.ث")}
                {i === 2 &&
                  (lang === "en"
                    ? "Layla weaves it in · 1200ms"
                    : "ليلى تنسجها · ١٢٠٠م.ث")}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 32,
            display: "flex",
            justifyContent: "center",
            gap: 14,
          }}
        >
          <button onClick={play} className="anim-btn primary">
            ▶ {lang === "en" ? "PLAY SEQUENCE" : "تشغيل التسلسل"}
          </button>
          <button
            onClick={() => {
              setPlaying(false);
              setPhase((p) => (p + 1) % 3);
            }}
            className="anim-btn"
          >
            {t("weave.step")}
          </button>
          <button onClick={() => router.push("/tapestry")} className="anim-btn">
            {t("weave.viewTapestry")} {lang === "ar" ? "←" : "→"}
          </button>
        </div>
      </div>
      <style>{`
        .anim-btn {
          padding: 12px 22px;
          background: rgba(245,235,211,0.08);
          border: 1px solid rgba(240,228,201,0.25);
          color: var(--wool);
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          letter-spacing: 0.3em;
          cursor: pointer;
        }
        .anim-btn.primary {
          background: var(--saffron);
          color: var(--charcoal);
          border-color: var(--saffron);
        }
        .anim-btn:hover { background: rgba(245,235,211,0.16); }
        .anim-btn.primary:hover { background: var(--saffron-soft); }
      `}</style>
    </TentScene>
  );
}

function BraidKeyframe({ stage, active }: { stage: number; active: boolean }) {
  // Stage 0: Saif (left, on dhow at sunset) holds out his pearl
  // Stage 1: Pearl arcs from sea → tent across the seam, Layla reaches up
  // Stage 2: Pearl nestled in Layla's woven row, threads bind it ("ROW WOVEN")
  return (
    <svg
      viewBox="0 0 400 280"
      style={{ width: "100%", height: "100%" }}
      className="ltr-internal"
    >
      <defs>
        <radialGradient id="bk_pearl" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F4D77A" />
          <stop offset="100%" stopColor="#A87A2A" />
        </radialGradient>
        <linearGradient id="bk_trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0E5E7B" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#E8A33D" />
          <stop offset="100%" stopColor="#B5341E" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="bk_skin" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#C9956A" />
          <stop offset="100%" stopColor="#7A4A2E" />
        </linearGradient>
        <linearGradient id="bk_seaSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C26A60" />
          <stop offset="60%" stopColor="#0E5E7B" />
          <stop offset="100%" stopColor="#062436" />
        </linearGradient>
      </defs>

      {/* Split background: sea/sunset (Saif's world) | tent interior (Layla's world) */}
      <rect x="0" y="0" width="200" height="280" fill="url(#bk_seaSky)" />
      <rect x="200" y="0" width="200" height="280" fill="#1A130D" />
      <ellipse cx="300" cy="140" rx="120" ry="100" fill="#F4B860" opacity="0.14" />
      <line
        x1="200"
        y1="0"
        x2="200"
        y2="280"
        stroke="rgba(244,184,96,0.18)"
        strokeDasharray="3 4"
      />
      {[
        [40, 50],
        [80, 30],
        [140, 60],
        [60, 80],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1" fill="#FFE9C2" opacity="0.6" />
      ))}

      {/* === Saif side (left): standing on dhow with pearl === */}
      <g transform="translate(70 180)">
        <path d="M -50 30 Q -30 40 50 38 L 60 30 L -60 30 Z" fill="#3D2A1E" />
        <line x1="0" y1="-40" x2="0" y2="30" stroke="#5A3618" strokeWidth="1.5" />
        <path d="M 0 -36 L 30 -10 L 0 -10 Z" fill="#D9C49C" opacity="0.85" />
        <g transform="translate(-12 -20)">
          <path
            d="M -8 0 Q -10 22 -8 38 L 8 38 Q 10 22 8 0 Q 4 -4 0 -4 Q -4 -4 -8 0 Z"
            fill="#F0E4C9"
          />
          <ellipse cx="0" cy="-10" rx="6" ry="6" fill="url(#bk_skin)" />
          <path
            d="M -8 -16 Q -8 -22 0 -22 Q 8 -22 8 -16 Q 8 -10 6 -8 L -6 -8 Q -8 -10 -8 -16 Z"
            fill="#F0E4C9"
          />
          <line x1="-7" y1="-15" x2="7" y2="-15" stroke="#1A1410" strokeWidth="0.8" />
          <path
            d="M 8 4 Q 18 -8 24 -22"
            stroke="#F0E4C9"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="24" cy="-22" r="2.5" fill="url(#bk_skin)" />
        </g>
        <text
          x="0"
          y="55"
          textAnchor="middle"
          fill="#F4D77A"
          fontSize="9"
          letterSpacing="2.4"
          fontFamily="serif"
        >
          SAIF
        </text>
      </g>

      {/* === Layla side (right): seated at loom, hand reaching === */}
      <g transform="translate(320 180)">
        <rect x="-50" y="-80" width="100" height="6" fill="#5A3618" />
        <rect x="-50" y="40" width="100" height="6" fill="#5A3618" />
        <rect x="-54" y="-80" width="6" height="126" fill="#5A3618" />
        <rect x="48" y="-80" width="6" height="126" fill="#5A3618" />
        {[-40, -28, -16, -4, 8, 20, 32, 44].map((x) => (
          <line
            key={x}
            x1={x}
            y1="-74"
            x2={x}
            y2="40"
            stroke="#D9C49C"
            strokeWidth="0.5"
            opacity="0.6"
          />
        ))}
        <rect x="-48" y="20" width="96" height="20" fill="#1B2D5C" />
        <rect x="-48" y="0" width="96" height="20" fill="#B5341E" />
        <rect
          x="-48"
          y="-20"
          width="96"
          height="20"
          fill={stage === 2 ? "#E8A33D" : "rgba(232,163,61,0.18)"}
          stroke={stage === 2 ? "#F4B860" : "rgba(232,163,61,0.4)"}
          strokeWidth={stage === 2 ? 1.5 : 0.6}
          strokeDasharray={stage === 2 ? "0" : "3 2"}
        />
        <g transform="translate(-30 60)">
          <path
            d="M -14 -20 Q -16 0 -12 20 L 12 20 Q 16 0 14 -20 Q 8 -24 0 -24 Q -8 -24 -14 -20 Z"
            fill="#1B2D5C"
          />
          <ellipse cx="0" cy="-30" rx="8" ry="9" fill="url(#bk_skin)" />
          <path
            d="M -10 -36 Q -10 -44 0 -44 Q 10 -44 10 -36 Q 10 -28 8 -24 L -8 -24 Q -10 -28 -10 -36 Z"
            fill="#B5341E"
          />
          <path
            d={stage >= 1 ? "M 10 -10 Q 22 -28 32 -50" : "M 10 -10 Q 14 0 18 8"}
            stroke="#1B2D5C"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            style={{ transition: "all 0.6s ease" }}
          />
          <circle
            cx={stage >= 1 ? 32 : 18}
            cy={stage >= 1 ? -50 : 8}
            r="3"
            fill="url(#bk_skin)"
            style={{ transition: "all 0.6s ease" }}
          />
        </g>
        <text
          x="0"
          y="65"
          textAnchor="middle"
          fill="#F4D77A"
          fontSize="9"
          letterSpacing="2.4"
          fontFamily="serif"
        >
          LAYLA
        </text>
      </g>

      {/* Stage-specific overlays */}
      {stage === 0 && (
        <g>
          <circle cx="82" cy="138" r="8" fill="url(#bk_pearl)">
            {active && (
              <animate
                attributeName="r"
                values="6;9;6"
                dur="0.8s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle cx="82" cy="138" r="14" fill="#F4D77A" opacity="0.18">
            {active && (
              <animate
                attributeName="r"
                values="10;18;10"
                dur="0.8s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        </g>
      )}

      {stage === 1 && (
        <g>
          <path
            d="M 82 138 Q 200 30 318 130"
            stroke="url(#bk_trail)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.85"
            strokeDasharray="240"
            strokeDashoffset={active ? "0" : "240"}
            style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
          />
          {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((tt, i) => {
            const x = 82 + (318 - 82) * tt;
            const y = 138 - 110 * Math.sin(tt * Math.PI);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={2.4 - i * 0.2}
                fill={tt < 0.5 ? "#0E5E7B" : "#B5341E"}
                opacity={0.7 - i * 0.05}
              />
            );
          })}
          <circle cx="200" cy="40" r="9" fill="url(#bk_pearl)" />
          <circle cx="200" cy="40" r="14" fill="#F4D77A" opacity="0.3" />
        </g>
      )}

      {stage === 2 && (
        <g>
          <circle cx="306" cy="160" r="7" fill="url(#bk_pearl)" />
          <circle cx="306" cy="160" r="13" fill="#F4B860" opacity="0.4">
            {active && (
              <animate
                attributeName="r"
                values="10;18;10"
                dur="1.2s"
                repeatCount="indefinite"
              />
            )}
            {active && (
              <animate
                attributeName="opacity"
                values="0.5;0.1;0.5"
                dur="1.2s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <path
            d="M 280 160 Q 293 152 306 160 Q 319 168 332 160"
            stroke="#F4B860"
            strokeWidth="1.4"
            fill="none"
            opacity="0.85"
          />
          <line
            x1="272"
            y1="160"
            x2="266"
            y2="160"
            stroke="#F4B860"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="340"
            y1="160"
            x2="346"
            y2="160"
            stroke="#F4B860"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text
            x="306"
            y="195"
            textAnchor="middle"
            fill="#F4B860"
            fontSize="8"
            letterSpacing="2.2"
            fontFamily="serif"
            fontStyle="italic"
          >
            ROW WOVEN
          </text>
        </g>
      )}
    </svg>
  );
}
