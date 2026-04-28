"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { SeaScene } from "@/components/scenes/SeaScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { NauticalMap } from "@/components/sea/NauticalMap";
import { DiveCard } from "@/components/sea/DiveCard";

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

export default function SeaHubPage() {
  const router = useRouter();
  const { t } = useI18n();
  return (
    <SeaScene>
      <TopChrome
        onHome={() => router.push("/")}
        title={t("sea.hubTitle")}
        subtitle={`${t("sea.saif")} · ${t("sea.ghasaSeason")}`}
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
        <div
          style={{
            flex: "1 1 60%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            minWidth: 0,
          }}
        >
          <NauticalMap dives={DIVES} />
        </div>
        <div style={{ width: 340, display: "flex", flexDirection: "column", gap: 12 }}>
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
        </div>
      </div>
    </SeaScene>
  );
}
