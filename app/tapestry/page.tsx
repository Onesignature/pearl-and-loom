"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { TAPESTRY_25, TAPESTRY_TOTAL_ROWS } from "@/lib/tapestry/composition";
import { MOTIF_COMPONENTS, MOTIF_REGISTRY } from "@/components/motifs";

const PEARL_GRADIENT: Record<"common" | "fine" | "royal", string> = {
  common: "radial-gradient(circle at 30% 30%, #FFFFFF, #F4EBDC)",
  fine: "radial-gradient(circle at 30% 30%, #FFFFFF, #F2C7C3)",
  royal: "radial-gradient(circle at 30% 30%, #FFEFD3, #F4D77A)",
};

export default function TapestryFullPage() {
  const router = useRouter();
  const { t, fmt, lang } = useI18n();
  const ops = useProgress((s) => s.ops);
  const wovenCount = Math.min(
    Math.max(ops.filter((op) => op.kind !== "bead").length, 5),
    25,
  );
  const [zoom, setZoom] = useState(1);

  return (
    <TentScene time="day">
      <TopChrome
        onBack={() => router.push("/loom")}
        title={t("tapestry.title")}
        subtitle={`${t("loom.laylaSubtitle")} · ${fmt(wovenCount)}/${fmt(TAPESTRY_TOTAL_ROWS)} ${lang === "en" ? "ROWS" : "صف"}`}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 86,
          paddingBottom: 80,
          paddingInline: 40,
          display: "flex",
          gap: 28,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <div
            className="paper-aged"
            style={{
              padding: 22,
              border: "2px solid #6B4423",
              boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
              background: "linear-gradient(170deg, #5A3618, #3D2A1E)",
              transform: `scale(${zoom})`,
              transition: "transform 0.6s var(--ease-loom)",
            }}
          >
            <div
              className="ltr-internal"
              style={{
                width: 360,
                display: "flex",
                flexDirection: "column-reverse",
                border: "1px solid rgba(0,0,0,0.4)",
              }}
            >
              {TAPESTRY_25.slice(0, wovenCount).map((row, i) => {
                const Motif = MOTIF_COMPONENTS[row.motif];
                if (!Motif) return null;
                return (
                  <div key={i} style={{ position: "relative", height: 22 }}>
                    <Motif {...row.palette} w="100%" h="100%" />
                    {row.pearl && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: row.pearl === "royal" ? 14 : 10,
                          height: row.pearl === "royal" ? 14 : 10,
                          borderRadius: "50%",
                          background: PEARL_GRADIENT[row.pearl],
                          boxShadow:
                            "0 0 10px rgba(244,184,96,0.7), inset 0 -2px 4px rgba(0,0,0,0.2)",
                        }}
                      />
                    )}
                  </div>
                );
              })}
              {Array.from({ length: TAPESTRY_TOTAL_ROWS - wovenCount }).map((_, i) => (
                <div
                  key={`u${i}`}
                  style={{ height: 22, background: "var(--warp-lines)", opacity: 0.5 }}
                />
              ))}
            </div>
            <div
              className="ltr-internal"
              style={{ display: "flex", marginTop: 6, padding: "0 22px" }}
            >
              {Array.from({ length: TAPESTRY_TOTAL_ROWS }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 14,
                    borderInlineEnd: "1px solid #C9A876",
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div style={{ width: 280, color: "var(--wool)", overflowY: "auto" }}>
          <div
            className="font-display"
            style={{
              fontSize: 14,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--saffron)",
              marginBottom: 14,
            }}
          >
            {t("tapestry.motifLegend")}
          </div>
          {MOTIF_REGISTRY.map((m) => {
            const Motif = MOTIF_COMPONENTS[m.id];
            if (!Motif) return null;
            return (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 14,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 30,
                    border: "1px solid rgba(240,228,201,0.2)",
                    flexShrink: 0,
                  }}
                >
                  <Motif w="100%" h="100%" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span
                      className="font-display"
                      style={{ fontSize: 14, color: "var(--wool)" }}
                    >
                      {m.en}
                    </span>
                    <span
                      className="font-arabic"
                      style={{ fontSize: 13, color: "var(--saffron)" }}
                    >
                      {m.ar}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(240,228,201,0.55)",
                      marginTop: 2,
                      lineHeight: 1.4,
                    }}
                  >
                    {lang === "en" ? m.noteEn : m.noteAr}
                  </div>
                </div>
              </div>
            );
          })}
          <div
            style={{
              marginTop: 22,
              padding: "12px 14px",
              background: "rgba(232,163,61,0.1)",
              borderInlineStart: "3px solid var(--saffron)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--saffron)",
                marginBottom: 6,
              }}
            >
              {t("tapestry.pearlBeads")}
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 11 }}>
              <PearlLegend grade="common" label={t("pearl.common")} />
              <PearlLegend grade="fine" label={t("pearl.fine")} />
              <PearlLegend grade="royal" label={t("pearl.royal")} />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 20,
          insetInlineStart: 40,
          insetInlineEnd: 40,
          display: "flex",
          gap: 18,
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "var(--wool)",
          }}
        >
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            {t("tapestry.zoom")}
          </span>
          <input
            type="range"
            min="0.6"
            max="1.6"
            step="0.02"
            value={zoom}
            onChange={(e) => setZoom(+e.target.value)}
            style={{ flex: 1, maxWidth: 240, accentColor: "var(--saffron)" }}
          />
          <span
            className="font-display"
            style={{ minWidth: 50, color: "var(--saffron)" }}
          >
            {fmt(Math.round(zoom * 100))}%
          </span>
        </div>
        <button className="tap-btn">{t("tapestry.download")}</button>
        <button className="tap-btn">{t("tapestry.share")}</button>
      </div>
      <style>{`
        .tap-btn {
          padding: 10px 18px;
          background: rgba(245,235,211,0.08);
          border: 1px solid rgba(240,228,201,0.25);
          color: var(--wool);
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          cursor: pointer;
        }
        .tap-btn:hover { background: rgba(245,235,211,0.16); }
      `}</style>
    </TentScene>
  );
}

function PearlLegend({
  grade,
  label,
}: {
  grade: "common" | "fine" | "royal";
  label: string;
}) {
  const colorVar = {
    common: "var(--pearl-common)",
    fine: "var(--pearl-fine)",
    royal: "var(--pearl-royal)",
  }[grade];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: colorVar,
          display: "inline-block",
          marginInlineEnd: 4,
        }}
      />
      {label}
    </span>
  );
}
