"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { LoomFigure } from "@/components/loom/LoomFigure";
import { LessonCard } from "@/components/loom/LessonCard";
import { CinematicLayla } from "@/components/portraits/CinematicLayla";

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
  const { t, fmt } = useI18n();
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
          <div
            style={{
              color: "var(--wool)",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: 4,
            }}
          >
            {t("loom.lessons")}
          </div>
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
        </div>
      </div>
    </TentScene>
  );
}
