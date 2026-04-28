"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { SeaScene } from "@/components/scenes/SeaScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { SaifOnDeck, Stone } from "@/components/portraits/Portraits";
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 86,
          paddingBottom: 28,
          paddingInline: 50,
          display: "flex",
          gap: 36,
          alignItems: "center",
        }}
      >
        <div style={{ flex: "0 0 360px", height: "100%", position: "relative" }}>
          <SaifOnDeck />
        </div>
        <div style={{ flex: 1, color: "var(--foam)" }}>
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
              fontSize: 36,
              color: "var(--foam)",
              letterSpacing: "0.04em",
              marginTop: 6,
            }}
          >
            {t("predive.chooseStone")}
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", gap: 10 }}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setStones(n)}
                  className={`stone-btn${stones === n ? " active" : ""}`}
                >
                  <Stone size={n * 7 + 16} />
                  <div
                    style={{
                      fontSize: 11,
                      marginTop: 6,
                      fontFamily: "var(--font-cormorant), serif",
                    }}
                  >
                    {fmt(n)} <span style={{ opacity: 0.6 }}>{t("predive.kg")}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 36, display: "flex", gap: 26 }}>
            <div className="paper-bg" style={{ padding: 22, flex: 1 }}>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--ink-soft)",
                  marginBottom: 10,
                }}
              >
                {t("predive.forceDiagram")}
              </div>
              <ForceDiagram stones={stones} status={status} />
              <div
                style={{
                  marginTop: 12,
                  fontSize: 12,
                  color:
                    status === "good" ? "var(--sea-blue)" : "var(--madder)",
                  fontFamily: "var(--font-cormorant), serif",
                  letterSpacing: "0.1em",
                }}
              >
                {status === "under" && t("predive.underweight")}
                {status === "over" && t("predive.overweight")}
                {status === "good" && t("predive.balanced")}
              </div>
            </div>
            <div className="paper-bg" style={{ padding: 22, width: 200, textAlign: "center" }}>
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
              <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 6 }}>
                {t("predive.capacity")}
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push(`/sea/dives/${dive.key}/dive?stones=${stones}`)}
            className="dive-btn"
          >
            {t("predive.dive")}
          </button>
        </div>
      </div>
      <style>{`
        .stone-btn {
          background: rgba(240,244,242,0.06);
          border: 1px solid rgba(240,244,242,0.2);
          color: var(--foam);
          padding: 14px 8px;
          cursor: pointer;
          transition: all 0.3s var(--ease-water);
          font-family: var(--font-tajawal), sans-serif;
          flex: 1;
        }
        .stone-btn:hover { background: rgba(240,244,242,0.12); }
        .stone-btn.active {
          border-color: var(--sunset-gold);
          background: rgba(244,184,96,0.18);
        }
        .dive-btn {
          margin-top: 30px;
          padding: 16px 60px;
          background: var(--sunset-gold);
          color: var(--sea-deep);
          border: none;
          font-family: var(--font-cormorant), serif;
          font-size: 16px;
          letter-spacing: 0.4em;
          cursor: pointer;
          transition: all 0.3s var(--ease-water);
        }
        .dive-btn:hover {
          background: #FFD080;
          transform: translateY(2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
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
  const buoy = 30;
  const weight = stones * 8 + 5;
  return (
    <svg viewBox="0 0 200 140" style={{ width: "100%" }}>
      <ellipse
        cx="100"
        cy="70"
        rx="22"
        ry="40"
        fill="none"
        stroke="#0E5E7B"
        strokeWidth="1.2"
        opacity="0.7"
      />
      <circle
        cx="100"
        cy="42"
        r="10"
        fill="none"
        stroke="#0E5E7B"
        strokeWidth="1.2"
        opacity="0.7"
      />
      <g>
        <line x1="65" y1="70" x2="65" y2={70 - buoy} stroke="#0E5E7B" strokeWidth="2.5" />
        <path
          d={`M 65 ${70 - buoy} L 60 ${75 - buoy} L 70 ${75 - buoy} Z`}
          fill="#0E5E7B"
        />
        <text
          x="50"
          y={70 - buoy + 4}
          textAnchor="end"
          fill="#0E5E7B"
          fontSize="9"
          fontFamily="serif"
          letterSpacing="1"
        >
          ↑
        </text>
      </g>
      <g>
        <line x1="135" y1="70" x2="135" y2={70 + weight} stroke="#B5341E" strokeWidth="2.5" />
        <path
          d={`M 135 ${70 + weight} L 130 ${65 + weight} L 140 ${65 + weight} Z`}
          fill="#B5341E"
        />
        <text
          x="150"
          y={70 + weight}
          fill="#B5341E"
          fontSize="9"
          fontFamily="serif"
          letterSpacing="1"
        >
          ↓
        </text>
      </g>
      <rect x="60" y="120" width="80" height="6" fill="#5A3618" />
      <circle
        cx={100 + (weight - buoy) * 1.5}
        cy="116"
        r="5"
        fill={status === "good" ? "#0E5E7B" : "#B5341E"}
      />
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
      style={{ width: 140, height: 140, display: "block", margin: "10px auto" }}
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
