"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { LessonShell, ProblemCard } from "./LessonShell";
import { LessonSaduPreview } from "./LessonSaduPreview";
import { playCue } from "@/lib/audio/cues";
import type { PatternOp } from "@/lib/pattern-engine/types";

const PLANNED_OP: PatternOp = {
  kind: "symmetry",
  axis: "vertical",
  lessonId: "symmetry",
};

const COLS = 8;
const ROWS = 4;
const TOP_PATTERN = new Set([1, 6, 9, 10, 13, 14, 17, 18, 19, 20, 21, 22]);

export function SymmetryLesson() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const completeLoomLesson = useProgress((s) => s.completeLoomLesson);

  const [filled, setFilled] = useState<Set<number>>(new Set());
  const [celebrating, setCelebrating] = useState(false);

  const correctMirror = useMemo(() => {
    const s = new Set<number>();
    TOP_PATTERN.forEach((i) => {
      const row = Math.floor(i / COLS);
      const col = i % COLS;
      const mirroredRow = ROWS - 1 - row;
      s.add(mirroredRow * COLS + col);
    });
    return s;
  }, []);

  const isCorrect =
    filled.size === correctMirror.size && [...filled].every((i) => correctMirror.has(i));

  function toggle(i: number) {
    if (celebrating) return;
    const next = new Set(filled);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setFilled(next);
  }

  function weave() {
    if (!isCorrect) return;
    setCelebrating(true);
    playCue("loom.thump");
    completeLoomLesson("symmetry", PLANNED_OP);
    setTimeout(() => router.push("/loom/weave"), 1400);
  }

  const question =
    lang === "en"
      ? "Mirror the motif across the line of symmetry."
      : "اعكس الزخرفة حول خط التماثل.";
  const hint =
    lang === "en"
      ? "Each square below mirrors the square above it. Tap cells in the bottom grid to weave the reflected motif."
      : "كل مربع في الأسفل يعكس المربع الذي يقابله. انقر الخلايا في الشبكة السفلى لنسج الزخرفة المعكوسة.";
  const sadu =
    lang === "en"
      ? "Bedouin weavers count threads to keep symmetry — the loom itself enforces the math."
      : "النسّاجات البدويات يحسبن الخيوط لحفظ التماثل — النَّول نفسه يفرض الرياضيات.";

  return (
    <LessonShell titleKey="loom.titles.symmetry" index={1}>
      <ProblemCard
        problemNumber={{ current: 1, total: 3 }}
        question={question}
        hint={hint}
        saduNote={sadu}
        ctaLabel={celebrating ? t("loom.woven") : t("loom.weaveThisRow")}
        ctaDisabled={!isCorrect || celebrating}
        onCta={weave}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          position: "relative",
        }}
      >
        <div
          style={{
            marginBottom: 12,
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "var(--wool)",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          {t("loom.given")}
        </div>
        <SymGrid filled={TOP_PATTERN} editable={false} />
        <Axis />
        <SymGrid
          filled={filled}
          correct={isCorrect ? correctMirror : null}
          celebrating={celebrating}
          editable={!celebrating}
          onToggle={toggle}
        />
        <div
          style={{
            marginTop: 12,
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "var(--wool)",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          {t("loom.yourWeave")}
          {isCorrect && (
            <span style={{ color: "var(--saffron)", marginInlineStart: 12 }}>
              ✓ {t("loom.symmetric")}
            </span>
          )}
        </div>
      </div>
      <div className="lesson-preview-row">
        <LessonSaduPreview plannedOp={PLANNED_OP} locked={isCorrect} />
      </div>
    </LessonShell>
  );
}

function Axis() {
  const { t } = useI18n();
  return (
    <div style={{ position: "relative", height: 22, width: "min(100%, 640px)" }}>
      <div
        style={{
          position: "absolute",
          insetInlineStart: "50%",
          top: 0,
          bottom: 0,
          borderInlineStart: "2px dashed var(--saffron)",
        }}
      />
      <div
        style={{
          position: "absolute",
          insetInlineStart: 0,
          insetInlineEnd: 0,
          top: "50%",
          borderTop: "2px dashed var(--saffron)",
        }}
      />
      <div
        style={{
          position: "absolute",
          insetInlineStart: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "var(--charcoal)",
          color: "var(--saffron)",
          fontSize: 10,
          padding: "2px 8px",
          letterSpacing: "0.2em",
        }}
      >
        {t("loom.axis")}
      </div>
    </div>
  );
}

interface SymGridProps {
  filled: Set<number>;
  correct?: Set<number> | null;
  celebrating?: boolean;
  editable: boolean;
  onToggle?: (i: number) => void;
}

function SymGrid({ filled, correct, celebrating, editable, onToggle }: SymGridProps) {
  return (
    <div
      className="ltr-internal"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
        aspectRatio: `${COLS} / ${ROWS}`,
        width: "min(100%, 480px)",
        gap: 2,
        background: "var(--charcoal-soft)",
        padding: 6,
        border: "1px solid rgba(240,228,201,0.2)",
      }}
    >
      {Array.from({ length: COLS * ROWS }).map((_, i) => {
        const isFilled = filled.has(i);
        return (
          <button
            key={i}
            onClick={() => editable && onToggle?.(i)}
            style={{
              aspectRatio: "1 / 1",
              background: isFilled ? "var(--madder)" : "var(--wool)",
              border: "none",
              cursor: editable ? "pointer" : "default",
              transition: "background 0.3s var(--ease-loom), transform 0.4s",
              backgroundImage: isFilled
                ? "linear-gradient(135deg, rgba(255,255,255,0.15), transparent 50%, rgba(0,0,0,0.15))"
                : "linear-gradient(135deg, rgba(120,90,40,0.1), transparent 50%, rgba(120,90,40,0.18))",
              transform: celebrating && isFilled ? "scale(0.98)" : "scale(1)",
              boxShadow:
                celebrating && correct && correct.has(i)
                  ? "0 0 14px var(--saffron) inset"
                  : "none",
            }}
            aria-label={`cell-${i}`}
          />
        );
      })}
    </div>
  );
}
