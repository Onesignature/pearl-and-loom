"use client";

// Grade 4 geometric angles via motif rotation. Equilateral triangles tile
// without gaps when rotated by 60° (six fit at every vertex, 6 × 60° =
// 360°). The student picks the rotation; only 60° lets the row weave.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { LessonShell, ProblemCard } from "./LessonShell";
import { playCue } from "@/lib/audio/cues";
import type { Rotation } from "@/lib/pattern-engine/types";

const OPTIONS: { angle: Rotation; correct: boolean }[] = [
  { angle: 60, correct: true },
  { angle: 90, correct: false },
  { angle: 120, correct: false },
];

export function AnglesLesson() {
  const router = useRouter();
  const { t, fmt, lang } = useI18n();
  const completeLoomLesson = useProgress((s) => s.completeLoomLesson);

  const [picked, setPicked] = useState<Rotation | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  const correct = picked === 60;

  function weave() {
    if (!correct || celebrating) return;
    setCelebrating(true);
    playCue("loom.thump");
    completeLoomLesson("angles", {
      kind: "angles",
      rotation: 60,
      lessonId: "angles",
    });
    setTimeout(() => router.push("/loom/weave"), 1400);
  }

  const question =
    lang === "en"
      ? "By what angle must each triangle rotate so that six of them meet cleanly at every point?"
      : "بأي زاوية يجب أن يدور كل مثلث ليلتقي ستة منها تمامًا عند كل نقطة؟";
  const hint =
    lang === "en"
      ? "Tip: the angles around any single point in the cloth always sum to 360°."
      : "تلميح: مجموع الزوايا حول أي نقطة في القماش يساوي ٣٦٠°.";
  const sadu =
    lang === "en"
      ? "Equilateral triangles fit because 6 × 60° = 360°. Bedouin border patterns rely on this exact arithmetic — the loom enforces the geometry whether the weaver is conscious of it or not."
      : "المثلثات المتساوية تنطبق لأن ٦ × ٦٠° = ٣٦٠°. حدود البدو تعتمد على هذه الحسبة بالضبط — النَّول يفرض الهندسة سواء أدركتها النسّاجة أم لا.";

  const ctaLabel = celebrating
    ? t("loom.woven")
    : !correct
      ? lang === "en" ? "Pick the right angle" : "اختر الزاوية الصحيحة"
      : t("loom.weaveThisRow");

  return (
    <LessonShell titleKey="loom.titles.angles" index={5}>
      <ProblemCard
        question={question}
        hint={hint}
        saduNote={sadu}
        ctaLabel={ctaLabel}
        ctaDisabled={!correct || celebrating}
        onCta={weave}
      >
        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {OPTIONS.map((opt) => {
            const sel = picked === opt.angle;
            return (
              <button
                key={opt.angle}
                onClick={() => !celebrating && setPicked(opt.angle)}
                disabled={celebrating}
                className="ang-btn"
                style={{
                  background: sel
                    ? opt.correct
                      ? "var(--saffron)"
                      : "rgba(181,52,30,0.18)"
                    : "var(--wool)",
                  color: sel && opt.correct ? "var(--charcoal)" : "var(--ink)",
                  borderColor: sel
                    ? opt.correct
                      ? "var(--saffron)"
                      : "var(--madder)"
                    : "rgba(80,55,30,0.3)",
                }}
              >
                <div
                  className="font-display"
                  style={{ fontSize: 24, lineHeight: 1 }}
                >
                  {fmt(opt.angle)}°
                </div>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    marginTop: 4,
                    opacity: 0.7,
                  }}
                >
                  {opt.angle === 60
                    ? lang === "en" ? "triangle" : "مثلث"
                    : opt.angle === 90
                      ? lang === "en" ? "square" : "مربّع"
                      : lang === "en" ? "hexagon" : "سداسي"}
                </div>
              </button>
            );
          })}
        </div>
        {picked != null && (
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              background: correct ? "rgba(232,163,61,0.18)" : "rgba(181,52,30,0.10)",
              borderInlineStart: `3px solid ${correct ? "var(--saffron)" : "var(--madder)"}`,
              fontSize: 12,
              color: "var(--ink)",
              lineHeight: 1.5,
            }}
          >
            {correct
              ? lang === "en"
                ? "Six triangles meet at every vertex. The row weaves cleanly."
                : "ستة مثلثات تلتقي عند كل رأس. الصف ينسج بلا فجوات."
              : picked === 90
                ? lang === "en"
                  ? "Squares fit at 90°, but our motif is a triangle — the weft will leave gaps."
                  : "المربّعات تنطبق عند ٩٠° لكن زخرفتنا مثلث — ستترك اللُّحمة فجوات."
                : lang === "en"
                  ? "Hexagons close at 120° (3 × 120° = 360°), but a triangle rotated this way stays open."
                  : "السداسيات تُغلَق عند ١٢٠° (٣ × ١٢٠° = ٣٦٠°) لكن المثلث المُدار هكذا يبقى مفتوحًا."}
          </div>
        )}
      </ProblemCard>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          minWidth: 0,
          maxWidth: "100%",
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
          {lang === "en" ? "Vertex preview" : "معاينة الرأس"}
        </div>
        <VertexPreview rotation={picked} />
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            color: correct ? "var(--saffron)" : "var(--wool)",
            textTransform: "uppercase",
            opacity: correct ? 1 : 0.55,
          }}
        >
          {picked == null
            ? lang === "en" ? "Pick a rotation" : "اختر زاوية"
            : correct
              ? lang === "en" ? "✓ Tiles cleanly" : "✓ يبلِّط بلا فجوات"
              : lang === "en" ? "Leaves gaps" : "يترك فجوات"}
        </div>
      </div>
    </LessonShell>
  );
}

interface VertexPreviewProps {
  rotation: Rotation | null;
}

/** Six triangle slots radiating from a central point — fills as the user
 *  picks rotations. Only 60° fills all six without gaps. */
function VertexPreview({ rotation }: VertexPreviewProps) {
  // For the visual "vertex preview", show how many triangles fit if the
  // rotation tiled the full 360° around a point.
  const fits = rotation == null ? 0 : Math.floor(360 / rotation);
  return (
    <div
      style={{
        position: "relative",
        width: "min(100%, 360px)",
        maxHeight: "60vh",
        aspectRatio: "1 / 1",
        background: "var(--charcoal-soft)",
        border: "1px solid rgba(240,228,201,0.2)",
        padding: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg viewBox="-100 -100 200 200" style={{ width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="vertGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r="86" fill="url(#vertGlow)" opacity={fits === 6 ? 1 : 0.3} />
        {Array.from({ length: 6 }).map((_, i) => {
          const filled = i < fits;
          const angle = (i * (rotation ?? 60) * Math.PI) / 180;
          const nextAngle = ((i + 1) * (rotation ?? 60) * Math.PI) / 180;
          const r = 70;
          const x1 = Math.cos(angle - Math.PI / 2) * r;
          const y1 = Math.sin(angle - Math.PI / 2) * r;
          const x2 = Math.cos(nextAngle - Math.PI / 2) * r;
          const y2 = Math.sin(nextAngle - Math.PI / 2) * r;
          const fill = filled ? "#B5341E" : "rgba(240,228,201,0.05)";
          const stroke = filled ? "#F0E4C9" : "rgba(240,228,201,0.18)";
          return (
            <polygon
              key={i}
              points={`0,0 ${x1.toFixed(2)},${y1.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}`}
              fill={fill}
              stroke={stroke}
              strokeWidth="0.6"
              style={{
                transition: "fill 0.3s var(--ease-loom)",
              }}
            />
          );
        })}
        <circle r="3" fill="#F0E4C9" />
      </svg>
    </div>
  );
}
