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
        className="braid-scroll"
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
          <button onClick={() => router.push("/tapestry?from=chest")} className="anim-btn">
            {t("weave.viewTapestry")} {lang === "ar" ? "←" : "→"}
          </button>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .braid-scroll {
            justify-content: flex-start !important;
            padding-top: 124px !important;
          }
        }
        @media (max-width: 640px) {
          .braid-scroll {
            padding-top: 132px !important;
          }
        }
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
          <stop offset="0%" stopColor="#F4D77A" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#E8A33D" stopOpacity="1" />
          <stop offset="100%" stopColor="#B5341E" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="bk_skin" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#C9956A" />
          <stop offset="100%" stopColor="#7A4A2E" />
        </linearGradient>
        <linearGradient id="bk_seaSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C26A60" />
          <stop offset="40%" stopColor="#8E4F4D" />
          <stop offset="60%" stopColor="#0E5E7B" />
          <stop offset="100%" stopColor="#062436" />
        </linearGradient>
        <radialGradient id="bk_tentGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(232,163,61,0.25)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id="bk_sunGlow" cx="50%" cy="40%">
          <stop offset="0%" stopColor="rgba(244,215,122,0.4)" />
          <stop offset="100%" stopColor="rgba(194,106,96,0)" />
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Split background: sea/sunset (Saif's world) | tent interior (Layla's world) */}
      <rect x="0" y="0" width="200" height="280" fill="url(#bk_seaSky)" />
      <circle cx="100" cy="140" r="140" fill="url(#bk_sunGlow)" />
      
      {/* Stars on the sea side */}
      {[ [30, 40], [80, 20], [150, 50], [60, 70], [180, 30] ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={(i % 3) * 0.5 + 1} fill="#FFE9C2" opacity="0.6">
           {active && <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />}
        </circle>
      ))}

      <rect x="200" y="0" width="200" height="280" fill="#1A130D" />
      <circle cx="300" cy="140" r="140" fill="url(#bk_tentGlow)" />
      
      <line
        x1="200"
        y1="0"
        x2="200"
        y2="280"
        stroke="rgba(232,163,61,0.3)"
        strokeWidth="2"
        strokeDasharray="4 6"
      />

      {/* === Saif side (left): standing on dhow with pearl === */}
      <g transform="translate(70 180)">
        {/* Dhow */}
        <path d="M -60 30 Q -20 45 60 30 C 50 20 -50 20 -60 30 Z" fill="#2A1C12" />
        <path d="M -60 30 Q -20 40 60 30 L 60 32 Q -20 45 -60 32 Z" fill="#150E09" />
        <line x1="0" y1="-50" x2="0" y2="30" stroke="#4A2D16" strokeWidth="2.5" />
        <path d="M 0 -45 Q 40 -20 30 5 Q 15 -10 0 5 Z" fill="#E8D1A7" opacity="0.85" />
        
        {/* Saif */}
        <g transform="translate(-14 -20)">
          <path d="M -10 0 Q -12 25 -10 40 L 10 40 Q 12 25 10 0 Q 5 -5 0 -5 Q -5 -5 -10 0 Z" fill="#E5D6B6" />
          <ellipse cx="0" cy="-12" rx="7" ry="7" fill="url(#bk_skin)" />
          <path d="M -10 -18 Q -10 -25 0 -25 Q 10 -25 10 -18 Q 10 -12 8 -10 L -8 -10 Q -10 -12 -10 -18 Z" fill="#F0E4C9" />
          <line x1="-8" y1="-17" x2="8" y2="-17" stroke="#1A1410" strokeWidth="1" />
          {/* Arm extending pearl */}
          <path d="M 10 6 Q 22 -6 32 -18" stroke="#E5D6B6" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <circle cx="32" cy="-18" r="3" fill="url(#bk_skin)" />
        </g>
        <text
          x="0"
          y="60"
          textAnchor="middle"
          fill="#F4D77A"
          fontSize="10"
          letterSpacing="3"
          fontFamily="var(--font-cormorant), serif"
          opacity="0.8"
        >
          SAIF
        </text>
      </g>

      {/* === Layla side (right): seated at loom, hand reaching === */}
      <g transform="translate(320 180)">
        {/* Loom */}
        <rect x="-52" y="-82" width="104" height="8" rx="2" fill="#4A2D16" />
        <rect x="-52" y="40" width="104" height="8" rx="2" fill="#4A2D16" />
        <rect x="-56" y="-82" width="8" height="130" rx="2" fill="#3A2110" />
        <rect x="48" y="-82" width="8" height="130" rx="2" fill="#3A2110" />
        {[-42, -28, -14, 0, 14, 28, 42].map((x) => (
          <line
            key={x}
            x1={x}
            y1="-74"
            x2={x}
            y2="40"
            stroke="#D9C49C"
            strokeWidth="0.8"
            opacity="0.5"
          />
        ))}
        <rect x="-48" y="16" width="96" height="24" fill="#1B2D5C" />
        <rect x="-48" y="-4" width="96" height="20" fill="#B5341E" />
        <rect
          x="-48"
          y="-24"
          width="96"
          height="20"
          fill={stage === 2 ? "#E8A33D" : "rgba(232,163,61,0.25)"}
          stroke={stage === 2 ? "#F4B860" : "rgba(232,163,61,0.5)"}
          strokeWidth={stage === 2 ? 2 : 1}
          strokeDasharray={stage === 2 ? "0" : "4 2"}
        />
        
        {/* Layla */}
        <g transform="translate(-32 60)">
          <path
            d="M -16 -22 Q -18 2 -14 24 L 14 24 Q 18 2 16 -22 Q 8 -28 0 -28 Q -8 -28 -16 -22 Z"
            fill="#1B2D5C"
          />
          <ellipse cx="0" cy="-34" rx="9" ry="10" fill="url(#bk_skin)" />
          <path
            d="M -12 -42 Q -12 -52 0 -52 Q 12 -52 12 -42 Q 12 -32 10 -28 L -10 -28 Q -12 -32 -12 -42 Z"
            fill="#B5341E"
          />
          <path
            d={stage >= 1 ? "M 12 -12 Q 24 -32 38 -54" : "M 12 -12 Q 18 0 22 10"}
            stroke="#1B2D5C"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            style={{ transition: "all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)" }}
          />
          <circle
            cx={stage >= 1 ? 38 : 22}
            cy={stage >= 1 ? -54 : 10}
            r="3.5"
            fill="url(#bk_skin)"
            style={{ transition: "all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)" }}
          />
        </g>
        <text
          x="0"
          y="65"
          textAnchor="middle"
          fill="#F4D77A"
          fontSize="10"
          letterSpacing="3"
          fontFamily="var(--font-cormorant), serif"
          opacity="0.8"
        >
          LAYLA
        </text>
      </g>

      {/* Stage-specific overlays */}
      {stage === 0 && (
        <g>
          <circle cx="88" cy="142" r="8" fill="url(#bk_pearl)" filter="url(#glow)">
            {active && (
              <animate attributeName="r" values="7;10;7" dur="1s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="88" cy="142" r="16" fill="#F4D77A" opacity="0.25">
            {active && (
              <animate attributeName="r" values="12;22;12" dur="1s" repeatCount="indefinite" />
            )}
          </circle>
        </g>
      )}

      {stage === 1 && (
        <g>
          <path
            d="M 88 142 Q 200 10 326 186"
            stroke="url(#bk_trail)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
            filter="url(#glow)"
            strokeDasharray="400"
            strokeDashoffset={active ? "0" : "400"}
            style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
          />
          <circle cx="204" cy="87" r="10" fill="url(#bk_pearl)" filter="url(#glow)" />
          <circle cx="204" cy="87" r="20" fill="#F4D77A" opacity="0.3" />
        </g>
      )}

      {stage === 2 && (
        <g>
          <circle cx="320" cy="166" r="8" fill="url(#bk_pearl)" filter="url(#glow)" />
          <circle cx="320" cy="166" r="16" fill="#F4B860" opacity="0.4">
            {active && (
              <animate attributeName="r" values="12;20;12" dur="1.5s" repeatCount="indefinite" />
            )}
            {active && (
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite" />
            )}
          </circle>
          <path
            d="M 290 166 Q 305 156 320 166 Q 335 176 350 166"
            stroke="#F4B860"
            strokeWidth="2"
            fill="none"
            opacity="0.9"
          />
          <text
            x="320"
            y="200"
            textAnchor="middle"
            fill="#F4B860"
            fontSize="9"
            letterSpacing="2.5"
            fontFamily="var(--font-cormorant), serif"
            fontStyle="italic"
            filter="url(#glow)"
          >
            ROW WOVEN
          </text>
        </g>
      )}
    </svg>
  );
}
