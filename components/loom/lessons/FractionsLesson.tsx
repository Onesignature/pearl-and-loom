"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { LessonShell, ProblemCard } from "./LessonShell";
import { playCue } from "@/lib/audio/cues";

export function FractionsLesson() {
  const router = useRouter();
  const { t, fmt, lang } = useI18n();
  const completeLoomLesson = useProgress((s) => s.completeLoomLesson);

  const [top, setTop] = useState<Set<number>>(new Set());
  const [bot, setBot] = useState<Set<number>>(new Set());
  const [showProof, setShowProof] = useState(false);

  const topCorrect = top.size === 3;
  const botCorrect = bot.size === 6;
  const both = topCorrect && botCorrect;

  function onCta() {
    if (!both) return;
    if (!showProof) {
      setShowProof(true);
      return;
    }
    playCue("loom.thump");
    completeLoomLesson("fractions", {
      kind: "fraction",
      numerator: 3,
      denominator: 8,
      lessonId: "fractions",
    });
    router.push("/loom/weave");
  }

  const question =
    lang === "en"
      ? "Color 3⁄8 of the top row in madder red. Then show an equivalent fraction in the 16-cell row below."
      : "لوّن ٣⁄٨ من الصف العلوي بالأحمر. ثم أظهر كسرًا مكافئًا في الصف ذي الـ١٦ خلية أدناه.";
  const sadu =
    lang === "en"
      ? "Doubling threads halves cell width — the same fraction, finer cloth."
      : "مضاعفة الخيط تنصف عرض الخلية — نفس الكسر، قماش أدق.";
  const proof =
    lang === "en"
      ? "3⁄8 × 2⁄2 = 6⁄16. The shaded fabric is the same length — just woven with finer thread."
      : "٣⁄٨ × ٢⁄٢ = ٦⁄١٦. القماش الملوّن نفس الطول — لكن بخيط أدق.";

  const ctaLabel = !both
    ? t("loom.weaveThisRow")
    : showProof
      ? t("loom.weaveThisRow")
      : t("loom.proveIt");

  return (
    <LessonShell titleKey="loom.titles.fractions" index={2}>
      <ProblemCard question={question} saduNote={sadu} ctaLabel={ctaLabel} ctaDisabled={!both} onCta={onCta}>
        <div
          style={{
            marginTop: 22,
            display: "flex",
            gap: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FractionDisplay n={top.size} d={8} highlight={topCorrect} />
          <span style={{ fontSize: 32, color: "var(--ink-soft)" }}>=</span>
          <FractionDisplay n={bot.size} d={16} highlight={botCorrect} />
        </div>
        {showProof && both && (
          <div
            style={{
              marginTop: 18,
              padding: 14,
              background: "rgba(232,163,61,0.18)",
              borderInlineStart: "3px solid var(--saffron)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontFamily: "var(--font-cormorant), serif",
                color: "var(--ink)",
                letterSpacing: "0.06em",
              }}
            >
              {proof}
            </div>
          </div>
        )}
      </ProblemCard>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        <FractionRow
          cells={8}
          filled={top}
          setFilled={setTop}
          target={3}
          label={
            lang === "en" ? `8 cells — color 3` : `٨ خلايا — لوّن ٣`
          }
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "var(--saffron)",
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 18,
            letterSpacing: "0.3em",
          }}
        >
          {lang === "en" ? "EQUIVALENT" : "متكافئ"}
          <span style={{ marginInline: 16, fontSize: 32 }}>↕</span>
        </div>
        <FractionRow
          cells={16}
          filled={bot}
          setFilled={setBot}
          target={6}
          label={lang === "en" ? `16 cells — color 6` : `١٦ خلية — لوّن ٦`}
        />
      </div>
    </LessonShell>
  );

  function FractionDisplay({
    n,
    d,
    highlight,
  }: {
    n: number;
    d: number;
    highlight: boolean;
  }) {
    return (
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          lineHeight: 1,
          color: highlight ? "var(--madder)" : "var(--ink)",
        }}
      >
        <div className="font-display" style={{ fontSize: 36 }}>
          {fmt(n)}
        </div>
        <div style={{ width: 30, height: 2, background: "currentColor", margin: "4px 0" }} />
        <div className="font-display" style={{ fontSize: 22 }}>
          {fmt(d)}
        </div>
      </div>
    );
  }
}

interface FractionRowProps {
  cells: number;
  filled: Set<number>;
  setFilled: (s: Set<number>) => void;
  target: number;
  label: string;
}

function FractionRow({ cells, filled, setFilled, target, label }: FractionRowProps) {
  const { fmt } = useI18n();
  function toggle(i: number) {
    const next = new Set(filled);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setFilled(next);
  }
  return (
    <div style={{ width: "100%", maxWidth: 720 }}>
      <div
        style={{
          fontSize: 11,
          color: "var(--wool)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: 0.6,
          marginBottom: 8,
        }}
      >
        {label} · {fmt(filled.size)}/{fmt(target)}
      </div>
      <div
        className="ltr-internal"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cells}, 1fr)`,
          gap: 2,
          background: "var(--charcoal-soft)",
          padding: 4,
          height: 60,
          border: "1px solid rgba(240,228,201,0.2)",
        }}
      >
        {Array.from({ length: cells }).map((_, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            style={{
              background: filled.has(i) ? "var(--madder)" : "var(--wool)",
              border: "none",
              cursor: "pointer",
              backgroundImage: filled.has(i)
                ? "linear-gradient(135deg, rgba(255,255,255,0.15), transparent 50%, rgba(0,0,0,0.2))"
                : "linear-gradient(135deg, rgba(120,90,40,0.08), transparent 50%, rgba(120,90,40,0.15))",
              transition: "background 0.25s var(--ease-loom)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
