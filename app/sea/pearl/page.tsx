"use client";

import { Suspense } from "react";
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
  const { t, fmt, lang } = useI18n();
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
          paddingInline: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 18,
            }}
          >
            {TIERS.map((v) => (
              <PearlTierCard key={v} tier={v} active={v === tier} />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 26 }}>
          <button onClick={() => router.push("/")} className="reveal-btn">
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

interface PearlPalette {
  fill: string;
  glow: string;
  inner: string;
}

const PEARL_COLORS: Record<PearlGrade, PearlPalette> = {
  common: { fill: "#F4EBDC", glow: "rgba(244,235,220,0.5)", inner: "#8B6F8F" },
  fine: { fill: "#F2C7C3", glow: "rgba(242,199,195,0.6)", inner: "#7A4A6F" },
  royal: { fill: "#F4D77A", glow: "rgba(244,215,122,0.7)", inner: "#8B5A2E" },
};

function PearlHero({ tier }: { tier: PearlGrade }) {
  const { t } = useI18n();
  const colors = PEARL_COLORS[tier];
  const stars = tier === "royal" ? 5 : tier === "fine" ? 4 : 3;
  const labelKey = `pearl.${tier}Name` as const;

  return (
    <div style={{ position: "relative", marginTop: 10 }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: -120,
          background: `radial-gradient(circle, ${colors.glow}, transparent 60%)`,
          animation: "pearlGlow 4s ease-in-out infinite",
        }}
      />
      <svg
        viewBox="0 0 280 200"
        width="320"
        height="220"
        style={{ position: "relative" }}
      >
        <defs>
          <radialGradient id="innerOyster">
            <stop offset="0%" stopColor={colors.inner} />
            <stop offset="60%" stopColor="#3D2F4D" />
            <stop offset="100%" stopColor="#1A1226" />
          </radialGradient>
        </defs>
        <ellipse cx="140" cy="160" rx="120" ry="32" fill="#2A1810" />
        <path
          d="M 30 150 Q 30 110 140 110 Q 250 110 250 150 L 250 165 Q 140 180 30 165 Z"
          fill="url(#innerOyster)"
        />
        <path
          d="M 30 150 Q 30 90 140 60 Q 250 90 250 150 Q 250 110 140 100 Q 30 110 30 150 Z"
          fill={colors.inner}
          opacity="0.6"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          insetInlineStart: "50%",
          top: "30%",
          transform: "translateX(-50%)",
          animation: "heroPearlRise 1.6s var(--ease-pearl) forwards",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: `radial-gradient(circle at 32% 28%, #FFFFFF 0%, ${colors.fill} 50%, ${colors.inner} 100%)`,
            boxShadow: `0 0 60px ${colors.glow}, inset 0 -8px 16px rgba(0,0,0,0.2)`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: -28,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          textAlign: "center",
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
          }}
        >
          {t(labelKey).toUpperCase()}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          textAlign: "center",
          color: "var(--sunset-gold)",
          fontSize: 18,
          letterSpacing: "0.2em",
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
