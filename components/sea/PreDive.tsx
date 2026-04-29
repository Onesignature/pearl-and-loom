"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { SeaScene } from "@/components/scenes/SeaScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { Stone } from "@/components/portraits/Portraits";
import { DiveConceptVisual } from "@/components/sea/DiveConceptVisual";
import { DiveTipsRail } from "@/components/sea/DiveTipsRail";
import { playCue } from "@/lib/audio/cues";
import type { DiveDef } from "@/app/sea/page";

// Per-dive concept summary surfaced above the stone selection — gives
// each dive a unique preview screen instead of a repetitive "pick stone,
// dive" loop. Bilingual EN/AR.
const DIVE_CONCEPT_COPY: Record<
  DiveDef["key"],
  { eyebrowEn: string; eyebrowAr: string; lineEn: string; lineAr: string }
> = {
  shallowBank: {
    eyebrowEn: "Today's lesson · Buoyancy",
    eyebrowAr: "درس اليوم · الطفو",
    lineEn:
      "What floats and what sinks? It's all about density. The stone gives Saif the extra weight he needs to descend.",
    lineAr:
      "ما الذي يطفو وما الذي يهبط؟ كلّه يعود إلى الكثافة. الحجر يمنح سيف الوزن الإضافي ليهبط.",
  },
  deepReef: {
    eyebrowEn: "Today's lesson · Pressure",
    eyebrowAr: "درس اليوم · الضغط",
    lineEn:
      "Every 10 metres of water adds 1 atmosphere of pressure. Watch the bubble compress as Saif goes deeper.",
    lineAr:
      "كل ١٠ أمتار من الماء تضيف جوًا واحدًا من الضغط. لاحظ كيف تنضغط الفقاعة كلّما نزل سيف.",
  },
  coralGarden: {
    eyebrowEn: "Today's lesson · Reef life",
    eyebrowAr: "درس اليوم · حياة الشعاب",
    lineEn:
      "Oysters anchor on rock and pump water through their gills, trapping food. They're tiny purifiers of the sea.",
    lineAr:
      "يلتصق المحار بالصخر ويضخّ الماء عبر خياشيمه ليلتقط الغذاء. مُنقّيات صغيرة للبحر.",
  },
  lungOfSea: {
    eyebrowEn: "Today's lesson · Breath",
    eyebrowAr: "درس اليوم · النَّفس",
    lineEn:
      "A diver's heart slows and his lungs hold ~6 litres. Calm beats capacity — a slower heart burns less oxygen.",
    lineAr:
      "ينخفض قلب الغوّاص وتسع رئتاه نحو ٦ لترات. الهدوء يهزم السعة — القلب الأبطأ يستهلك أكسجينًا أقلّ.",
  },
  refractionTrial: {
    eyebrowEn: "Today's lesson · Light",
    eyebrowAr: "درس اليوم · الضوء",
    lineEn:
      "Light bends as it enters water and red disappears first with depth. Pearling boats worked by noon for the best clarity.",
    lineAr:
      "ينكسر الضوء عند دخول الماء، ويختفي الأحمر أوّلًا مع العمق. يعمل الغوّاصون ظهرًا للحصول على أوضح رؤية.",
  },
};

export function PreDive({ dive }: { dive: DiveDef }) {
  const router = useRouter();
  const { t, fmt, lang } = useI18n();
  const [stones, setStones] = useState(3);

  const optimal = Math.max(2, Math.round(dive.depth / 3));
  const status: "under" | "good" | "over" =
    stones < optimal - 1 ? "under" : stones > optimal + 1 ? "over" : "good";


  return (
    <SeaScene>
      <TopChrome
        onBack={() => router.push("/sea")}
        title={t("predive.title")}
        subtitle={`${t(`sea.titles.${dive.key}` as never).toUpperCase()} · ${fmt(dive.depth)}M`}
      />
      <div className="predive-stage">
        {/* Side gutters fill with two columns of fact chips on wide
            desktops — gives the kid a few real-world tidbits to read
            while they decide what stone to pick. Hidden ≤1180px wide
            so they don't crowd the loadout. */}
        <DiveTipsRail diveKey={dive.key} />
        {/* A centered max-width inner stage holding only the loadout —
            Saif's portrait is dropped on this screen so the composition
            stays a single focused column. */}
        <div className="predive-stage-inner">
        <div className="predive-loadout">
          {/* Today's-lesson preview — themed visual + one-liner so each
              dive entry feels distinct from the others. Sits at the top
              so the concept frames everything below it. */}
          <div className="predive-concept" role="note">
            <div className="predive-concept-text">
              <span className="predive-concept-eyebrow">
                {lang === "en"
                  ? DIVE_CONCEPT_COPY[dive.key].eyebrowEn
                  : DIVE_CONCEPT_COPY[dive.key].eyebrowAr}
              </span>
              <span className="predive-concept-body">
                {lang === "en"
                  ? DIVE_CONCEPT_COPY[dive.key].lineEn
                  : DIVE_CONCEPT_COPY[dive.key].lineAr}
              </span>
            </div>
            <div className="predive-concept-visual">
              <DiveConceptVisual diveKey={dive.key} depth={dive.depth} />
            </div>
          </div>

          {/* Loadout — stone row. The redundant
              "How to play" strip + ornamental LOADOUT eyebrow are gone;
              the force diagram below already gives BALANCED / TOO HEAVY
              feedback so the verbal instructions weren't earning space. */}
          <div className="predive-stones" style={{ marginTop: 8 }}>
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
                      fontSize: 16,
                      marginTop: 4,
                      fontWeight: 600,
                      fontFamily: "var(--font-cormorant), serif",
                    }}
                  >
                    {fmt(n)} <span style={{ opacity: 0.7 }}>{t("predive.kg")}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div
            className="paper-bg"
            style={{
              padding: 14,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontSize: 15,
                letterSpacing: "0.28em",
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
                marginBottom: 14,
                textAlign: "center",
              }}
            >
              {t("predive.forceDiagram")}
            </div>
            <div style={{ width: "min(84%, 360px)", margin: "0 auto" }}>
              <ForceDiagram stones={stones} status={status} />
            </div>
          </div>

          <div className="predive-launch">
            <div className="predive-launch-hint" aria-hidden>
              {lang === "en" ? "Ready? Tap to begin →" : "جاهز؟ اضغط للبدء ←"}
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
        </div>
      </div>
      <style>{`
        .predive-stage {
          position: absolute;
          inset: 0;
          padding-top: 92px;
          padding-bottom: 22px;
          padding-inline: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          overflow-x: hidden;
        }
        /* Centered inner stage — a single focused column for the
           loadout. Wider than before now that Saif's gone, with room
           for the centered DIVE button pinned at the bottom. */
        .predive-stage-inner {
          position: relative;
          width: 100%;
          max-width: 780px;
          padding-bottom: 84px; /* room for the centered DIVE button */
          display: flex;
          align-items: stretch;
        }
        .predive-deck {
          position: absolute;
          inset-inline-start: 0;
          bottom: 0;
          top: 0;
          width: 320px;
          pointer-events: none;
          /* Fade the trailing edge of Saif's portrait into the sea so
             the shore doesn't read as a flat sticker pasted on water.
             LTR: fade out to the right. RTL: mirror to the left. */
          -webkit-mask-image: linear-gradient(
            to right,
            black 0%,
            black 60%,
            rgba(0,0,0,0.6) 82%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            black 0%,
            black 60%,
            rgba(0,0,0,0.6) 82%,
            transparent 100%
          );
        }
        [dir="rtl"] .predive-deck {
          -webkit-mask-image: linear-gradient(
            to left,
            black 0%,
            black 60%,
            rgba(0,0,0,0.6) 82%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to left,
            black 0%,
            black 60%,
            rgba(0,0,0,0.6) 82%,
            transparent 100%
          );
        }
        .predive-loadout {
          flex: 1;
          color: var(--foam);
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
          /* Centered single column — wider now without Saif. */
          margin-inline: auto;
          max-width: 780px;
          width: 100%;
        }
        @media (max-width: 900px) {
          .predive-stage {
            align-items: flex-start;
            justify-content: flex-start;
            padding-inline: 20px;
            padding-bottom: 0;
            overflow-y: auto;
          }
          .predive-stage-inner {
            flex-direction: column;
            align-items: stretch;
            min-height: 0;
            padding-bottom: 0;
            gap: 16px;
          }
          .predive-deck {
            /* Edge-to-edge band on mobile. Using 100vw + a 50% / -50%
               translate trick guarantees the container reaches both
               viewport edges regardless of any parent padding, which
               is more reliable than negative inline margins on a
               stretched flex item across mobile browsers. */
            position: relative;
            inset: auto;
            width: 100vw;
            max-width: none;
            margin-inline: 0;
            inset-inline-start: 50%;
            transform: translateX(-50%);
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
            /* Drop the desktop edge fade — on mobile the deck spans full
               width and its own bottom gradient handles the blend. */
            -webkit-mask-image: none;
            mask-image: none;
          }
          [dir="rtl"] .predive-deck {
            transform: translateX(50%);
            -webkit-mask-image: none;
            mask-image: none;
          }
          .predive-deck > svg {
            width: 100% !important;
            height: auto !important;
            /* Edge-to-edge on phone — the deck container already bleeds
               20px past the page padding via margin-inline:-20px, so
               removing the 320px cap lets the shore actually reach the
               viewport edges instead of floating in a centered band. */
            max-width: none;
            /* Shorter aspect than the SVG's native 360/540 so the slice
               preserveAspectRatio crops the top sky/water portion and
               brings Saif visually higher in the frame. */
            aspect-ratio: 360 / 380;
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
        .predive-concept {
          padding: 14px 16px;
          background: linear-gradient(180deg, rgba(8,55,74,0.6) 0%, rgba(5,30,44,0.55) 100%);
          border: 1px solid rgba(244,184,96,0.32);
          border-radius: 16px;
          display: grid;
          /* Bigger visual on web — the diagram is the lesson preview,
             it deserves space. Was 170px, now 260px. */
          grid-template-columns: 1fr 260px;
          gap: 14px;
          align-items: center;
          color: var(--foam);
        }
        .predive-concept-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }
        .predive-concept-eyebrow {
          font-family: var(--font-cormorant), serif;
          font-size: 16px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--sunset-gold);
          opacity: 0.95;
        }
        .predive-concept-body {
          font-size: 20px;
          color: rgba(240,244,242,0.92);
          line-height: 1.55;
        }
        .predive-concept-visual {
          width: 100%;
          flex: 0 0 auto;
        }
        @media (max-width: 720px) {
          .predive-concept {
            grid-template-columns: 1fr;
            padding: 10px 12px;
            gap: 8px;
          }
          .predive-concept-visual { order: -1; }
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
          animation: stoneFloat 3s ease-in-out infinite;
        }
        .stone-btn:nth-child(even) {
          animation-delay: 1.5s;
        }
        @keyframes stoneFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .stone-btn:hover {
          background: rgba(8, 30, 44, 0.75);
          border-color: rgba(244, 184, 96, 0.6);
          transform: translateY(-8px);
        }
        .stone-btn.active {
          border-color: var(--sunset-gold);
          background: rgba(244, 184, 96, 0.22);
          box-shadow:
            0 0 0 1px var(--sunset-gold),
            0 6px 22px rgba(244, 184, 96, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          animation: none;
          transform: translateY(-5px);
        }
        /* Launch cluster — centered at the bottom of the inner stage.
           A small "Ready? Tap to begin" hint sits above the button to
           cue the kid that selecting the stone is the only step left
           before diving. */
        .predive-launch {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
          margin-bottom: 24px;
          z-index: 10;
        }
        [dir="rtl"] .predive-launch { transform: none; }
        .predive-launch-hint {
          font-family: var(--font-cormorant), serif;
          font-size: 18px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--sunset-gold);
          opacity: 0.9;
          animation: divePromptFade 0.6s ease both 0.4s;
        }
        @keyframes divePromptFade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 0.85; transform: translateY(0); }
        }
        .dive-btn {
          padding: 20px 72px;
          background: linear-gradient(180deg, #FFD080 0%, var(--sunset-gold) 100%);
          color: var(--sea-deep);
          border: none;
          border-radius: 999px;
          font-family: var(--font-cormorant), serif;
          font-size: 24px;
          letter-spacing: 0.3em;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s var(--ease-water);
          box-shadow:
            inset 0 1px 0 rgba(255, 248, 220, 0.6),
            0 8px 24px rgba(0, 0, 0, 0.4),
            0 0 28px rgba(244, 184, 96, 0.32);
          /* Gentle attention pulse — kicks in 1.4s after mount to
             invite the kid forward once they've absorbed the screen. */
          animation: divePulse 2.6s ease-in-out 1.4s infinite;
        }
        @keyframes divePulse {
          0%, 100% {
            box-shadow:
              inset 0 1px 0 rgba(255, 248, 220, 0.6),
              0 8px 24px rgba(0, 0, 0, 0.4),
              0 0 28px rgba(244, 184, 96, 0.32);
          }
          50% {
            box-shadow:
              inset 0 1px 0 rgba(255, 248, 220, 0.7),
              0 10px 28px rgba(0, 0, 0, 0.45),
              0 0 50px rgba(244, 184, 96, 0.6);
          }
        }
        .dive-btn:hover {
          transform: translateY(-2px);
          animation-play-state: paused;
          box-shadow:
            inset 0 1px 0 rgba(255, 248, 220, 0.7),
            0 12px 30px rgba(0, 0, 0, 0.45),
            0 0 50px rgba(244, 184, 96, 0.6);
        }
        @media (prefers-reduced-motion: reduce) {
          .dive-btn { animation: none; }
          .predive-launch-hint { animation: none; }
        }
        /* Removed .predive-loadout-head to give more focus to stones directly */
        @media (max-width: 900px) {
          .predive-launch {
            margin: 16px auto 24px;
          }
          .dive-btn {
            padding: 16px 52px !important;
            font-size: 18px !important;
            letter-spacing: 0.25em !important;
          }
          .dive-btn:hover { transform: translateY(-2px) !important; }
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
        ? "BALANCED"
        : "متوازن"
      : status === "under"
        ? lang === "en"
          ? "TOO LIGHT"
          : "خفيف"
        : lang === "en"
          ? "TOO HEAVY"
          : "ثقيل";

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

