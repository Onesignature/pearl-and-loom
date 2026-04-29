"use client";

// Character choice — the primary hero on the home / family tent. Always
// visible: two large sibling cards side-by-side with a "Whose journey
// today?" prompt. Grade-aware: the sibling appropriate for the learner's
// age band gets a saffron "Recommended for you" pill but neither path is
// ever locked.

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { CharacterCard } from "./CharacterCard";

export function CharacterChoice() {
  const router = useRouter();
  const { t } = useI18n();
  const ops = useProgress((s) => s.ops);
  const pearls = useProgress((s) => s.pearls);
  const laylaQuizBest = useProgress((s) => s.quizScores.layla.bestScore);
  const saifQuizBest = useProgress((s) => s.quizScores.saif.bestScore);
  const grade = useSettings((s) => s.learnerGrade);
  const wovenCount = ops.filter((op) => op.kind !== "bead").length;

  // Grade 4-5 → Layla, Grade 7-8 → Saif, Grade 6 + null → balanced (no flag).
  const recommendLayla = grade !== null && grade <= 5;
  const recommendSaif = grade !== null && grade >= 7;
  // A path is "completed" once its quiz has been attempted at all — that's
  // the terminal step in the curriculum from the learner's POV.
  const completedLayla = laylaQuizBest !== null;
  const completedSaif = saifQuizBest !== null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "clamp(16px, 2.2vw, 28px)",
      }}
    >
      <div
        style={{
          color: "var(--wool)",
          fontSize: "clamp(11px, 0.9vw, 12px)",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          opacity: 0.55,
        }}
      >
        {t("home.chooseChild")}
      </div>
      <div
        style={{
          display: "flex",
          gap: "clamp(20px, 2.8vw, 36px)",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <CharacterCard
          who="layla"
          onClick={() => router.push("/loom")}
          progress={{ current: wovenCount, total: 30, label: "home.rowsWoven" }}
          recommended={recommendLayla}
          completed={completedLayla}
          quizScore={laylaQuizBest}
        />
        <CharacterCard
          who="saif"
          onClick={() => router.push("/sea")}
          progress={{ current: pearls.length, total: 12, label: "home.pearlsCollected" }}
          recommended={recommendSaif}
          completed={completedSaif}
          quizScore={saifQuizBest}
        />
      </div>
    </div>
  );
}
