"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { TopChrome } from "@/components/layout/TopChrome";
import type { PearlGrade } from "@/lib/store/progress";

const TIERS: PearlGrade[] = ["common", "fine", "royal"];

export default function PearlRevealPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-sea-abyss">
          <div className="h-8 w-8 animate-pulse rounded-full bg-sunset-gold/40" aria-hidden />
        </div>
      }
    >
      <PearlReveal />
    </Suspense>
  );
}

function PearlReveal() {
  const router = useRouter();
  const search = useSearchParams();
  const { t, lang } = useI18n();
  const tier = (search.get("tier") as PearlGrade) || "royal";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 80% 80% at 50% 50%, #1B2D5C 0%, #051E2C 60%, #000 100%)",
        overflow: "hidden",
      }}
    >
      <TopChrome
        onBack={() => router.push("/sea")}
        title={t("pearl.revealTitle")}
        transparent
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 100,
          paddingBottom: 28,
          paddingInline: "clamp(16px, 3vw, 60px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
        }}
      >
        <PearlHero tier={tier} />
        <div
          style={{
            marginTop: 12,
            color: "var(--foam)",
            fontSize: 11,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          {t("pearl.centerpieceBead")}
        </div>

        <div style={{ marginTop: 36, width: "100%", maxWidth: 800 }}>
          <div
            style={{
              color: "var(--foam)",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: 14,
              textAlign: "center",
            }}
          >
            {t("pearl.tiers")}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 18,
            }}
          >
            {TIERS.map((v) => (
              <PearlTierCard key={v} tier={v} active={v === tier} />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 26, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => router.push("/sea/chest")} className="reveal-btn">
            {t("pearl.toChest")} {lang === "ar" ? "←" : "→"}
          </button>
          <button onClick={() => router.push("/sea")} className="reveal-btn primary">
            {t("pearl.diveAgain")} ↓
          </button>
        </div>
      </div>

      <style>{`
        .reveal-btn {
          padding: 12px 24px;
          background: rgba(245,235,211,0.08);
          border: 1px solid rgba(240,244,242,0.25);
          color: var(--foam);
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          letter-spacing: 0.3em;
          cursor: pointer;
          transition: all 0.3s;
        }
        .reveal-btn.primary {
          background: var(--sunset-gold);
          color: var(--sea-deep);
          border-color: var(--sunset-gold);
        }
      `}</style>
    </div>
  );
}

// Cinematic pearl-reveal palette — intentionally NOT consolidated into
// lib/pearl/colors.ts. The reveal needs a richer set of stops (fill /
// inner-nacre / outer-rim) than other surfaces, and the inner tones
// (mauve / wine / amber) are tuned to read as oyster nacre, not as
// repeatable chest pearls. Keep local.
interface PearlPalette {
  fill: string;
  glow: string;
  inner: string;
  rim: string;
}

const PEARL_COLORS: Record<PearlGrade, PearlPalette> = {
  common: {
    fill: "#F4EBDC",
    glow: "rgba(244,235,220,0.7)",
    inner: "#8B6F8F",
    rim: "#D9C4A8",
  },
  fine: {
    fill: "#F2C7C3",
    glow: "rgba(242,199,195,0.7)",
    inner: "#7A4A6F",
    rim: "#E8A8A2",
  },
  royal: {
    fill: "#F4D77A",
    glow: "rgba(244,215,122,0.85)",
    inner: "#8B5A2E",
    rim: "#FFE0A8",
  },
};

function PearlHero({ tier }: { tier: PearlGrade }) {
  const { t, lang } = useI18n();
  const colors = PEARL_COLORS[tier];
  const stars = tier === "royal" ? 5 : tier === "fine" ? 4 : 3;
  const labelKey = `pearl.${tier}Name` as const;

  // Reveal phase — oyster opens after a short beat
  const [phase, setPhase] = useState<"closed" | "revealed">("closed");
  useEffect(() => {
    const id = setTimeout(() => setPhase("revealed"), 800);
    return () => clearTimeout(id);
  }, []);
  const open = phase === "revealed";

  return (
    <div
      style={{
        position: "relative",
        marginTop: 30,
        width: "min(380px, calc(100vw - 32px))",
        aspectRatio: "1 / 0.78",
      }}
    >
      {/* Tier label */}
      <div
        style={{
          position: "absolute",
          top: -10,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          textAlign: "center",
          zIndex: 5,
        }}
      >
        <div
          className="font-display"
          style={{
            fontSize: 28,
            color:
              tier === "royal"
                ? "var(--sunset-gold)"
                : tier === "fine"
                  ? "#F2C7C3"
                  : "#F4EBDC",
            letterSpacing: "0.3em",
            textShadow: `0 0 18px ${colors.glow}`,
          }}
        >
          {t(labelKey).toUpperCase()}
        </div>
        {lang !== "ar" && (
          <div
            className="font-arabic"
            style={{
              fontSize: 13,
              color: "var(--foam)",
              opacity: 0.7,
              marginTop: 2,
              fontFamily: "var(--font-tajawal), sans-serif",
            }}
          >
            {tier === "royal" ? "لؤلؤة ملكية" : tier === "fine" ? "لؤلؤة نفيسة" : "لؤلؤة عادية"}
          </div>
        )}
      </div>

      {/* Outer halo */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: -120,
          background: `radial-gradient(circle, ${colors.glow}, transparent 60%)`,
          animation: "pearlGlow 4s ease-in-out infinite",
          opacity: open ? 1 : 0.3,
          transition: "opacity 1.4s ease",
          pointerEvents: "none",
        }}
      />

      {/* Light flare burst when oyster opens */}
      {open && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="-100 -100 200 200"
            style={{ width: "130%", height: "130%" }}
          >
            <defs>
              <radialGradient id="flareCore">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="40%" stopColor={colors.rim} stopOpacity="0.6" />
                <stop offset="100%" stopColor={colors.fill} stopOpacity="0" />
              </radialGradient>
            </defs>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              const x = Math.cos(a) * 90;
              const y = Math.sin(a) * 90;
              return (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2={x}
                  y2={y}
                  stroke={colors.rim}
                  strokeWidth="1"
                  opacity="0.5"
                >
                  <animate
                    attributeName="opacity"
                    values="0.2;0.8;0.2"
                    dur={`${3 + (i % 3)}s`}
                    repeatCount="indefinite"
                  />
                </line>
              );
            })}
            <circle cx="0" cy="0" r="60" fill="url(#flareCore)">
              <animate
                attributeName="r"
                values="40;65;40"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      )}

      {/* Cinematic split-shell oyster */}
      <svg
        viewBox="0 0 380 300"
        style={{ width: "100%", height: "100%", position: "relative", zIndex: 2 }}
      >
        <defs>
          <radialGradient id="innerNacre" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={colors.rim} />
            <stop offset="20%" stopColor="#F8E8D0" />
            <stop offset="50%" stopColor={colors.inner} />
            <stop offset="100%" stopColor="#1A1226" />
          </radialGradient>
          <linearGradient id="shellOuter" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#5A4030" />
            <stop offset="50%" stopColor="#3D2A1E" />
            <stop offset="100%" stopColor="#1A130D" />
          </linearGradient>
          <linearGradient id="shellInner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="40%" stopColor={colors.rim} stopOpacity="0.85" />
            <stop offset="100%" stopColor={colors.inner} stopOpacity="0.7" />
          </linearGradient>
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        <ellipse cx="190" cy="270" rx="130" ry="14" fill="rgba(0,0,0,0.6)" filter="url(#softShadow)" />

        {/* Inner mantle / nacre — visible when open */}
        <g
          style={{
            opacity: open ? 1 : 0,
            transition: "opacity 1.2s ease",
            transformOrigin: "190px 200px",
          }}
        >
          <ellipse cx="190" cy="200" rx="135" ry="60" fill="url(#innerNacre)" />
          <ellipse cx="160" cy="190" rx="40" ry="14" fill="#FFFFFF" opacity="0.35" />
          <ellipse cx="220" cy="200" rx="30" ry="10" fill={colors.rim} opacity="0.5" />
          <path
            d="M 90 200 Q 130 180 190 178 Q 250 180 290 200"
            stroke={colors.rim}
            strokeWidth="0.8"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 100 210 Q 140 195 190 192 Q 240 195 280 210"
            stroke="#FFFFFF"
            strokeWidth="0.5"
            fill="none"
            opacity="0.4"
          />
        </g>

        {/* Lower (front) shell half — stays */}
        <g>
          <path
            d="M 50 200 Q 50 250 100 268 Q 190 290 280 268 Q 330 250 330 200 Q 330 230 190 240 Q 50 230 50 200 Z"
            fill="url(#shellOuter)"
          />
          <path
            d="M 70 220 Q 130 240 190 244 Q 250 240 310 220"
            stroke="#1A0E08"
            strokeWidth="0.6"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M 80 232 Q 130 248 190 252 Q 250 248 300 232"
            stroke="#1A0E08"
            strokeWidth="0.6"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 60 200 Q 60 220 110 234 Q 190 248 270 234 Q 320 220 320 200"
            fill="url(#shellInner)"
            opacity="0.5"
          />
        </g>

        {/* Upper (back) shell half — rotates open */}
        <g
          style={{
            transformOrigin: "190px 200px",
            transform: open ? "rotate(-58deg) translateY(-14px)" : "rotate(0deg)",
            transition: "transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <path
            d="M 50 200 Q 50 150 100 132 Q 190 110 280 132 Q 330 150 330 200 Q 330 170 190 160 Q 50 170 50 200 Z"
            fill="url(#shellOuter)"
          />
          <path
            d="M 70 180 Q 130 162 190 158 Q 250 162 310 180"
            stroke="#1A0E08"
            strokeWidth="0.6"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M 80 168 Q 130 152 190 148 Q 250 152 300 168"
            stroke="#1A0E08"
            strokeWidth="0.6"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 60 200 Q 60 180 110 168 Q 190 152 270 168 Q 320 180 320 200"
            fill="url(#shellInner)"
            opacity="0.6"
          />
          <ellipse cx="190" cy="200" rx="12" ry="2" fill="#1A0E08" opacity="0.8" />
        </g>
      </svg>

      {/* Pearl rises from inside */}
      <div
        style={{
          position: "absolute",
          insetInlineStart: "50%",
          top: open ? "30%" : "55%",
          transform: "translate(-50%, -50%)",
          transition: "top 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
          zIndex: 3,
        }}
      >
        <div style={{ position: "relative", width: 130, height: 130 }}>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: -40,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colors.glow}, transparent 70%)`,
              animation: "pearlGlow 3s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `radial-gradient(circle at 32% 26%, #FFFFFF 0%, ${colors.fill} 35%, ${colors.rim} 60%, ${colors.inner} 100%)`,
              boxShadow: `0 0 70px ${colors.glow}, inset 0 -10px 22px rgba(0,0,0,0.25), inset 0 8px 20px rgba(255,255,255,0.5)`,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "12%",
              left: "22%",
              width: "26%",
              height: "20%",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(255,255,255,0.9), rgba(255,255,255,0.3) 60%, transparent)",
              filter: "blur(2px)",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "55%",
              left: "55%",
              width: "20%",
              height: "10%",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              filter: "blur(3px)",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: "8%",
              left: "16%",
              width: "68%",
              height: "10%",
              borderRadius: "50%",
              background: "rgba(0,0,0,0.18)",
              filter: "blur(4px)",
            }}
          />
        </div>
      </div>

      {/* Stars */}
      <div
        style={{
          position: "absolute",
          bottom: -10,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          textAlign: "center",
          color: "var(--sunset-gold)",
          fontSize: 18,
          letterSpacing: "0.2em",
          zIndex: 4,
        }}
      >
        {"★".repeat(stars) + "☆".repeat(5 - stars)}
      </div>
    </div>
  );
}

function PearlTierCard({ tier, active }: { tier: PearlGrade; active: boolean }) {
  const { t } = useI18n();
  const colors = PEARL_COLORS[tier];
  const stats = {
    common: { size: 2, luster: 3 },
    fine: { size: 3, luster: 4 },
    royal: { size: 4, luster: 5 },
  }[tier];
  const labelKey = `pearl.${tier}` as const;

  return (
    <div
      style={{
        padding: 20,
        background: active ? "rgba(244,184,96,0.12)" : "rgba(240,244,242,0.05)",
        border: `1px solid ${active ? "var(--sunset-gold)" : "rgba(240,244,242,0.18)"}`,
        textAlign: "center",
        color: "var(--foam)",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          margin: "0 auto",
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 28%, #FFFFFF, ${colors.fill}, #4A2F18)`,
          boxShadow: `0 0 24px ${colors.glow}`,
        }}
      />
      <div
        className="font-display"
        style={{
          fontSize: 16,
          marginTop: 14,
          color: active ? "var(--sunset-gold)" : "var(--foam)",
          letterSpacing: "0.15em",
        }}
      >
        {t(labelKey).toUpperCase()}
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 11,
          color: "rgba(240,244,242,0.7)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <StatBar label={t("pearl.size")} value={stats.size} max={5} />
        <StatBar label={t("pearl.luster")} value={stats.luster} max={5} />
      </div>
    </div>
  );
}

function StatBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const { fmt } = useI18n();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          width: 56,
          textAlign: "start",
          opacity: 0.7,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 4, background: "rgba(240,244,242,0.18)" }}>
        <div
          style={{
            width: `${(value / max) * 100}%`,
            height: "100%",
            background: "var(--sunset-gold)",
          }}
        />
      </div>
      <span className="font-display" style={{ width: 24, fontSize: 11 }}>
        {fmt(value)}/{fmt(max)}
      </span>
    </div>
  );
}
