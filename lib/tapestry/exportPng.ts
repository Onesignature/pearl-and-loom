"use client";

// Canvas-based tapestry exporter. Walks TAPESTRY_25, redraws each motif
// natively to a 2x DPI canvas with saffron frame + caption, and emits a
// downloadable PNG. No external deps — keeps the bundle lean and the
// output deterministic across browsers.

import { TAPESTRY_25, type TapestryRowDef } from "@/lib/tapestry/composition";
import type { MotifId, PearlGrade } from "@/lib/pattern-engine/types";
import { PEARL_TIERS } from "@/lib/pearl/colors";

// Direct color values (the live tapestry uses CSS vars, but the exporter
// runs offscreen so we resolve to literal hex here for fidelity).
const COLORS: Record<string, string> = {
  "var(--indigo)": "#1B2D5C",
  "var(--indigo-deep)": "#121F44",
  "var(--madder)": "#B5341E",
  "var(--madder-deep)": "#8C2614",
  "var(--saffron)": "#E8A33D",
  "var(--saffron-soft)": "#F0BD6A",
  "var(--charcoal)": "#2A2522",
  "var(--charcoal-soft)": "#3D3531",
  "var(--wool)": "#F0E4C9",
  "var(--wool-warm)": "#E8D9B5",
  "var(--wool-deep)": "#D9C49C",
  "var(--sea-blue)": "#0E5E7B",
  "var(--sea-deep)": "#08374A",
  "var(--sea-abyss)": "#051E2C",
  "var(--coral)": "#E07856",
  "var(--sunset-gold)": "#F4B860",
  "var(--foam)": "#F0F4F2",
  "var(--pearl-common)": PEARL_TIERS.common.mid,
  "var(--pearl-fine)": PEARL_TIERS.fine.mid,
  "var(--pearl-royal)": PEARL_TIERS.royal.mid,
  transparent: "transparent",
};

function resolve(v: string): string {
  return COLORS[v] ?? v;
}

function fillBg(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, bg: string) {
  if (bg === "transparent") return;
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);
}

export interface RowDraw {
  motif: MotifId;
  fg: string;
  bg: string;
  outline?: string;
}

export function drawRow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  row: RowDraw,
) {
  const fg = resolve(row.fg);
  const bg = resolve(row.bg);
  const outline = row.outline ? resolve(row.outline) : null;
  fillBg(ctx, x, y, w, h, bg);
  ctx.fillStyle = fg;
  if (outline) ctx.strokeStyle = outline;

  switch (row.motif) {
    case "mthalath": {
      // Top row: 4 triangles tip-down meeting at midline; bottom row: 4 tip-up.
      const tw = w / 4;
      for (let i = 0; i < 4; i++) {
        const tx = x + i * tw;
        ctx.beginPath();
        ctx.moveTo(tx, y);
        ctx.lineTo(tx + tw / 2, y + h / 2);
        ctx.lineTo(tx + tw, y);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(tx, y + h);
        ctx.lineTo(tx + tw / 2, y + h / 2);
        ctx.lineTo(tx + tw, y + h);
        ctx.closePath();
        ctx.fill();
      }
      break;
    }
    case "shajarah": {
      // Tree-of-life — central trunk + branching diamonds.
      const cells = 5;
      const cw = w / cells;
      for (let i = 0; i < cells; i++) {
        const cx = x + i * cw + cw / 2;
        const cy = y + h / 2;
        ctx.fillRect(cx - 1, y + 4, 2, h - 8);
        // Branch diamonds
        ctx.beginPath();
        ctx.moveTo(cx, y + 4);
        ctx.lineTo(cx + cw / 4, cy);
        ctx.lineTo(cx, y + h - 4);
        ctx.lineTo(cx - cw / 4, cy);
        ctx.closePath();
        ctx.fill();
      }
      break;
    }
    case "eyoun": {
      // Diamond eyes — alternating with optional outline.
      const count = 6;
      const dw = w / count;
      for (let i = 0; i < count; i++) {
        const cx = x + i * dw + dw / 2;
        const cy = y + h / 2;
        const r = Math.min(dw, h) * 0.4;
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r * 0.7, cy);
        ctx.lineTo(cx, cy + r);
        ctx.lineTo(cx - r * 0.7, cy);
        ctx.closePath();
        ctx.fill();
        if (outline) {
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      break;
    }
    case "mushat": {
      // Comb — vertical teeth.
      const teeth = 16;
      const tw = w / teeth;
      ctx.fillRect(x, y + h / 2 - 1, w, 2);
      for (let i = 0; i < teeth; i++) {
        const tx = x + i * tw + tw / 4;
        ctx.fillRect(tx, y + 2, tw / 2, h - 4);
      }
      break;
    }
    case "hubub": {
      // Grain dots — staggered two rows.
      const cols = 14;
      const dw = w / cols;
      const r = Math.min(dw, h) * 0.18;
      for (let i = 0; i < cols; i++) {
        const cx = x + i * dw + dw / 2;
        ctx.beginPath();
        ctx.arc(cx, y + h * 0.35, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + dw / 2, y + h * 0.65, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "dhurs": {
      // Horse-teeth — alternating up/down squares.
      const cols = 12;
      const cw = w / cols;
      const sq = Math.min(cw, h) * 0.7;
      for (let i = 0; i < cols; i++) {
        const cx = x + i * cw + (cw - sq) / 2;
        const cy = i % 2 === 0 ? y + 1 : y + h - sq - 1;
        ctx.fillRect(cx, cy, sq, sq);
      }
      break;
    }
    case "chevron": {
      // Facing triangles forming a zigzag border.
      const count = 10;
      const cw = w / count;
      for (let i = 0; i < count; i++) {
        const tx = x + i * cw;
        ctx.beginPath();
        ctx.moveTo(tx, y + h);
        ctx.lineTo(tx + cw / 2, y);
        ctx.lineTo(tx + cw, y + h);
        ctx.closePath();
        ctx.fill();
      }
      break;
    }
    case "stripe": {
      // Solid stripe with a thin contrast band running through center.
      ctx.fillRect(x, y, w, h);
      break;
    }
    case "diamond": {
      // Single large diamond centred.
      ctx.beginPath();
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w, y + h / 2);
      ctx.lineTo(x + w / 2, y + h);
      ctx.lineTo(x, y + h / 2);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "blank":
      break;
  }
}

export function drawPearl(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  grade: PearlGrade,
) {
  const [a, b] = PEARL_TIERS[grade].exportPair;
  const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
  grad.addColorStop(0, a);
  grad.addColorStop(1, b);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.stroke();
}

interface ExportOptions {
  rowsWoven: number;
  streak: number;
  pearlsCollected: number;
  lang: "en" | "ar";
}

/** Render the user's tapestry to a 2x-DPI PNG blob. */
export async function buildTapestryPng({
  rowsWoven,
  streak,
  pearlsCollected,
  lang,
}: ExportOptions): Promise<Blob> {
  const dpr = 2;
  const W = 720;
  const H = 1040;
  const canvas = document.createElement("canvas");
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.scale(dpr, dpr);

  // ── Backdrop (aged paper) ────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#E8D9B5");
  bg.addColorStop(1, "#D9C49C");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle linen weave noise
  ctx.fillStyle = "rgba(80, 55, 30, 0.04)";
  for (let i = 0; i < 600; i++) {
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }

  // ── Saffron frame ────────────────────────────────────────────────────
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#E8A33D";
  ctx.strokeRect(20, 20, W - 40, H - 40);
  ctx.lineWidth = 1;
  ctx.strokeRect(34, 34, W - 68, H - 68);

  // ── Title ────────────────────────────────────────────────────────────
  ctx.textAlign = "center";
  ctx.fillStyle = "#5A3618";
  ctx.font = 'italic 600 32px "Cormorant Garamond", "Times New Roman", serif';
  ctx.fillText(
    lang === "en" ? "The Pearl & The Loom" : "اللؤلؤة والنول",
    W / 2,
    74,
  );
  ctx.font = '11px "Cormorant Garamond", serif';
  ctx.fillStyle = "#B5341E";
  ctx.fillText(
    (lang === "en" ? "FAMILY HEIRLOOM · ABU DHABI · 1948" : "إرث العائلة · أبو ظبي · ١٩٤٨")
      .split("")
      .join(" "),
    W / 2,
    96,
  );

  // ── Tapestry frame ───────────────────────────────────────────────────
  const tapW = W - 200;
  const rowH = 28;
  const totalRows = TAPESTRY_25.length;
  const tapH = rowH * totalRows + 20;
  const tapX = (W - tapW) / 2;
  const tapY = 130;

  // Inner wood mat
  const matGrad = ctx.createLinearGradient(0, tapY, 0, tapY + tapH);
  matGrad.addColorStop(0, "#5A3618");
  matGrad.addColorStop(1, "#3D2A1E");
  ctx.fillStyle = matGrad;
  ctx.fillRect(tapX - 14, tapY - 14, tapW + 28, tapH + 28);
  ctx.strokeStyle = "#1F140A";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(tapX - 14, tapY - 14, tapW + 28, tapH + 28);

  // Rows — bottom is the oldest (row 0), top is the newest (row 24). Match the on-screen order.
  for (let i = 0; i < totalRows; i++) {
    const row: TapestryRowDef = TAPESTRY_25[i];
    const isWoven = i < rowsWoven;
    const drawY = tapY + (totalRows - 1 - i) * rowH;
    if (isWoven) {
      drawRow(ctx, tapX, drawY, tapW, rowH, {
        motif: row.motif,
        fg: row.palette.fg,
        bg: row.palette.bg,
        outline: row.palette.outline,
      });
      if (row.pearl) {
        const r = row.pearl === "royal" ? 8 : 6;
        drawPearl(ctx, tapX + tapW / 2, drawY + rowH / 2, r, row.pearl);
      }
    } else {
      // Un-woven: warp threads.
      ctx.fillStyle = "#3D2A1E";
      ctx.fillRect(tapX, drawY, tapW, rowH);
      ctx.strokeStyle = "rgba(201,168,118,0.45)";
      ctx.lineWidth = 0.6;
      for (let xx = tapX; xx < tapX + tapW; xx += 4) {
        ctx.beginPath();
        ctx.moveTo(xx, drawY);
        ctx.lineTo(xx, drawY + rowH);
        ctx.stroke();
      }
    }
  }

  // Warp fringe at bottom
  ctx.strokeStyle = "#C9A876";
  ctx.lineWidth = 0.8;
  for (let xx = tapX + 4; xx < tapX + tapW; xx += 8) {
    ctx.beginPath();
    ctx.moveTo(xx, tapY + tapH);
    ctx.lineTo(xx + 1, tapY + tapH + 14);
    ctx.stroke();
  }

  // ── Caption ──────────────────────────────────────────────────────────
  const captionY = tapY + tapH + 56;
  ctx.fillStyle = "#3D2A1E";
  ctx.font = '14px "Cormorant Garamond", serif';
  ctx.fillText(
    lang === "en"
      ? `${rowsWoven} of ${totalRows} rows woven · ${pearlsCollected} pearls collected · ${streak}-day streak`
      : `${rowsWoven} من ${totalRows} صفًّا · ${pearlsCollected} لؤلؤة · ${streak} أيام متتالية`,
    W / 2,
    captionY,
  );
  ctx.fillStyle = "#8C2614";
  ctx.font = '10px "Cormorant Garamond", serif';
  const date = new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  ctx.fillText(date.toUpperCase(), W / 2, captionY + 20);

  // ── Footer signature ─────────────────────────────────────────────────
  ctx.fillStyle = "#8C2614";
  ctx.font = 'italic 11px "Cormorant Garamond", serif';
  ctx.fillText(
    lang === "en"
      ? "thepearlandtheloom.app · two crafts, one family, one heirloom"
      : "حرفتان، عائلة واحدة، إرث واحد",
    W / 2,
    H - 38,
  );

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/png",
      0.95,
    );
  });
}

/** Trigger a download of the PNG blob with a date-stamped filename. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
