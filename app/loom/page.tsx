"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { LoomFigure } from "@/components/loom/LoomFigure";
import { LessonCard } from "@/components/loom/LessonCard";
import { CinematicLayla } from "@/components/portraits/CinematicLayla";
import { QuizHubCard } from "@/components/quiz/QuizHubCard";

interface LessonDef {
  id: "symmetry" | "fractions" | "tessellation" | "arrays" | "angles";
  href: string;
  /** Number of completed core lessons required to unlock. */
  requires: number;
}

const LESSONS: LessonDef[] = [
  { id: "symmetry", href: "/loom/lessons/symmetry", requires: 0 },
  { id: "fractions", href: "/loom/lessons/fractions", requires: 0 },
  { id: "tessellation", href: "/loom/lessons/tessellation", requires: 0 },
  { id: "arrays", href: "/loom/lessons/arrays", requires: 3 },
  { id: "angles", href: "/loom/lessons/angles", requires: 3 },
];

export default function LoomHubPage() {
  const router = useRouter();
  const { t, fmt, dir } = useI18n();
  const completed = useProgress((s) => s.loomLessonsCompleted);
  const ops = useProgress((s) => s.ops);
  const wovenCount = ops.filter((op) => op.kind !== "bead").length;

  const stateFor = (l: LessonDef): "available" | "locked" | "completed" => {
    if (completed.includes(l.id)) return "completed";
    if (completed.length >= l.requires) return "available";
    return "locked";
  };

  return (
    <TentScene time="day">
      <TopChrome
        onHome={() => router.push("/")}
        title={t("loom.hubTitle")}
        subtitle={`${t("loom.laylaSubtitle")} · ${fmt(completed.length)}/${fmt(LESSONS.length)} ${t("loom.completed").toUpperCase()}`}
      />
      <div
        className="loom-stage"
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
            flex: "1 1 560px",
            minWidth: "min(100%, 320px)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoomFigure progress={wovenCount} total={30} />
          {/* Cinematic Layla seated at the loom — bottom-left, in front */}
          <div
            style={{
              position: "absolute",
              bottom: -10,
              insetInlineStart: "4%",
              width: 280,
              pointerEvents: "none",
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))",
              zIndex: 5,
            }}
          >
            <CinematicLayla scale={0.78} />
          </div>
        </div>
        <div
          style={{
            flex: "0 1 360px",
            minWidth: "min(100%, 280px)",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div className="loom-lessons-head">
            <span className="loom-lessons-glyph" aria-hidden>▦</span>
            <span className="loom-lessons-title">{t("loom.lessons")}</span>
            <span className="loom-lessons-count">
              {completed.length} / {LESSONS.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push("/tapestry?from=loom")}
            className="loom-view-tapestry"
          >
            <span aria-hidden style={{ marginInlineEnd: 8 }}>▤</span>
            {t("nav.tapestry")}
            <span aria-hidden style={{ marginInlineStart: "auto" }}>
              {dir === "rtl" ? "←" : "→"}
            </span>
          </button>
          {LESSONS.map((l, i) => {
            const state = stateFor(l);
            return (
              <LessonCard
                key={l.id}
                index={i + 1}
                title={t(`loom.titles.${l.id}` as never)}
                state={state}
                onClick={
                  state === "locked"
                    ? undefined
                    : () => router.push(l.href)
                }
              />
            );
          })}
          <QuizHubCard
            path="layla"
            unlocked={LESSONS.every((l) => completed.includes(l.id))}
          />
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .loom-stage {
            align-items: flex-start !important;
            align-content: flex-start !important;
            padding-top: 96px !important;
            padding-bottom: 40px !important;
          }
        }

        /* Lessons column header — matches the sea-dives-head shape so
           both hubs read as siblings. Glyph + italic title + count. */
        .loom-lessons-head {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: linear-gradient(180deg, rgba(48,30,18,0.65) 0%, rgba(20,12,8,0.6) 100%);
          border: 1px solid rgba(232,163,61,0.32);
          border-radius: 14px;
          color: var(--wool);
        }
        .loom-lessons-glyph {
          width: 28px;
          height: 28px;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(232,163,61,0.18);
          border: 1px solid rgba(232,163,61,0.5);
          border-radius: 50%;
          color: var(--saffron);
          font-size: 14px;
          line-height: 1;
        }
        .loom-lessons-title {
          flex: 1;
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-size: 18px;
          letter-spacing: 0.06em;
          color: var(--wool);
          text-transform: capitalize;
        }
        .loom-lessons-count {
          font-family: var(--font-cormorant), serif;
          font-size: 13px;
          letter-spacing: 0.18em;
          color: var(--saffron);
          opacity: 0.85;
          padding: 4px 10px;
          background: rgba(232,163,61,0.12);
          border: 1px solid rgba(232,163,61,0.35);
          border-radius: 999px;
        }

        /* View Tapestry — context link from the loom hub directly to
           the heirloom artifact. Same look as the dive-card row so the
           kid recognises it as part of the lesson list. */
        .loom-view-tapestry {
          padding: 12px 16px;
          background: rgba(245,235,211,0.06);
          border: 1px solid rgba(232,163,61,0.4);
          border-radius: 14px;
          color: var(--saffron);
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-size: 14px;
          letter-spacing: 0.04em;
          cursor: pointer;
          display: flex;
          align-items: center;
          text-align: start;
          width: 100%;
          transition: background 0.22s var(--ease-loom), border-color 0.22s var(--ease-loom), transform 0.22s var(--ease-loom);
        }
        .loom-view-tapestry:hover {
          background: rgba(232,163,61,0.18);
          border-color: var(--saffron);
          transform: translateX(2px);
        }
        [dir="rtl"] .loom-view-tapestry:hover { transform: translateX(-2px); }
      `}</style>
    </TentScene>
  );
}
