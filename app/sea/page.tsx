"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { SeaScene } from "@/components/scenes/SeaScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { NauticalMap } from "@/components/sea/NauticalMap";
import { DiveCard } from "@/components/sea/DiveCard";
import { QuizHubCard } from "@/components/quiz/QuizHubCard";

const FREE_DIVE_TEASER_KEY = "pearl.seenFreeDiveTeaser.v1";

export type DiveKey =
  | "shallowBank"
  | "deepReef"
  | "coralGarden"
  | "lungOfSea"
  | "refractionTrial";

export interface DiveDef {
  id: number;
  key: DiveKey;
  depth: number;
  /** Number of completed core dives (#1–3) needed to unlock this one. */
  requires: number;
  href: string;
  /** Resolved at render-time from progress — included on the static
   *  list so legacy callers that destructure `dive.state` keep working
   *  during the transition. Always recomputed via `resolveDiveState`. */
  state?: "available" | "locked" | "completed";
}

export const DIVES: DiveDef[] = [
  { id: 1, key: "shallowBank", depth: 5, requires: 0, href: "/sea/dives/shallowBank" },
  { id: 2, key: "deepReef", depth: 10, requires: 0, href: "/sea/dives/deepReef" },
  { id: 3, key: "coralGarden", depth: 12, requires: 0, href: "/sea/dives/coralGarden" },
  // The two deep dives unlock after the three core banks are done — Saif
  // earns the right to descend further by proving his form on shallow
  // water first. Both unlock at the same time so the kid can pick which
  // theme they want next.
  { id: 4, key: "lungOfSea", depth: 15, requires: 3, href: "/sea/dives/lungOfSea" },
  { id: 5, key: "refractionTrial", depth: 20, requires: 3, href: "/sea/dives/refractionTrial" },
];

/** Three "core" dives that gate everything else. */
export const CORE_DIVE_KEYS: DiveKey[] = ["shallowBank", "deepReef", "coralGarden"];
/** All five dives — the quiz unlocks once every one is complete. */
export const ALL_DIVE_KEYS: DiveKey[] = DIVES.map((d) => d.key);

/** Pure helper — resolve the current state of a dive given completion. */
export function resolveDiveState(
  dive: DiveDef,
  completed: string[],
): "available" | "locked" | "completed" {
  if (completed.includes(dive.key)) return "completed";
  const coreDoneCount = CORE_DIVE_KEYS.filter((k) => completed.includes(k)).length;
  return coreDoneCount >= dive.requires ? "available" : "locked";
}

export default function SeaHubPage() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const completed = useProgress((s) => s.diveLessonsCompleted);
  // Quiz now requires every dive — including the two deep ones — so the
  // final test only fires after Saif has worked the full curriculum.
  const quizUnlocked = ALL_DIVE_KEYS.every((id) => completed.includes(id));
  // Resolve each dive's state once and pass it down to the children so
  // NauticalMap + DiveCard don't have to know about completion logic.
  const dives = DIVES.map((d) => ({ ...d, state: resolveDiveState(d, completed) }));

  // Free Dive teaser — shown once until dismissed (or first visit to
  // /sea/explore clears it). localStorage-only; no server state.
  // Read deferred so the lint rule against synchronous setState in
  // effects is satisfied (and so we never touch localStorage during
  // SSR).
  const [showTeaser, setShowTeaser] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        if (!localStorage.getItem(FREE_DIVE_TEASER_KEY)) setShowTeaser(true);
      } catch {
        /* private mode or storage disabled — ignore */
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);
  function dismissTeaser() {
    setShowTeaser(false);
    try {
      localStorage.setItem(FREE_DIVE_TEASER_KEY, "1");
    } catch {
      /* ignore */
    }
  }
  function openExplore() {
    dismissTeaser();
    router.push("/sea/explore");
  }
  return (
    <SeaScene>
      <TopChrome
        onHome={() => router.push("/")}
        title={t("sea.hubTitle")}
        subtitle={`${t("sea.saif")} · ${t("sea.ghasaSeason")}`}
      />
      <div
        className="sea-stage"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
          paddingTop: 86,
          paddingBottom: 28,
          paddingInline: "clamp(16px, 3vw, 32px)",
          gap: "clamp(16px, 2.5vw, 28px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            flex: "1 1 880px",
            minWidth: "min(100%, 320px)",
            maxWidth: 1020,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            margin: "0 auto",
          }}
        >
          <NauticalMap dives={dives} />
        </div>
        <div
          className="sea-dives-col"
          style={{
            flex: "0 1 400px",
            minWidth: "min(100%, 300px)",
            maxWidth: 440,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div className="sea-dives-head">
            <span className="sea-dives-glyph" aria-hidden>≈</span>
            <span className="sea-dives-title">{t("sea.dives")}</span>
            <span className="sea-dives-count">
              {dives.filter((d) => d.state === "completed").length} / {dives.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push("/sea/chest")}
            className="sea-view-chest"
          >
            <span aria-hidden style={{ marginInlineEnd: 8 }}>◉</span>
            {lang === "en" ? "Pearl Chest" : "صندوق اللؤلؤ"}
            <span aria-hidden style={{ marginInlineStart: "auto" }}>
              {lang === "ar" ? "←" : "→"}
            </span>
          </button>
          <div style={{ position: "relative" }}>
            {showTeaser && (
              <div className="free-dive-teaser" role="status">
                <span className="free-dive-teaser-arrow" aria-hidden>↓</span>
                <div className="free-dive-teaser-body">
                  <span className="free-dive-teaser-eyebrow">
                    {lang === "en" ? "✦ NEW" : "✦ جديد"}
                  </span>
                  <span className="free-dive-teaser-text">
                    {lang === "en"
                      ? "Saif can now free-swim through the Gulf — find 8 marine creatures and learn from each."
                      : "يستطيع سيف الآن السباحة بحرّية في الخليج — اكتشف 8 مخلوقات بحرية وتعلّم منها."}
                  </span>
                </div>
                <button
                  type="button"
                  className="free-dive-teaser-close"
                  onClick={dismissTeaser}
                  aria-label={lang === "en" ? "Dismiss" : "إخفاء"}
                >
                  ✕
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={openExplore}
              className={`sea-free-dive${showTeaser ? " teasing" : ""}`}
            >
              <span aria-hidden style={{ marginInlineEnd: 8 }}>≋</span>
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                <span style={{ fontWeight: 500 }}>
                  {lang === "en" ? "Free Dive" : "غوص حر"}
                </span>
                <span style={{ fontSize: 11, opacity: 0.78, letterSpacing: "0.14em", textTransform: "uppercase", fontStyle: "normal" }}>
                  {lang === "en" ? "Explore the sea" : "استكشف البحر"}
                </span>
              </span>
              {showTeaser && (
                <span className="sea-free-dive-new" aria-hidden>
                  {lang === "en" ? "NEW" : "جديد"}
                </span>
              )}
              <span aria-hidden style={{ marginInlineStart: "auto" }}>
                {lang === "ar" ? "←" : "→"}
              </span>
            </button>
          </div>
          {dives.map((d) => (
            <DiveCard
              key={d.id}
              dive={d}
              onClick={
                d.state === "locked" ? undefined : () => router.push(d.href)
              }
            />
          ))}
          <QuizHubCard path="saif" unlocked={quizUnlocked} />
        </div>
      </div>
      <style>{`
        /* If screen is short or narrow, align to top to avoid clipping header */
        @media (max-width: 800px), (max-height: 700px) {
          .sea-stage {
            align-items: flex-start !important;
            align-content: flex-start !important;
            padding-top: 96px !important;
            padding-bottom: 40px !important;
          }
        }

        /* Dives column header — small panel with a wave glyph, the
           "Dives" title, and a completion count. Replaces the bare
           caps label so the column has a real visual anchor. */
        .sea-dives-head {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: linear-gradient(180deg, rgba(8,55,74,0.6) 0%, rgba(5,30,44,0.55) 100%);
          border: 1px solid rgba(244,184,96,0.32);
          border-radius: 14px;
          color: var(--foam);
        }
        .sea-dives-glyph {
          width: 28px;
          height: 28px;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(244,184,96,0.18);
          border: 1px solid rgba(244,184,96,0.5);
          border-radius: 50%;
          color: var(--sunset-gold);
          font-size: 16px;
          line-height: 1;
        }
        .sea-dives-title {
          flex: 1;
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-size: 18px;
          letter-spacing: 0.06em;
          color: var(--foam);
          text-transform: capitalize;
        }
        .sea-dives-count {
          font-family: var(--font-cormorant), serif;
          font-size: 13px;
          letter-spacing: 0.18em;
          color: var(--sunset-gold);
          opacity: 0.85;
          padding: 4px 10px;
          background: rgba(244,184,96,0.12);
          border: 1px solid rgba(244,184,96,0.35);
          border-radius: 999px;
        }

        /* Pearl Chest shortcut — context link from the sea hub to the
           chest where pearls accumulate before braiding. Same visual
           rhythm as the loom's view-tapestry button. */
        .sea-view-chest {
          padding: 12px 16px;
          background: rgba(8,55,74,0.6);
          border: 1px solid rgba(244,184,96,0.4);
          border-radius: 14px;
          color: var(--sunset-gold);
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-size: 14px;
          letter-spacing: 0.04em;
          cursor: pointer;
          display: flex;
          align-items: center;
          text-align: start;
          width: 100%;
          backdrop-filter: blur(6px);
          transition: background 0.22s var(--ease-water), border-color 0.22s var(--ease-water), transform 0.22s var(--ease-water);
        }
        .sea-view-chest:hover {
          background: rgba(244,184,96,0.18);
          border-color: var(--sunset-gold);
          transform: translateX(2px);
        }
        [dir="rtl"] .sea-view-chest:hover { transform: translateX(-2px); }

        /* Free Dive — exploration mode shortcut. Slightly cooler tint than
           the chest button so the two siblings read as related but distinct
           paths. Accent gradient mimics ripple light on the seabed. */
        .sea-free-dive {
          padding: 12px 16px;
          background: linear-gradient(
            120deg,
            rgba(8,55,74,0.7) 0%,
            rgba(28,90,120,0.55) 60%,
            rgba(8,55,74,0.7) 100%
          );
          border: 1px solid rgba(166,212,232,0.45);
          border-radius: 14px;
          color: var(--foam);
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-size: 14px;
          letter-spacing: 0.04em;
          cursor: pointer;
          display: flex;
          align-items: center;
          text-align: start;
          width: 100%;
          backdrop-filter: blur(6px);
          transition: background 0.22s var(--ease-water), border-color 0.22s var(--ease-water), transform 0.22s var(--ease-water);
        }
        .sea-free-dive:hover {
          background: linear-gradient(
            120deg,
            rgba(28,90,120,0.7) 0%,
            rgba(60,140,170,0.55) 60%,
            rgba(28,90,120,0.7) 100%
          );
          border-color: var(--foam);
          transform: translateX(2px);
        }
        [dir="rtl"] .sea-free-dive:hover { transform: translateX(-2px); }

        /* While the teaser is up, the button shimmers gently to draw the
           eye. Stops on hover so it doesn't fight the pointer state. */
        .sea-free-dive.teasing {
          animation: freeDiveShimmer 2.6s ease-in-out infinite;
          border-color: rgba(244,215,122,0.7);
          box-shadow: 0 0 24px rgba(244,184,96,0.25);
        }
        .sea-free-dive.teasing:hover { animation: none; }
        @keyframes freeDiveShimmer {
          0%, 100% { box-shadow: 0 0 24px rgba(244,184,96,0.2); }
          50% { box-shadow: 0 0 32px rgba(244,184,96,0.5); }
        }

        .sea-free-dive-new {
          margin-inline-start: 8px;
          padding: 2px 8px;
          background: linear-gradient(180deg, var(--saffron-soft), var(--sunset-gold));
          color: var(--sea-deep);
          border-radius: 999px;
          font-family: var(--font-cormorant), serif;
          font-style: normal;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          align-self: center;
        }

        /* Teaser callout — sits above the Free Dive button with a small
           arrow pointing down at it. Auto-dismisses on click of the
           button or the teaser's own ✕. */
        .free-dive-teaser {
          position: absolute;
          left: 0;
          right: 0;
          bottom: calc(100% + 10px);
          z-index: 6;
          padding: 12px 38px 12px 14px;
          background: linear-gradient(180deg, rgba(8,55,74,0.95), rgba(5,30,44,0.96));
          border: 1px solid rgba(244,184,96,0.6);
          border-radius: 14px;
          color: var(--foam);
          box-shadow: 0 14px 36px rgba(0,0,0,0.55), 0 0 24px rgba(244,184,96,0.18);
          backdrop-filter: blur(10px);
          animation: teaserIn 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        [dir="rtl"] .free-dive-teaser { padding: 12px 14px 12px 38px; }
        @keyframes teaserIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .free-dive-teaser-arrow {
          position: absolute;
          bottom: -10px;
          left: 28px;
          width: 18px;
          height: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--sunset-gold);
          font-size: 14px;
          animation: teaserBob 1.6s ease-in-out infinite;
        }
        @keyframes teaserBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }
        .free-dive-teaser-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .free-dive-teaser-eyebrow {
          font-family: var(--font-cormorant), serif;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--sunset-gold);
        }
        .free-dive-teaser-text {
          font-family: var(--font-cormorant), serif;
          font-size: 13px;
          line-height: 1.4;
          color: var(--foam);
        }
        .free-dive-teaser-close {
          position: absolute;
          top: 8px;
          inset-inline-end: 8px;
          width: 22px;
          height: 22px;
          background: transparent;
          border: 1px solid rgba(240,244,242,0.3);
          border-radius: 50%;
          color: var(--foam);
          cursor: pointer;
          font-size: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .free-dive-teaser-close:hover { background: rgba(240,244,242,0.12); }

        @media (prefers-reduced-motion: reduce) {
          .sea-free-dive.teasing,
          .free-dive-teaser-arrow { animation: none; }
        }
      `}</style>
    </SeaScene>
  );
}
