"use client";

// Grade 4 multiplication via Sadu arrays. The student sets rows and cols on
// a live grid and types the product — three things must agree (rows match
// target, cols match target, product = rows*cols) before the row weaves.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { LessonShell, ProblemCard } from "./LessonShell";
import { MotifMthalath } from "@/components/motifs";
import { playCue } from "@/lib/audio/cues";

const TARGET_ROWS = 4;
const TARGET_COLS = 6;
const TARGET_PRODUCT = TARGET_ROWS * TARGET_COLS;
const MIN_DIM = 2;
const MAX_DIM = 8;

export function ArraysLesson() {
  const router = useRouter();
  const { t, fmt, lang } = useI18n();
  const completeLoomLesson = useProgress((s) => s.completeLoomLesson);

  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [answer, setAnswer] = useState<number | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  const dimsMatch = rows === TARGET_ROWS && cols === TARGET_COLS;
  const answerMatch = answer === TARGET_PRODUCT;
  const allCorrect = dimsMatch && answerMatch;

  function weave() {
    if (!allCorrect || celebrating) return;
    setCelebrating(true);
    playCue("loom.thump");
    completeLoomLesson("arrays", {
      kind: "arrays",
      rows: TARGET_ROWS,
      cols: TARGET_COLS,
      lessonId: "arrays",
    });
    setTimeout(() => router.push("/loom/weave"), 1400);
  }

  const question =
    lang === "en"
      ? `Layla wants to weave ${fmt(TARGET_ROWS)} rows of ${fmt(TARGET_COLS)} motifs. Set the dimensions, then count the total.`
      : `تريد ليلى نسج ${fmt(TARGET_ROWS)} صفوف من ${fmt(TARGET_COLS)} زخارف. اضبط الأبعاد واحسب المجموع.`;
  const hint =
    lang === "en"
      ? "Multiplication is just patterned counting — the array makes that visible."
      : "الضرب ما هو إلا عدّ منمَّط — المصفوفة تجعل ذلك مرئيًا.";
  const sadu =
    lang === "en"
      ? "A weaver counts threads in pairs of warp and weft — every cell of cloth is a small multiplication kept by hand."
      : "تحسب النسّاجة الخيوط بأزواج من السدى واللُّحمة — كل خلية من القماش ضربٌ صغير محفوظ باليد.";

  const ctaLabel = celebrating
    ? t("loom.woven")
    : !dimsMatch
      ? lang === "en" ? "Set the dimensions" : "اضبط الأبعاد"
      : !answerMatch
        ? lang === "en" ? "Count the total" : "احسب المجموع"
        : t("loom.weaveThisRow");

  return (
    <LessonShell titleKey="loom.titles.arrays" index={4}>
      <ProblemCard
        question={question}
        hint={hint}
        saduNote={sadu}
        ctaLabel={ctaLabel}
        ctaDisabled={!allCorrect || celebrating}
        onCta={weave}
      >
        <div style={{ marginTop: 18 }}>
          <DimRow
            label={lang === "en" ? "Rows" : "صفوف"}
            value={rows}
            target={TARGET_ROWS}
            onSet={setRows}
            celebrating={celebrating}
            fmt={fmt}
          />
          <DimRow
            label={lang === "en" ? "Columns" : "أعمدة"}
            value={cols}
            target={TARGET_COLS}
            onSet={setCols}
            celebrating={celebrating}
            fmt={fmt}
          />
          <AnswerRow
            label={lang === "en" ? "Total" : "المجموع"}
            current={rows * cols}
            answer={answer}
            target={TARGET_PRODUCT}
            onAnswer={setAnswer}
            dimsMatch={dimsMatch}
            celebrating={celebrating}
            fmt={fmt}
            lang={lang}
          />
        </div>
      </ProblemCard>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "var(--wool)",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          {lang === "en"
            ? `${fmt(rows)} × ${fmt(cols)} = ${fmt(rows * cols)} motifs`
            : `${fmt(rows)} × ${fmt(cols)} = ${fmt(rows * cols)} زخرفة`}
        </div>
        <div
          className="ltr-internal"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            gap: 4,
            padding: 10,
            background: "var(--charcoal-soft)",
            border: "1px solid rgba(240,228,201,0.2)",
            width: "min(100%, 460px)",
            aspectRatio: `${cols} / ${rows}`,
            transition: "all 0.4s var(--ease-loom)",
            boxShadow: celebrating
              ? "0 0 28px rgba(232,163,61,0.6) inset"
              : "none",
          }}
        >
          {Array.from({ length: rows * cols }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "100%",
                height: "100%",
                background: "var(--wool)",
                animation: `arraysCellIn 0.3s var(--ease-loom)`,
                animationDelay: `${i * 18}ms`,
                animationFillMode: "backwards",
              }}
            >
              <MotifMthalath w="100%" h="100%" fg="var(--madder)" bg="var(--wool)" />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes arraysCellIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </LessonShell>
  );
}

interface DimRowProps {
  label: string;
  value: number;
  target: number;
  onSet: (n: number) => void;
  celebrating: boolean;
  fmt: (n: number) => string;
}

function DimRow({ label, value, target, onSet, celebrating, fmt }: DimRowProps) {
  const ok = value === target;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px dashed rgba(80,55,30,0.18)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "var(--ink-soft)",
          minWidth: 80,
        }}
      >
        {label}
      </div>
      <button
        onClick={() => onSet(Math.max(MIN_DIM, value - 1))}
        disabled={celebrating || value <= MIN_DIM}
        className="dim-btn"
        aria-label={`decrease ${label}`}
      >
        −
      </button>
      <div
        className="font-display"
        style={{
          minWidth: 40,
          textAlign: "center",
          fontSize: 22,
          color: ok ? "var(--saffron)" : "var(--ink)",
          transition: "color 0.2s",
        }}
      >
        {fmt(value)}
      </div>
      <button
        onClick={() => onSet(Math.min(MAX_DIM, value + 1))}
        disabled={celebrating || value >= MAX_DIM}
        className="dim-btn"
        aria-label={`increase ${label}`}
      >
        +
      </button>
      <span
        style={{
          marginInlineStart: "auto",
          fontSize: 12,
          color: ok ? "var(--saffron)" : "rgba(80,55,30,0.45)",
          letterSpacing: "0.12em",
        }}
      >
        {ok ? "✓" : `→ ${fmt(target)}`}
      </span>
      <style>{`
        .dim-btn {
          width: 32px;
          height: 32px;
          background: rgba(232,163,61,0.12);
          border: 1px solid rgba(232,163,61,0.4);
          color: var(--ink);
          font-family: var(--font-cormorant), serif;
          font-size: 18px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .dim-btn:hover:not(:disabled) { background: rgba(232,163,61,0.28); }
        .dim-btn:disabled { opacity: 0.35; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

interface AnswerRowProps {
  label: string;
  current: number;
  answer: number | null;
  target: number;
  onAnswer: (n: number) => void;
  dimsMatch: boolean;
  celebrating: boolean;
  fmt: (n: number) => string;
  lang: "en" | "ar";
}

function AnswerRow({
  label,
  current,
  answer,
  target,
  onAnswer,
  dimsMatch,
  celebrating,
  fmt,
  lang,
}: AnswerRowProps) {
  const ok = answer === target;
  return (
    <div
      style={{
        marginTop: 14,
        padding: "12px 14px",
        background: dimsMatch ? "rgba(27,45,92,0.08)" : "rgba(80,55,30,0.06)",
        borderInlineStart: `3px solid ${ok ? "var(--saffron)" : "var(--indigo)"}`,
        opacity: dimsMatch ? 1 : 0.6,
        transition: "opacity 0.2s, background 0.2s",
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "var(--ink-soft)",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: 18,
          color: "var(--ink)",
          marginBottom: 10,
        }}
      >
        {dimsMatch
          ? lang === "en"
            ? `What does ${fmt(current)} count to?`
            : `إلى كم يصل ${fmt(current)}؟`
          : lang === "en"
            ? "Set the dimensions first."
            : "اضبط الأبعاد أولًا."}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[18, 20, 24, 28, 32].map((n) => {
          const picked = answer === n;
          const right = picked && n === target;
          const wrong = picked && n !== target;
          return (
            <button
              key={n}
              onClick={() => dimsMatch && !celebrating && onAnswer(n)}
              disabled={!dimsMatch || celebrating}
              className="ans-btn"
              style={{
                background: right
                  ? "var(--saffron)"
                  : wrong
                    ? "rgba(181,52,30,0.18)"
                    : "var(--wool)",
                color: right ? "var(--charcoal)" : "var(--ink)",
                borderColor: right
                  ? "var(--saffron)"
                  : wrong
                    ? "var(--madder)"
                    : "rgba(80,55,30,0.3)",
              }}
            >
              {fmt(n)}
            </button>
          );
        })}
      </div>
      <style>{`
        .ans-btn {
          padding: 9px 14px;
          border: 1px solid;
          font-family: var(--font-cormorant), serif;
          font-size: 16px;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.2s var(--ease-loom);
          min-width: 50px;
        }
        .ans-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .ans-btn:disabled { cursor: not-allowed; opacity: 0.5; }
      `}</style>
    </div>
  );
}
