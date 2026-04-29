"use client";

// Footer band on the home / family-tent screen — shows the family heirloom
// label, both contribution counters (Layla's rows + Saif's pearls), and the
// in-progress tapestry strip preview. Sits pinned to the bottom of the home
// viewport.

import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { TapestryStrip } from "@/components/tapestry/TapestryStrip";

export function HeirloomFooter() {
  const { fmt, lang } = useI18n();
  const ops = useProgress((s) => s.ops);
  const pearls = useProgress((s) => s.pearls);
  const wovenCount = ops.filter((op) => op.kind !== "bead").length;

  return (
    <div
      className="heirloom-footer"
      style={{
        position: "absolute",
        bottom: 0,
        insetInlineStart: 0,
        insetInlineEnd: 0,
        padding: "16px clamp(16px, 2.2vw, 28px)",
        background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <div
          className="heirloom-label"
          style={{
            color: "var(--wool)",
            fontSize: "clamp(10px, 0.85vw, 11px)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          {lang === "en" ? "The family heirloom" : "الإرث العائلي"}
        </div>
        <div
          className="heirloom-counters"
          style={{ display: "flex", gap: 22, alignItems: "baseline", flexWrap: "wrap" }}
        >
          <ContributionLabel
            name={lang === "en" ? "Layla" : "ليلى"}
            count={fmt(wovenCount)}
            total={fmt(30)}
            unit={lang === "en" ? "rows" : "صف"}
          />
          <span className="heirloom-plus" style={{ color: "var(--saffron)", opacity: 0.4 }}>+</span>
          <ContributionLabel
            name={lang === "en" ? "Saif" : "سيف"}
            count={fmt(pearls.length)}
            total={fmt(12)}
            unit={lang === "en" ? "pearls" : "لؤلؤة"}
          />
        </div>
      </div>
      <TapestryStrip woven={wovenCount} height={48} />
      <style>{`
        @media (max-width: 640px) {
          .heirloom-counters { gap: 14px !important; }
        }
        @media (max-width: 480px) {
          .heirloom-label { display: none; }
          .heirloom-plus { display: none; }
          .heirloom-footer { padding: 10px 14px !important; }
        }
      `}</style>
    </div>
  );
}

interface ContributionLabelProps {
  name: string;
  count: string;
  total: string;
  unit: string;
}

function ContributionLabel({ name, count, total, unit }: ContributionLabelProps) {
  return (
    <div
      style={{
        color: "var(--saffron)",
        fontSize: 12,
        fontFamily: "var(--font-cormorant), serif",
        letterSpacing: "0.1em",
      }}
    >
      <span
        style={{
          opacity: 0.55,
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          marginInlineEnd: 8,
        }}
      >
        {name}
      </span>
      <span className="font-display" style={{ fontSize: 18 }}>
        {count}
      </span>
      <span style={{ opacity: 0.5, margin: "0 4px" }}>/</span>
      <span style={{ opacity: 0.7 }}>
        {total} {unit}
      </span>
    </div>
  );
}
