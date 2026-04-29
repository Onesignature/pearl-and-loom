"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { LessonShell, ProblemCard } from "./LessonShell";
import { MotifMthalath } from "@/components/motifs";
import { playCue } from "@/lib/audio/cues";

interface Option {
  id: "tri60" | "pent" | "tri90";
  labelEn: string;
  labelAr: string;
  correct: boolean;
}

const OPTIONS: Option[] = [
  { id: "tri60", labelEn: "60° triangles", labelAr: "مثلثات ٦٠°", correct: true },
  { id: "pent", labelEn: "Pentagons", labelAr: "خماسيات", correct: false },
  { id: "tri90", labelEn: "90° triangles", labelAr: "مثلثات ٩٠°", correct: false },
];

export function TessellationLesson() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const completeLoomLesson = useProgress((s) => s.completeLoomLesson);
  const [picked, setPicked] = useState<Option | null>(null);

  const question =
    lang === "en"
      ? "Which shape tessellates without gaps to form a Sadu border?"
      : "أيّ شكل يبلِّط بلا فجوات لتشكيل حدّ سدوي؟";
  const hint =
    lang === "en"
      ? "A shape tessellates if its angles at every vertex sum to 360°."
      : "الشكل يبلِّط إذا كان مجموع زواياه عند كل رأس يساوي ٣٦٠°.";
  const sadu =
    lang === "en"
      ? "Bedouin borders rely on equilateral triangles — six fit perfectly at every meeting point."
      : "تعتمد حدود البدو على المثلثات المتساوية — ستة تلتقي تمامًا عند كل نقطة.";

  function onCta() {
    if (!picked?.correct) return;
    playCue("loom.thump");
    completeLoomLesson("tessellation", {
      kind: "tessellation",
      motif: "mthalath",
      tilesPerRow: 14,
      lessonId: "tessellation",
    });
    router.push("/loom/weave");
  }

  return (
    <LessonShell titleKey="loom.titles.tessellation" index={3}>
      <ProblemCard
        question={question}
        hint={hint}
        saduNote={sadu}
        ctaLabel={t("loom.weaveThisRow")}
        ctaDisabled={!picked?.correct}
        onCta={onCta}
      >
        {picked && (
          <div
            style={{
              marginTop: 18,
              padding: 14,
              background: picked.correct ? "rgba(232,163,61,0.18)" : "rgba(181,52,30,0.12)",
              borderInlineStart: `3px solid ${picked.correct ? "var(--saffron)" : "var(--madder)"}`,
            }}
          >
            <div style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.5 }}>
              {picked.correct
                ? lang === "en"
                  ? "Yes — six triangles meet at every vertex (6 × 60° = 360°). The al-mthalath motif."
                  : "نعم — ستة مثلثات تلتقي عند كل رأس (٦ × ٦٠° = ٣٦٠°)."
                : lang === "en"
                  ? "These leave gaps — angles don't divide evenly into 360°."
                  : "تترك فجوات — الزوايا لا تقسم ٣٦٠° بالتساوي."}
            </div>
          </div>
        )}
      </ProblemCard>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "clamp(8px, 2vw, 18px)",
          }}
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPicked(opt)}
              className="tess-option"
              style={{
                borderColor:
                  picked?.id === opt.id
                    ? opt.correct
                      ? "var(--saffron)"
                      : "var(--madder)"
                    : "rgba(240,228,201,0.2)",
                background:
                  picked?.id === opt.id ? "rgba(245,235,211,0.06)" : "transparent",
              }}
            >
              <div style={{ width: "100%", aspectRatio: "1", padding: 18 }}>
                <TileSvg id={opt.id} />
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  color: "var(--wool)",
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  textAlign: "center",
                }}
              >
                {lang === "en" ? opt.labelEn : opt.labelAr}
              </div>
              {picked?.id === opt.id && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    insetInlineEnd: 8,
                    color: opt.correct ? "var(--saffron)" : "var(--madder)",
                    fontSize: 18,
                  }}
                >
                  {opt.correct ? "✓" : "✗"}
                </div>
              )}
            </button>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(240,228,201,0.2)", paddingTop: 16 }}>
          <div
            style={{
              fontSize: 11,
              color: "var(--wool)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: 8,
            }}
          >
            {lang === "en" ? "Tessellation Preview" : "معاينة التبليط"}
          </div>
          <div
            style={{
              height: 76,
              background: "var(--charcoal-soft)",
              padding: 4,
              border: "1px solid rgba(240,228,201,0.2)",
            }}
          >
            {picked?.correct ? (
              <div className="ltr-internal" style={{ display: "flex", height: "100%" }}>
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: "100%" }}>
                    <MotifMthalath fg="var(--madder)" bg="var(--wool)" w="100%" h="100%" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--ink-soft)",
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: "var(--warp-lines)",
                }}
              >
                {lang === "en" ? "Pick a tessellating shape" : "اختر شكلًا مبلِّطًا"}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .tess-option {
          flex: 1;
          background: transparent;
          border: 2px solid rgba(240,228,201,0.2);
          padding: 0;
          cursor: pointer;
          position: relative;
          transition: all 0.3s var(--ease-loom);
          font-family: var(--font-tajawal), sans-serif;
        }
        .tess-option:hover { transform: translateY(-2px); }
      `}</style>
    </LessonShell>
  );
}

function TileSvg({ id }: { id: Option["id"] }) {
  if (id === "tri60") {
    return (
      <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%" }}>
        <defs>
          <pattern id="tri60p" x="0" y="0" width="40" height="34.6" patternUnits="userSpaceOnUse">
            <path d="M 0 0 L 20 34.6 L 40 0 Z" fill="#B5341E" />
            <path d="M 0 34.6 L 20 0 L 40 34.6 Z" fill="#1B2D5C" />
            <path d="M 0 0 L 20 34.6 L 40 0" stroke="#F0E4C9" strokeWidth="0.5" fill="none" />
          </pattern>
        </defs>
        <rect width="120" height="120" fill="url(#tri60p)" />
      </svg>
    );
  }
  if (id === "pent") {
    return (
      <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%" }}>
        <rect width="120" height="120" fill="var(--wool)" />
        {[
          { x: 30, y: 30 },
          { x: 80, y: 30 },
          { x: 30, y: 80 },
          { x: 80, y: 80 },
        ].map((p, i) => (
          <polygon
            key={i}
            points={`${p.x},${p.y - 18} ${p.x + 18},${p.y - 6} ${p.x + 12},${p.y + 15} ${p.x - 12},${p.y + 15} ${p.x - 18},${p.y - 6}`}
            fill="#1B2D5C"
            stroke="#F0E4C9"
            strokeWidth="0.5"
          />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%" }}>
      <rect width="120" height="120" fill="var(--wool)" />
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <g key={`${row}-${col}`} transform={`translate(${col * 38} ${row * 38})`}>
            <path d="M 0 0 L 30 0 L 0 30 Z" fill="#1B2D5C" stroke="#F0E4C9" strokeWidth="0.5" />
          </g>
        )),
      )}
    </svg>
  );
}
