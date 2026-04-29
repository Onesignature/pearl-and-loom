"use client";

// Live math → Sadu binding inside lessons.
//
// As the kid solves, the next row of the tapestry previews here, faded.
// When the answer is correct (`locked=true`), the row brightens, the caption
// reveals, and the kid sees — in the lesson, not later — that their math
// just produced a row of woven cloth. This is what "the math IS the loom"
// looks like at the surface.
//
// Pure: derives from progress.ops + progress.seed + the lesson's planned op.
// No mutations; the actual append happens via completeLoomLesson when the
// kid clicks "Weave this row".

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { generatePattern } from "@/lib/pattern-engine";
import type { PatternOp, Row, TapestryState } from "@/lib/pattern-engine/types";
import { MOTIF_COMPONENTS } from "@/components/motifs";
import { SADU_COLORS } from "@/lib/pattern-engine/palette";

const PREVIEW_ROW_COUNT = 5;

/** Caption naming what motif the planned op is currently producing. */
function motifNameForOp(op: PatternOp): { en: string; ar: string } {
  switch (op.kind) {
    case "symmetry":
      return { en: `Al-Mthalath · ${op.axis}`, ar: `المثلث · ${op.axis}` };
    case "fraction":
      return {
        en: `${op.numerator}/${op.denominator} band`,
        ar: `شريط ${op.numerator}/${op.denominator}`,
      };
    case "tessellation":
      return { en: `${op.motif} tessellation`, ar: `تبليط ${op.motif}` };
    case "arrays":
      return { en: `${op.rows} × ${op.cols} array`, ar: `مصفوفة ${op.rows} × ${op.cols}` };
    case "angles":
      return { en: `${op.rotation}° rotation`, ar: `دوران ${op.rotation}°` };
    case "bead":
      return { en: "pearl bead", ar: "خرزة لؤلؤ" };
  }
}

interface LessonSaduPreviewProps {
  plannedOp: PatternOp;
  /** True once the kid's answer is correct — glow + caption reveal. */
  locked: boolean;
}

export function LessonSaduPreview({ plannedOp, locked }: LessonSaduPreviewProps) {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const seed = useProgress((s) => s.seed);
  const ops = useProgress((s) => s.ops);

  const state: TapestryState = useMemo(
    () => ({ seed, ops: [...ops, plannedOp], beads: [] }),
    [seed, ops, plannedOp],
  );
  const allRows = useMemo(
    () => generatePattern(state, { width: 12, borderRows: 2 }),
    [state],
  );
  // Show the last 5 rows; the most recent is the planned one.
  const visible = allRows.slice(-PREVIEW_ROW_COUNT);
  const motifName = motifNameForOp(plannedOp);

  return (
    <div className="lesson-sadu-preview">
      <div className="lsp-eyebrow-row">
        <span className="lsp-eyebrow">
          {isAr ? "نسيجك ينمو" : "Your tapestry grows"}
        </span>
        <AnimatePresence>
          {locked && (
            <motion.span
              key="caption"
              initial={{ opacity: 0, x: isAr ? -6 : 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32 }}
              className="lsp-caption"
            >
              {isAr ? `زخرف هذا الصفّ · ${motifName.ar}` : `Just woven · ${motifName.en}`}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="lsp-frame">
        <svg
          viewBox={`0 0 720 ${24 * visible.length}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: `720 / ${24 * visible.length}`,
            display: "block",
            background: "#3D2A1E",
          }}
          className="ltr-internal"
        >
          {[...visible].reverse().map((row, displayI) => {
            const isPreview = displayI === 0;
            return (
              <PreviewRow
                key={`row-${row.index}-${displayI}`}
                row={row}
                y={displayI * 24}
                rowHeight={24}
                isPreview={isPreview}
                locked={locked}
              />
            );
          })}
        </svg>
      </div>
      <style>{`
        .lesson-sadu-preview {
          width: 100%;
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .lsp-eyebrow-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }
        .lsp-eyebrow {
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--saffron);
        }
        .lsp-caption {
          font-family: var(--font-tajawal), sans-serif;
          font-size: 12px;
          color: var(--ink);
          background: rgba(232,163,61,0.18);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .lsp-frame {
          padding: 6px;
          background: linear-gradient(180deg, #5A3618, #3D2A1E);
          border: 1px solid #6B4423;
          border-radius: 8px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.35);
        }
      `}</style>
    </div>
  );
}

interface PreviewRowProps {
  row: Row;
  y: number;
  rowHeight: number;
  isPreview: boolean;
  locked: boolean;
}

function PreviewRow({ row, y, rowHeight, isPreview, locked }: PreviewRowProps) {
  const cellsCount = row.cells.length || 12;
  const cellW = 720 / cellsCount;
  const opacity = isPreview ? (locked ? 1 : 0.42) : 0.92;
  return (
    <g
      transform={`translate(0 ${y})`}
      style={{
        opacity,
        transition: "opacity 0.5s var(--ease-loom, ease)",
      }}
    >
      {row.cells.map((cell, ci) => {
        if (cell.kind === "bead") {
          return (
            <g key={`b-${ci}`} transform={`translate(${ci * cellW} 0)`}>
              <rect width={cellW} height={rowHeight} fill="#1B2D5C" />
              <circle
                cx={cellW / 2}
                cy={rowHeight / 2}
                r={Math.min(cellW, rowHeight) * 0.32}
                fill="#F4EBDC"
                stroke="#2A2522"
                strokeWidth="0.8"
              />
            </g>
          );
        }
        const Motif = MOTIF_COMPONENTS[cell.motif];
        if (!Motif) return null;
        const fg = SADU_COLORS[cell.color];
        return (
          <g
            key={`m-${ci}`}
            transform={`translate(${ci * cellW} 0) rotate(${cell.rotation} ${cellW / 2} ${rowHeight / 2})`}
          >
            <svg
              x={0}
              y={0}
              width={cellW}
              height={rowHeight}
              viewBox="0 0 60 40"
              preserveAspectRatio="none"
              overflow="visible"
            >
              <Motif fg={fg} bg="#F0E4C9" w={60} h={40} />
            </svg>
          </g>
        );
      })}
      {isPreview && locked && (
        <rect
          x="0"
          y="0"
          width="720"
          height={rowHeight}
          fill="none"
          stroke="#E8A33D"
          strokeWidth="1.5"
          opacity="0.7"
        />
      )}
    </g>
  );
}
