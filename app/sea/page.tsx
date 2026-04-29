"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { SeaScene } from "@/components/scenes/SeaScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { NauticalMap } from "@/components/sea/NauticalMap";
import { DiveCard } from "@/components/sea/DiveCard";
import { QuizHubCard } from "@/components/quiz/QuizHubCard";

export interface DiveDef {
  id: number;
  key: "shallowBank" | "deepReef" | "coralGarden" | "lungOfSea" | "refractionTrial";
  depth: number;
  state: "available" | "locked";
  href: string | null;
}

export const DIVES: DiveDef[] = [
  { id: 1, key: "shallowBank", depth: 5, state: "available", href: "/sea/dives/shallowBank" },
  { id: 2, key: "deepReef", depth: 10, state: "available", href: "/sea/dives/deepReef" },
  { id: 3, key: "coralGarden", depth: 12, state: "available", href: "/sea/dives/coralGarden" },
  { id: 4, key: "lungOfSea", depth: 15, state: "locked", href: null },
  { id: 5, key: "refractionTrial", depth: 20, state: "locked", href: null },
];

const REQUIRED_DIVES = ["shallowBank", "deepReef", "coralGarden"];

export default function SeaHubPage() {
  const router = useRouter();
  const { t } = useI18n();
  const completed = useProgress((s) => s.diveLessonsCompleted);
  const quizUnlocked = REQUIRED_DIVES.every((id) => completed.includes(id));
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
            flex: "1 1 560px",
            minWidth: "min(100%, 320px)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <NauticalMap dives={DIVES} />
        </div>
        <div
          style={{
            flex: "0 1 340px",
            minWidth: "min(100%, 280px)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              color: "var(--foam)",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              opacity: 0.7,
              marginBottom: 4,
            }}
          >
            {t("sea.dives")}
          </div>
          {DIVES.map((d) => (
            <DiveCard
              key={d.id}
              dive={d}
              onClick={d.href ? () => router.push(d.href as string) : undefined}
            />
          ))}
          <QuizHubCard path="saif" unlocked={quizUnlocked} />
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .sea-stage {
            align-items: flex-start !important;
            align-content: flex-start !important;
            padding-top: 96px !important;
            padding-bottom: 40px !important;
          }
        }
      `}</style>
    </SeaScene>
  );
}
