"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { SeaScene } from "@/components/scenes/SeaScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { SaifOnDeck, Stone } from "@/components/portraits/Portraits";
import { playCue } from "@/lib/audio/cues";
import type { DiveDef } from "@/app/sea/page";

export function PreDive({ dive }: { dive: DiveDef }) {
  const router = useRouter();
  const { t, fmt, lang } = useI18n();
  const [stones, setStones] = useState(3);

  const optimal = Math.max(2, Math.round(dive.depth / 3));
  const status: "under" | "good" | "over" =
    stones < optimal - 1 ? "under" : stones > optimal + 1 ? "over" : "good";

  const breath = 60;

  return (
    <SeaScene>
      <TopChrome
        onBack={() => router.push("/sea")}
        title={t("predive.title")}
        subtitle={`${t(`sea.titles.${dive.key}` as never).toUpperCase()} · ${fmt(dive.depth)}M`}
      />
      <div className="predive-stage">
        {/* Saif's dhow scene anchored flush bottom-left of the viewport.
            Position: absolute so it bleeds past parent padding to the screen edge. */}
        <div className="predive-deck">
          <SaifOnDeck />
        </div>
        <div className="predive-loadout">
          <div
            className="font-display"
            style={{
              fontSize: 11,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "var(--sunset-gold)",
            }}
          >
            {t("predive.loadout")}
          </div>
          <div
            style={{
              fontFamily:
                lang === "ar"
                  ? "var(--font-tajawal), sans-serif"
                  : "var(--font-cormorant), serif",
              fontSize: "clamp(22px, 2.4vw, 32px)",
              color: "var(--foam)",
              letterSpacing: "0.04em",
              marginTop: 4,
              lineHeight: 1.1,
            }}
          >
            {t("predive.chooseStone")}
          </div>

          <div className="predive-howto" role="note">
            <span className="predive-howto-eyebrow">
              {lang === "en" ? "How to play" : "كيف تلعب"}
            </span>
            <span className="predive-howto-body">
              {lang === "en"
                ? "Tap a stone. Heavier sinks faster — but uses more breath. Watch the force diagram to find the balance."
                : "اضغط على حجر. الأثقل يهبط أسرع — لكنّه يستهلك نفسًا أكثر. راقب مخطط القوى لتجد التوازن."}
            </span>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setStones(n)}
                  className={`stone-btn${stones === n ? " active" : ""}`}
                  aria-pressed={stones === n}
                >
                  <Stone size={n * 4 + 12} />
                  <div
                    style={{
                      fontSize: 10,
                      marginTop: 3,
                      fontFamily: "var(--font-cormorant), serif",
                    }}
                  >
                    {fmt(n)} <span style={{ opacity: 0.6 }}>{t("predive.kg")}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 170px",
              gap: 18,
              minHeight: 0,
            }}
          >
            <div className="paper-bg" style={{ padding: 14 }}>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--ink-soft)",
                  marginBottom: 8,
                }}
              >
                {t("predive.forceDiagram")}
              </div>
              <div style={{ width: "84%", margin: "0 auto" }}>
                <ForceDiagram stones={stones} status={status} />
              </div>
            </div>
            <div className="paper-bg" style={{ padding: 12, textAlign: "center" }}>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--ink-soft)",
                }}
              >
                {t("dive.breath")}
              </div>
              <BreathRing seconds={breath} />
              <div style={{ fontSize: 10, color: "var(--ink-soft)", marginTop: 0 }}>
                {t("predive.capacity")}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playCue("dive.splash");
              router.push(`/sea/dives/${dive.key}/dive?stones=${stones}`);
            }}
            className="dive-btn"
          >
            {t("predive.dive")}
          </button>
        </div>
      </div>
      <style>{`
        .predive-stage {
          position: absolute;
          inset: 0;
          padding-top: 86px;
          padding-bottom: 18px;
          padding-inline: 28px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .predive-deck {
          position: absolute;
          inset-inline-start: 0;
          bottom: 0;
          top: 86px;
          width: 320px;
          pointer-events: none;
        }
        .predive-loadout {
          flex: 1;
          color: var(--foam);
          min-width: 0;
          display: flex;
          flex-direction: column;
          margin-inline-start: 300px;
        }
        @media (max-width: 900px) {
          .predive-stage {
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            padding-inline: 20px;
            padding-bottom: 0;
            overflow-y: auto;
            gap: 16px;
          }
          .predive-deck {
            /* Full-width band; Saif's portrait sits centered inside it at the
               SVG's natural 360:540 aspect (so his head doesn't get cropped).
               A deck-wood gradient extends edge-to-edge so the shore reads as
               ground spanning the viewport. */
            position: relative;
            inset: auto;
            width: 100%;
            max-width: none;
            margin-inline: -20px;
            height: auto;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            flex: 0 0 auto;
            order: 2;
            background:
              linear-gradient(to bottom,
                transparent 0%,
                transparent 60%,
                rgba(96, 60, 32, 0.4) 76%,
                rgba(60, 38, 22, 0.78) 90%,
                rgba(31, 20, 10, 0.95) 100%);
          }
          .predive-deck > svg {
            width: 100% !important;
            height: auto !important;
            max-width: 320px;
            aspect-ratio: 360 / 540;
            display: block;
            margin: 0 auto;
          }
          .predive-loadout {
            margin-inline-start: 0;
            flex: 1 1 auto;
            order: 1;
          }
        }
        .predive-howto {
          margin-top: 12px;
          padding: 12px 14px;
          background: linear-gradient(180deg, rgba(244,184,96,0.16) 0%, rgba(244,184,96,0.06) 100%);
          border: 1px solid rgba(244,184,96,0.42);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: var(--foam);
        }
        .predive-howto-eyebrow {
          font-family: var(--font-cormorant), serif;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--sunset-gold);
          opacity: 0.92;
        }
        .predive-howto-body {
          font-size: 14px;
          color: var(--foam);
          line-height: 1.55;
          opacity: 0.92;
        }
        .stone-btn {
          background: rgba(8, 30, 44, 0.55);
          border: 1.5px solid rgba(244, 184, 96, 0.35);
          border-radius: 16px;
          color: var(--foam);
          padding: 8px 4px;
          cursor: pointer;
          transition: all 0.3s var(--ease-water);
          font-family: var(--font-tajawal), sans-serif;
          flex: 1;
          backdrop-filter: blur(6px);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }
        .stone-btn:hover {
          background: rgba(8, 30, 44, 0.75);
          border-color: rgba(244, 184, 96, 0.6);
        }
        .stone-btn.active {
          border-color: var(--sunset-gold);
          background: rgba(244, 184, 96, 0.22);
          box-shadow:
            0 0 0 1px var(--sunset-gold),
            0 6px 22px rgba(244, 184, 96, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        .dive-btn {
          margin-top: 18px;
          padding: 18px 56px;
          align-self: flex-start;
          background: var(--sunset-gold);
          color: var(--sea-deep);
          border: none;
          font-family: var(--font-cormorant), serif;
          font-size: 18px;
          letter-spacing: 0.45em;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s var(--ease-water);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }
        .dive-btn:hover {
          background: #FFD080;
          transform: translateY(2px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
        }
        @media (max-width: 640px) {
          .dive-btn { align-self: center !important; }
        }
      `}</style>
    </SeaScene>
  );
}

function ForceDiagram({
  stones,
  status,
}: {
  stones: number;
  status: "under" | "good" | "over";
}) {
  // Compact technical schematic: free-body diagram of buoyancy ↑ vs weight ↓ on
  // the left, balance scale on the right that tilts based on net force, and a
  // status pill at the bottom. Weight arrow length is clamped so it never
  // escapes the card even at the heaviest stone setting.
  const { lang } = useI18n();
  const BUOY = 22;
  const WEIGHT_RAW = stones * 6 + 8;
  const WEIGHT = Math.min(WEIGHT_RAW, 36);
  const net = WEIGHT_RAW - BUOY;
  const tilt = Math.max(-12, Math.min(12, net * 0.45));

  const inkSoft = "rgba(60,40,20,0.55)";
  const upColor = "#0E5E7B";
  const downColor = "#B5341E";
  const okColor = "#7A8A4E";
  const statusColor =
    status === "good" ? okColor : status === "under" ? upColor : downColor;

  const statusLabel =
    status === "good"
      ? lang === "en"
        ? "BALANCED · SINKS GENTLY"
        : "متوازن · ينزل بهدوء"
      : status === "under"
        ? lang === "en"
          ? "TOO LIGHT · WILL FLOAT UP"
          : "خفيف · يطفو"
        : lang === "en"
          ? "TOO HEAVY · SINKS TOO FAST"
          : "ثقيل · ينزل بسرعة";

  return (
    <svg
      viewBox="0 0 220 110"
      style={{ width: "100%", display: "block" }}
      className="ltr-internal"
    >
      <defs>
        <marker
          id="arrUp"
          viewBox="0 0 10 10"
          refX="5"
          refY="0"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 8 L 5 0 L 10 8 Z" fill={upColor} />
        </marker>
        <marker
          id="arrDown"
          viewBox="0 0 10 10"
          refX="5"
          refY="10"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 2 L 5 10 L 10 2 Z" fill={downColor} />
        </marker>
      </defs>

      {/* Free-body diagram on the left */}
      <g transform="translate(50 50)">
        <circle cx="0" cy="-16" r="5" fill="none" stroke={inkSoft} strokeWidth="1" />
        <path
          d="M -7 -11 Q -9 4 -5 16 L 5 16 Q 9 4 7 -11 Z"
          fill="none"
          stroke={inkSoft}
          strokeWidth="1"
        />
        <circle cx="0" cy="0" r="1.6" fill="#3D2A1E" />
        <line
          x1="0"
          y1="-2"
          x2="0"
          y2={-BUOY - 4}
          stroke={upColor}
          strokeWidth="1.6"
          markerEnd="url(#arrUp)"
        />
        <text
          x="6"
          y={-BUOY - 2}
          fill={upColor}
          fontSize="7"
          fontFamily="serif"
          letterSpacing="0.8"
        >
          F
          <tspan fontSize="5" dy="1">
            b
          </tspan>
        </text>
        <line
          x1="0"
          y1="2"
          x2="0"
          y2={WEIGHT + 4}
          stroke={downColor}
          strokeWidth="1.6"
          markerEnd="url(#arrDown)"
        />
        <text
          x="6"
          y={WEIGHT - 2}
          fill={downColor}
          fontSize="7"
          fontFamily="serif"
          letterSpacing="0.8"
        >
          F
          <tspan fontSize="5" dy="1">
            w
          </tspan>
        </text>
      </g>

      {/* Vertical separator */}
      <line
        x1="105"
        y1="14"
        x2="105"
        y2="92"
        stroke={inkSoft}
        strokeWidth="0.5"
        strokeDasharray="2 2"
      />

      {/* Balance scale on the right */}
      <g transform="translate(165 50)">
        <line x1="0" y1="0" x2="0" y2="32" stroke="#5A3618" strokeWidth="1.5" />
        <polygon points="-5,32 5,32 0,36" fill="#5A3618" />
        <circle cx="0" cy="0" r="2" fill="#3D2A1E" />
        <g transform={`rotate(${tilt})`} style={{ transition: "transform 0.4s ease" }}>
          <line
            x1="-30"
            y1="0"
            x2="30"
            y2="0"
            stroke="#3D2A1E"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line x1="-30" y1="0" x2="-30" y2="6" stroke="#3D2A1E" strokeWidth="0.8" />
          <path d="M -38 6 Q -30 12 -22 6 Z" fill="none" stroke={upColor} strokeWidth="1.2" />
          <text
            x="-30"
            y="18"
            textAnchor="middle"
            fill={upColor}
            fontSize="6"
            letterSpacing="1"
          >
            ↑
          </text>
          <line x1="30" y1="0" x2="30" y2="6" stroke="#3D2A1E" strokeWidth="0.8" />
          <path d="M 22 6 Q 30 12 38 6 Z" fill="none" stroke={downColor} strokeWidth="1.2" />
          <text
            x="30"
            y="18"
            textAnchor="middle"
            fill={downColor}
            fontSize="6"
            letterSpacing="1"
          >
            ↓
          </text>
        </g>
        <line x1="-20" y1="38" x2="20" y2="38" stroke="#3D2A1E" strokeWidth="1.5" />
      </g>

      {/* Status pill at bottom — well-padded, won't overflow */}
      <g transform="translate(110 100)">
        <rect x="-100" y="-8" width="200" height="16" rx="8" fill={statusColor} opacity="0.16" />
        <rect
          x="-100"
          y="-8"
          width="200"
          height="16"
          rx="8"
          fill="none"
          stroke={statusColor}
          strokeWidth="0.6"
          opacity="0.55"
        />
        <circle cx="-88" cy="0" r="3" fill={statusColor} />
        <text
          x="-80"
          y="2.6"
          fill={statusColor}
          fontSize="7"
          fontFamily="var(--font-cormorant), serif"
          letterSpacing="1.3"
          fontWeight="600"
        >
          {statusLabel}
        </text>
      </g>
    </svg>
  );
}

function BreathRing({ seconds = 60 }: { seconds?: number }) {
  const { t, fmt } = useI18n();
  const r = 50;
  const c = 2 * Math.PI * r;
  return (
    <svg
      viewBox="0 0 140 140"
      style={{ width: 78, height: 78, display: "block", margin: "4px auto" }}
    >
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(80,55,30,0.2)" strokeWidth="8" />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="var(--sea-blue)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset="0"
        transform="rotate(-90 70 70)"
      />
      <text
        x="70"
        y="68"
        textAnchor="middle"
        fill="var(--ink)"
        fontSize="32"
        fontFamily="Cormorant Garamond, serif"
        fontWeight="500"
      >
        {fmt(seconds)}
      </text>
      <text
        x="70"
        y="86"
        textAnchor="middle"
        fill="var(--ink-soft)"
        fontSize="10"
        letterSpacing="3"
      >
        {t("predive.seconds")}
      </text>
    </svg>
  );
}
