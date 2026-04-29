"use client";

// Heirloom completion certificate. Renders a 1280×900 landscape PNG that
// reads as a tapestry: aged-paper backdrop, double saffron frame, two
// authentic Sadu motif bands at top + bottom (drawn from the user's own
// 25-row composition), the learner's name as the centerpiece, and stats
// (rows woven · pearls collected · streak · date) below. Reuses the
// motif drawing primitives from exportPng so the visual language stays
// consistent with the saved tapestry.

import { drawRow, type RowDraw } from "@/lib/tapestry/exportPng";
import { TAPESTRY_25 } from "@/lib/tapestry/composition";

interface CertificateOptions {
  learnerName: string;
  rowsWoven: number;
  pearlsCollected: number;
  streak: number;
  lang: "en" | "ar";
}

/** Render the certificate to a 2× DPI PNG blob. */
export async function buildCertificatePng({
  learnerName,
  rowsWoven,
  pearlsCollected,
  streak,
  lang,
}: CertificateOptions): Promise<Blob> {
  const dpr = 2;
  const W = 1280;
  const H = 900;
  const canvas = document.createElement("canvas");
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.scale(dpr, dpr);

  // ── Backdrop — aged paper with subtle linen weave ────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#EBDBB2");
  bg.addColorStop(0.5, "#E8D9B5");
  bg.addColorStop(1, "#D9C49C");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Linen noise — sparse warm specks for the woven feel.
  ctx.fillStyle = "rgba(80, 55, 30, 0.05)";
  for (let i = 0; i < 1100; i++) {
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }
  // A few darker fiber accents
  ctx.fillStyle = "rgba(120, 80, 40, 0.07)";
  for (let i = 0; i < 320; i++) {
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 2);
  }

  // ── Frame ────────────────────────────────────────────────────────────
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#E8A33D";
  ctx.strokeRect(28, 28, W - 56, H - 56);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#B5341E";
  ctx.strokeRect(48, 48, W - 96, H - 96);

  // ── Sadu motif bands — top and bottom ────────────────────────────────
  // Reuse the curated TAPESTRY_25 composition: pick a band of 5 rows for
  // the top and a different 5 for the bottom so the certificate visibly
  // includes the user's heirloom motifs.
  const bandRowH = 24;
  const bandX = 80;
  const bandW = W - 160;

  const topBand: RowDraw[] = TAPESTRY_25.slice(20, 25).map((r) => ({
    motif: r.motif,
    fg: r.palette.fg,
    bg: r.palette.bg,
    outline: r.palette.outline,
  }));
  const bottomBand: RowDraw[] = TAPESTRY_25.slice(0, 5).map((r) => ({
    motif: r.motif,
    fg: r.palette.fg,
    bg: r.palette.bg,
    outline: r.palette.outline,
  }));

  // Top band — closer to the title.
  let bandY = 76;
  ctx.strokeStyle = "#5A3618";
  ctx.lineWidth = 1;
  ctx.strokeRect(bandX - 1, bandY - 1, bandW + 2, bandRowH * topBand.length + 2);
  topBand.forEach((row, i) => drawRow(ctx, bandX, bandY + i * bandRowH, bandW, bandRowH, row));

  // Bottom band.
  bandY = H - 76 - bandRowH * bottomBand.length;
  ctx.strokeRect(bandX - 1, bandY - 1, bandW + 2, bandRowH * bottomBand.length + 2);
  bottomBand.forEach((row, i) => drawRow(ctx, bandX, bandY + i * bandRowH, bandW, bandRowH, row));

  // ── Title ────────────────────────────────────────────────────────────
  ctx.textAlign = "center";
  ctx.fillStyle = "#5A3618";
  ctx.font = '12px "Cormorant Garamond", "Times New Roman", serif';
  ctx.fillText(
    spaced(
      lang === "en" ? "ABU DHABI · 1948" : "أبو ظبي · ١٩٤٨",
    ),
    W / 2,
    240,
  );

  ctx.fillStyle = "#3D2A1E";
  ctx.font = 'italic 600 56px "Cormorant Garamond", "Times New Roman", serif';
  ctx.fillText(
    lang === "en" ? "Certificate of Completion" : "شهادة إتمام الإرث",
    W / 2,
    300,
  );

  // Indigo divider with central diamond ornament — same vocabulary as the
  // home navbar.
  const divY = 332;
  const divHalf = 220;
  ctx.strokeStyle = "#B5341E";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(W / 2 - divHalf, divY);
  ctx.lineTo(W / 2 - 18, divY);
  ctx.moveTo(W / 2 + 18, divY);
  ctx.lineTo(W / 2 + divHalf, divY);
  ctx.stroke();
  ctx.fillStyle = "#E8A33D";
  ctx.beginPath();
  ctx.moveTo(W / 2, divY - 6);
  ctx.lineTo(W / 2 + 6, divY);
  ctx.lineTo(W / 2, divY + 6);
  ctx.lineTo(W / 2 - 6, divY);
  ctx.closePath();
  ctx.fill();

  // ── Lead line ────────────────────────────────────────────────────────
  ctx.fillStyle = "#5A4D44";
  ctx.font = '18px "Cormorant Garamond", serif';
  ctx.fillText(
    lang === "en" ? "This certifies that" : "تشهد هذه الوثيقة بأنّ",
    W / 2,
    382,
  );

  // ── Learner name — the centerpiece ───────────────────────────────────
  const safeName = (learnerName || "—").trim() || "—";
  ctx.fillStyle = "#8C2614";
  ctx.font = 'italic 600 64px "Cormorant Garamond", "Times New Roman", serif';
  ctx.fillText(safeName, W / 2, 460);

  // Underline ornament beneath the name.
  const nameWidth = ctx.measureText(safeName).width;
  const underlineHalf = Math.max(120, nameWidth / 2 + 60);
  ctx.strokeStyle = "#E8A33D";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - underlineHalf, 478);
  ctx.lineTo(W / 2 - 14, 478);
  ctx.moveTo(W / 2 + 14, 478);
  ctx.lineTo(W / 2 + underlineHalf, 478);
  ctx.stroke();
  ctx.fillStyle = "#E8A33D";
  ctx.fillRect(W / 2 - 4, 474, 8, 8);

  // ── Body line ────────────────────────────────────────────────────────
  ctx.fillStyle = "#3D2A1E";
  ctx.font = '20px "Cormorant Garamond", serif';
  ctx.fillText(
    lang === "en"
      ? "has woven the family heirloom — twenty-five rows of Al Sadu"
      : "قد نسجَ إرث العائلة — خمسةً وعشرين صفًّا من السدو",
    W / 2,
    528,
  );
  ctx.fillText(
    lang === "en"
      ? "and twelve pearls of the ghasa season."
      : "واثنتي عشرة لؤلؤةً من موسم الغوص.",
    W / 2,
    558,
  );

  // ── Stats line ───────────────────────────────────────────────────────
  ctx.fillStyle = "#8C2614";
  ctx.font = '600 14px "Cormorant Garamond", serif';
  ctx.fillText(
    spaced(
      lang === "en"
        ? `${rowsWoven} ROWS · ${pearlsCollected} PEARLS · ${streak}-DAY STREAK`
        : `${rowsWoven} صفًّا · ${pearlsCollected} لؤلؤة · ${streak} أيام متتالية`,
    ),
    W / 2,
    608,
  );

  // ── Date + signature flourish ────────────────────────────────────────
  const date = new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  ctx.fillStyle = "#5A4D44";
  ctx.font = 'italic 16px "Cormorant Garamond", serif';
  ctx.fillText(
    lang === "en" ? `Sealed at Abu Dhabi · ${date}` : `خُتمت بأبو ظبي · ${date}`,
    W / 2,
    660,
  );

  // ── Footer ───────────────────────────────────────────────────────────
  ctx.fillStyle = "#5A3618";
  ctx.font = '12px "Cormorant Garamond", serif';
  ctx.fillText(
    spaced(
      lang === "en"
        ? "THE PEARL & THE LOOM · TWO CRAFTS · ONE FAMILY · ONE HEIRLOOM"
        : "اللؤلؤة والنول · حرفتان · عائلة واحدة · إرث واحد",
    ),
    W / 2,
    H - 130,
  );

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/png",
      0.97,
    );
  });
}

/** Trace the tracked-out look used on chrome captions everywhere. */
function spaced(s: string): string {
  return s.split("").join(" ");
}
