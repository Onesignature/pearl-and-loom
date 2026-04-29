"use client";

// Character choice section — "Whose journey today?" prompt + the two
// sibling cards. Self-contained so the home page can place it inside any
// layout without worrying about internal spacing.

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { CharacterCard } from "./CharacterCard";

export function CharacterChoice() {
  const router = useRouter();
  const { t } = useI18n();
  const ops = useProgress((s) => s.ops);
  const pearls = useProgress((s) => s.pearls);
  const wovenCount = ops.filter((op) => op.kind !== "bead").length;

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
        />
        <CharacterCard
          who="saif"
          onClick={() => router.push("/sea")}
          progress={{ current: pearls.length, total: 12, label: "home.pearlsCollected" }}
        />
      </div>
    </div>
  );
}
