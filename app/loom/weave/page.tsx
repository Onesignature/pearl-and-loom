"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";

const TIMINGS = [400, 800, 600];

// Loom curriculum order — used to pick the "next lesson" CTA after the
// learner has just completed one. Mirrors LESSONS in app/loom/page.tsx
// but stripped to just id + href + unlock requirement.
const LESSON_ORDER: { id: string; href: string; requires: number }[] = [
  { id: "symmetry", href: "/loom/lessons/symmetry", requires: 0 },
  { id: "fractions", href: "/loom/lessons/fractions", requires: 0 },
  { id: "tessellation", href: "/loom/lessons/tessellation", requires: 0 },
  { id: "arrays", href: "/loom/lessons/arrays", requires: 3 },
  { id: "angles", href: "/loom/lessons/angles", requires: 3 },
];

export default function WeaveAnimPage() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const completed = useProgress((s) => s.loomLessonsCompleted);
  const quizBest = useProgress((s) => s.quizScores.layla.bestScore);
  const [phase, setPhase] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Pick the next destination so the learner always has an obvious move
  // after the weave animation. Priority:
  //   1. The next not-yet-completed lesson they can unlock.
  //   2. The final quiz, once all 5 lessons are done and the quiz is unattempted.
  //   3. Back to the lesson hub (everything done).
  const nextLesson = LESSON_ORDER.find(
    (l) => !completed.includes(l.id) && completed.length >= l.requires,
  );
  let primaryHref: string;
  let primaryLabel: string;
  if (nextLesson) {
    primaryHref = nextLesson.href;
    primaryLabel = t("weave.nextLesson");
  } else if (quizBest === null) {
    primaryHref = "/loom/quiz";
    primaryLabel = t("weave.takeQuiz");
  } else {
    primaryHref = "/loom";
    primaryLabel = t("weave.backToLessons");
  }
  const arrow = lang === "ar" ? "←" : "→";

  useEffect(() => {
    if (!autoPlay) return;
    const id = setTimeout(() => {
      setPhase((p) => (p + 1) % 3);
    }, TIMINGS[phase]);
    return () => clearTimeout(id);
  }, [phase, autoPlay]);

  return (
    <TentScene time="day">
      <TopChrome
        onBack={() => router.push("/loom")}
        title={t("weave.title")}
        subtitle={t("weave.subtitle")}
      />
      <div
        className="weave-scroll"
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 86,
          paddingBottom: 60,
          paddingInline: "clamp(16px, 3vw, 60px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ flex: "1 1 220px", minWidth: 220 }}>
              <div
                style={{
                  aspectRatio: "1.4",
                  background: "var(--charcoal-soft)",
                  border:
                    i === phase
                      ? "2px solid var(--saffron)"
                      : "1px solid rgba(240,228,201,0.15)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <WeaveKeyframe stage={i} active={i === phase} />
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 11,
                  letterSpacing: "0.25em",
                  color: i === phase ? "var(--saffron)" : "rgba(240,228,201,0.5)",
                  textTransform: "uppercase",
                }}
              >
                {i === 0 && t("weave.warpSet")}
                {i === 1 && t("weave.shuttlePass")}
                {i === 2 && t("weave.rowComplete")}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <button onClick={() => setAutoPlay(!autoPlay)} className="anim-btn">
            {autoPlay ? t("weave.pause") : t("weave.play")}
          </button>
          <button
            onClick={() => {
              setAutoPlay(false);
              setPhase((phase + 1) % 3);
            }}
            className="anim-btn"
          >
            {t("weave.step")}
          </button>
          <button
            onClick={() => router.push("/tapestry")}
            className="anim-btn"
          >
            {t("weave.viewTapestry")}
          </button>
          <button
            onClick={() => router.push(primaryHref)}
            className="anim-btn primary"
          >
            {primaryLabel} {arrow}
          </button>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .weave-scroll {
            justify-content: flex-start !important;
            padding-top: 124px !important;
          }
        }
        @media (max-width: 640px) {
          .weave-scroll {
            padding-top: 132px !important;
          }
        }
        .anim-btn {
          padding: 12px 22px;
          background: rgba(245,235,211,0.08);
          border: 1px solid rgba(240,228,201,0.25);
          border-radius: 999px;
          color: var(--wool);
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          letter-spacing: 0.3em;
          cursor: pointer;
          transition: all 0.3s var(--ease-loom);
        }
        .anim-btn:hover { background: rgba(245,235,211,0.16); }
        .anim-btn.primary {
          background: var(--saffron);
          color: var(--charcoal);
          border-color: var(--saffron);
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(232,163,61,0.32);
        }
        .anim-btn.primary:hover {
          background: var(--saffron-soft);
        }
      `}</style>
    </TentScene>
  );
}

function WeaveKeyframe({ stage, active }: { stage: number; active: boolean }) {
  return (
    <svg
      viewBox="0 0 400 280"
      style={{ width: "100%", height: "100%" }}
      className="ltr-internal"
    >
      {Array.from({ length: 36 }).map((_, i) => (
        <line
          key={i}
          x1={20 + i * 10.3}
          y1="20"
          x2={20 + i * 10.3}
          y2="260"
          stroke="#C9A876"
          strokeWidth="1"
          opacity="0.85"
        />
      ))}
      <rect x="20" y="220" width="360" height="40" fill="#B5341E" />
      <g transform="translate(20 220)">
        {[...Array(9)].map((_, i) => (
          <path
            key={i}
            d={`M ${i * 40} 0 L ${i * 40 + 20} 20 L ${i * 40 + 40} 0 Z`}
            fill="#E8A33D"
          />
        ))}
      </g>
      <rect x="20" y="200" width="360" height="20" fill="#1B2D5C" />

      {stage === 0 && (
        <g>
          <g transform="translate(60 170)">
            <ellipse cx="0" cy="0" rx="28" ry="6" fill="#4A2F18" />
            <ellipse cx="0" cy="-1" rx="24" ry="4" fill="#6B4423" />
          </g>
          <rect
            x="20"
            y="160"
            width="360"
            height="32"
            fill="rgba(232,163,61,0.15)"
          />
        </g>
      )}
      {stage === 1 && (
        <g>
          <defs>
            <linearGradient id="trailGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E8A33D" stopOpacity="0" />
              <stop offset="100%" stopColor="#E8A33D" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <rect x="20" y="166" width="180" height="8" fill="url(#trailGrad)" />
          <g transform="translate(200 170)">
            <ellipse cx="0" cy="0" rx="28" ry="6" fill="#4A2F18" />
            <ellipse cx="0" cy="-1" rx="24" ry="4" fill="#6B4423" />
          </g>
          <g transform="translate(20 160)">
            {[...Array(5)].map((_, i) => (
              <path
                key={i}
                d={`M ${i * 40} 0 L ${i * 40 + 20} 20 L ${i * 40 + 40} 0 Z`}
                fill="#E8A33D"
                opacity="0.85"
              />
            ))}
          </g>
        </g>
      )}
      {stage === 2 && (
        <g>
          <rect x="20" y="160" width="360" height="40" fill="#B5341E" />
          <g transform="translate(20 160)">
            {[...Array(9)].map((_, i) => (
              <path
                key={i}
                d={`M ${i * 40} 0 L ${i * 40 + 20} 20 L ${i * 40 + 40} 0 Z`}
                fill="#E8A33D"
              />
            ))}
          </g>
          <rect
            x="14"
            y="154"
            width="372"
            height="52"
            fill="none"
            stroke="#F4B860"
            strokeWidth="2"
            opacity={active ? 0.8 : 0}
            style={{ animation: active ? "pulseRing 0.6s var(--ease-loom)" : "none" }}
          />
        </g>
      )}
    </svg>
  );
}
