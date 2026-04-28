"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { LoomFigure } from "@/components/loom/LoomFigure";
import { LessonCard } from "@/components/loom/LessonCard";

interface LessonDef {
  id: "symmetry" | "fractions" | "tessellation" | "arrays" | "angles";
  href: string | null;
  state: "available" | "locked";
}

const LESSONS: LessonDef[] = [
  { id: "symmetry", href: "/loom/lessons/symmetry", state: "available" },
  { id: "fractions", href: "/loom/lessons/fractions", state: "available" },
  { id: "tessellation", href: "/loom/lessons/tessellation", state: "available" },
  { id: "arrays", href: null, state: "locked" },
  { id: "angles", href: null, state: "locked" },
];

export default function LoomHubPage() {
  const router = useRouter();
  const { t, fmt } = useI18n();
  const ops = useProgress((s) => s.ops);
  const wovenCount = ops.filter((op) => op.kind !== "bead").length;

  return (
    <TentScene time="day">
      <TopChrome
        onHome={() => router.push("/")}
        title={t("loom.hubTitle")}
        subtitle={`${t("loom.laylaSubtitle")} · ${fmt(wovenCount)}/${fmt(5)} ${t("loom.completed").toUpperCase()}`}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          paddingTop: 86,
          paddingBottom: 28,
          paddingInline: 32,
          gap: 28,
        }}
      >
        <div style={{ flex: "1 1 60%", position: "relative", minWidth: 0 }}>
          <LoomFigure progress={wovenCount} total={30} />
        </div>
        <div
          style={{
            width: 360,
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
          {LESSONS.map((l, i) => (
            <LessonCard
              key={l.id}
              index={i + 1}
              title={t(`loom.titles.${l.id}` as never)}
              state={l.state}
              onClick={l.href ? () => router.push(l.href as string) : undefined}
            />
          ))}
        </div>
      </div>
    </TentScene>
  );
}
