"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { TAPESTRY_25, TAPESTRY_TOTAL_ROWS } from "@/lib/tapestry/composition";
import { MOTIF_COMPONENTS, MOTIF_REGISTRY } from "@/components/motifs";
import { buildTapestryPng, downloadBlob } from "@/lib/tapestry/exportPng";
import { buildCertificatePng } from "@/lib/tapestry/buildCertificate";
import { playCue } from "@/lib/audio/cues";
import { PEARL_TIERS } from "@/lib/pearl/colors";
import { useSettings } from "@/lib/store/settings";

export default function TapestryFullPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-charcoal">
          <div
            className="h-8 w-8 animate-pulse rounded-full bg-saffron/40"
            aria-hidden
          />
        </div>
      }
    >
      <TapestryFullPage />
    </Suspense>
  );
}


function TapestryFullPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { t, fmt, lang } = useI18n();
  const ops = useProgress((s) => s.ops);
  const pearls = useProgress((s) => s.pearls);
  const streak = useProgress((s) => s.streak);
  const ownSeed = useProgress((s) => s.seed);

  // ?seed= renders a read-only view of "someone else's heirloom" — a finished
  // 25-row composition. Doesn't mutate own progress.
  const seedParam = search.get("seed");
  const isShared = !!seedParam && seedParam !== ownSeed;
  const wovenCount = isShared
    ? 25
    : Math.min(Math.max(ops.filter((op) => op.kind !== "bead").length, 5), 25);

  const seedShort = (ownSeed || "—").slice(0, 8);
  const sharedSeedShort = (seedParam || "").slice(0, 8);

  const learnerName = useSettings((s) => s.learnerName);
  const setLearnerName = useSettings((s) => s.setLearnerName);
  const heirloomComplete = useProgress((s) =>
    s.achievements.includes("heirloom_complete"),
  );

  const [zoom, setZoom] = useState(1);
  const [busy, setBusy] = useState<"download" | "share" | "certificate" | null>(
    null,
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);

  async function onCopyLink() {
    try {
      const url = `${window.location.origin}/tapestry?seed=${encodeURIComponent(ownSeed)}`;
      await navigator.clipboard.writeText(url);
      playCue("ui.tap");
      setFeedback(
        lang === "en" ? "Tapestry link copied" : "نُسخ رابط النسيج",
      );
    } catch {
      setFeedback(
        lang === "en" ? "Copy failed" : "تعذّر النسخ",
      );
    } finally {
      setTimeout(() => setFeedback(null), 2400);
    }
  }

  async function onDownload() {
    if (busy) return;
    setBusy("download");
    try {
      const blob = await buildTapestryPng({
        rowsWoven: wovenCount,
        streak,
        pearlsCollected: pearls.length,
        lang,
      });
      const stamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `pearl-and-loom-tapestry-${stamp}.png`);
      playCue("loom.thump");
      setFeedback(lang === "en" ? "Tapestry saved" : "حُفظ النسيج");
    } catch (err) {
      console.error(err);
      setFeedback(lang === "en" ? "Save failed" : "فشل الحفظ");
    } finally {
      setBusy(null);
      setTimeout(() => setFeedback(null), 2400);
    }
  }

  async function onSaveCertificate() {
    if (busy) return;
    if (!learnerName.trim()) {
      setSigning(true);
      return;
    }
    setBusy("certificate");
    try {
      const blob = await buildCertificatePng({
        learnerName: learnerName.trim(),
        rowsWoven: wovenCount,
        pearlsCollected: pearls.length,
        streak,
        lang,
      });
      const stamp = new Date().toISOString().slice(0, 10);
      const slug =
        learnerName
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 40) || "heirloom";
      downloadBlob(blob, `pearl-and-loom-certificate-${slug}-${stamp}.png`);
      playCue("ceremony.heirloom");
      setFeedback(lang === "en" ? "Certificate sealed" : "خُتمت الشهادة");
    } catch (err) {
      console.error(err);
      setFeedback(lang === "en" ? "Save failed" : "فشل الحفظ");
    } finally {
      setBusy(null);
      setTimeout(() => setFeedback(null), 2400);
    }
  }

  async function onShare() {
    if (busy) return;
    setBusy("share");
    const shareText =
      lang === "en"
        ? `My Pearl & Loom heirloom — ${wovenCount} of 25 rows woven, ${pearls.length} pearls collected.`
        : `إرثي من اللؤلؤة والنول — ${wovenCount} من ٢٥ صفًّا و${pearls.length} لؤلؤة.`;
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/tapestry?seed=${encodeURIComponent(ownSeed)}`
        : "";
    try {
      // Prefer Web Share API with the PNG file when available.
      const blob = await buildTapestryPng({
        rowsWoven: wovenCount,
        streak,
        pearlsCollected: pearls.length,
        lang,
      });
      const file = new File([blob], "tapestry.png", { type: "image/png" });
      const navAny = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
      };
      if (navAny.canShare && navAny.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText, url });
        playCue("ui.tap");
      } else if (navigator.share) {
        await navigator.share({ text: shareText, url });
        playCue("ui.tap");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText} — ${url}`);
        setFeedback(lang === "en" ? "Link copied to clipboard" : "نُسخ الرابط");
      }
    } catch (err) {
      // User cancelled or API unavailable — try clipboard fallback.
      if ((err as DOMException)?.name !== "AbortError" && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(`${shareText} — ${url}`);
          setFeedback(lang === "en" ? "Link copied to clipboard" : "نُسخ الرابط");
        } catch {
          /* swallow */
        }
      }
    } finally {
      setBusy(null);
      setTimeout(() => setFeedback(null), 2400);
    }
  }

  return (
    <TentScene time="day">
      <TopChrome
        onBack={() => router.push(isShared ? "/" : "/loom")}
        title={`${t("heirloom.title")} · ${t("heirloom.tapestry")}`}
        subtitle={`${t("heirloom.laylaWeave").toUpperCase()} · ${fmt(wovenCount)}/${fmt(TAPESTRY_TOTAL_ROWS)} ${t("heirloom.rowsWoven").toUpperCase()}`}
      />

      {isShared && (
        <div
          role="status"
          style={{
            position: "absolute",
            top: 78,
            insetInlineStart: 0,
            insetInlineEnd: 0,
            zIndex: 40,
            display: "flex",
            justifyContent: "center",
            padding: "0 clamp(16px, 3vw, 40px)",
          }}
        >
          <div
            style={{
              maxWidth: 720,
              width: "100%",
              padding: "10px 16px",
              background:
                "linear-gradient(135deg, rgba(232,163,61,0.18), rgba(181,52,30,0.12))",
              border: "1px solid rgba(232,163,61,0.55)",
              color: "var(--wool)",
              fontFamily: "var(--font-tajawal), sans-serif",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-cormorant), serif",
                color: "var(--saffron)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontSize: 11,
              }}
            >
              {lang === "en" ? "Shared heirloom" : "إرث مُشارَك"}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              {lang === "en"
                ? `Viewing the heirloom for seed ${sharedSeedShort}.`
                : `معاينة إرث للبذرة ${sharedSeedShort}.`}
            </span>
            <a
              href="/tapestry"
              style={{
                color: "var(--saffron)",
                fontSize: 12,
                letterSpacing: "0.18em",
                textDecoration: "underline",
              }}
            >
              {lang === "en" ? "Open your own →" : "إرثك ←"}
            </a>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: isShared ? 134 : 86,
          paddingBottom: 80,
          paddingInline: "clamp(16px, 3vw, 40px)",
          display: "flex",
          gap: "clamp(16px, 2.5vw, 28px)",
          alignItems: "stretch",
          alignContent: "flex-start",
          justifyContent: "center",
          flexWrap: "wrap",
          overflowY: "auto",
          overflowX: "hidden",
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
            className="paper-aged tap-frame"
            style={{
              padding: "clamp(12px, 3vw, 22px)",
              border: "2px solid #6B4423",
              boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
              background: "linear-gradient(170deg, #5A3618, #3D2A1E)",
              transform: `scale(${zoom})`,
              transition: "transform 0.6s var(--ease-loom)",
              maxWidth: "100%",
            }}
          >
            <div
              className="ltr-internal tap-rows"
              style={{
                width: "min(360px, 78vw)",
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
                          background: PEARL_TIERS[row.pearl].simpleGradient,
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

        <div className="tap-side" style={{ width: 280, color: "var(--wool)", overflowY: "auto" }}>
          {!isShared && (
            <div
              style={{
                marginBottom: 18,
                padding: "10px 12px",
                background: "rgba(28,18,12,0.55)",
                border: "1px solid rgba(232,163,61,0.3)",
                fontFamily: "var(--font-tajawal), sans-serif",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "var(--saffron)",
                  marginBottom: 4,
                }}
              >
                {lang === "en" ? "Tapestry seed" : "بذرة النسيج"}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <code
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: 14,
                    color: "var(--wool)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {seedShort}
                </code>
                <button
                  onClick={onCopyLink}
                  className="seed-copy"
                  title={lang === "en" ? "Copy direct-view link" : "انسخ الرابط"}
                >
                  {lang === "en" ? "Copy link" : "انسخ"}
                </button>
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(240,228,201,0.55)",
                  marginTop: 6,
                  lineHeight: 1.5,
                }}
              >
                {lang === "en"
                  ? "Every player gets a different seed — share yours to let someone view your finished tapestry."
                  : "لكل لاعب بذرة مختلفة — شاركها ليرى أحدهم نسيجك."}
              </div>
            </div>
          )}
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
        className="tap-controls"
        style={{
          position: "absolute",
          bottom: 20,
          insetInlineStart: 40,
          insetInlineEnd: 40,
          display: "flex",
          gap: 18,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
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
        <button
          className="tap-btn"
          onClick={onDownload}
          disabled={busy !== null || isShared}
          title={
            isShared
              ? lang === "en"
                ? "Saving is disabled when viewing a shared seed"
                : "الحفظ معطَّل في وضع المشاركة"
              : undefined
          }
        >
          {busy === "download"
            ? lang === "en" ? "Saving…" : "جارِ الحفظ…"
            : t("tapestry.download")}
        </button>
        <button
          className="tap-btn"
          onClick={onShare}
          disabled={busy !== null || isShared}
        >
          {busy === "share"
            ? lang === "en" ? "Sharing…" : "جارِ المشاركة…"
            : t("tapestry.share")}
        </button>
        {heirloomComplete && !isShared && (
          <button
            className="tap-btn tap-btn--accent"
            onClick={onSaveCertificate}
            disabled={busy !== null}
            title={
              !learnerName.trim()
                ? lang === "en"
                  ? "Sign your name first"
                  : "وقّع باسمك أولًا"
                : undefined
            }
          >
            {busy === "certificate"
              ? lang === "en" ? "Sealing…" : "جاري الختم…"
              : lang === "en" ? "Certificate" : "الشهادة"}
          </button>
        )}
      </div>
      {signing && heirloomComplete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={
            lang === "en" ? "Sign your certificate" : "وقّع شهادتك"
          }
          onClick={(e) => {
            if (e.target === e.currentTarget) setSigning(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(8,5,3,0.78)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={async (e) => {
              e.preventDefault();
              if (!learnerName.trim()) return;
              setSigning(false);
              await onSaveCertificate();
            }}
            style={{
              width: "min(440px, 100%)",
              background: "linear-gradient(180deg, #1A1208 0%, #0A0807 100%)",
              border: "1px solid var(--saffron)",
              padding: 24,
              color: "var(--wool)",
              fontFamily: "var(--font-tajawal), sans-serif",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                color: "var(--saffron)",
              }}
            >
              {lang === "en"
                ? "Sign your certificate"
                : "وقّع شهادتك"}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(240,228,201,0.7)",
                lineHeight: 1.5,
              }}
            >
              {lang === "en"
                ? "Your name will appear at the centre of the certificate as the weaver of this heirloom."
                : "سيظهر اسمك في وسط الشهادة بوصفك ناسج هذا الإرث."}
            </div>
            <input
              autoFocus
              type="text"
              value={learnerName}
              onChange={(e) => setLearnerName(e.target.value)}
              placeholder={lang === "en" ? "Your full name" : "اسمك الكامل"}
              maxLength={60}
              dir={lang === "ar" ? "rtl" : "ltr"}
              style={{
                padding: "12px 14px",
                background: "rgba(245,235,211,0.06)",
                border: "1px solid rgba(232,163,61,0.4)",
                color: "var(--wool)",
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: 18,
                letterSpacing: "0.04em",
                textAlign: "center",
                outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setSigning(false)}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  border: "1px solid rgba(240,228,201,0.3)",
                  color: "var(--wool)",
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: 12,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {lang === "en" ? "Cancel" : "إلغاء"}
              </button>
              <button
                type="submit"
                disabled={!learnerName.trim()}
                style={{
                  padding: "10px 20px",
                  background: learnerName.trim()
                    ? "var(--saffron)"
                    : "rgba(232,163,61,0.3)",
                  border: "1px solid var(--saffron)",
                  color: "var(--charcoal)",
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: 12,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  cursor: learnerName.trim() ? "pointer" : "not-allowed",
                  fontWeight: 600,
                }}
              >
                {lang === "en" ? "Seal" : "اختم"}
              </button>
            </div>
          </form>
        </div>
      )}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(232,163,61,0.95)",
            color: "var(--charcoal)",
            padding: "10px 22px",
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 13,
            letterSpacing: "0.2em",
            zIndex: 60,
            boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
          }}
        >
          {feedback}
        </div>
      )}
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
        .tap-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 640px) {
          .tap-side { width: 100% !important; max-width: 100% !important; }
          .tap-controls {
            inset-inline-start: 16px !important;
            inset-inline-end: 16px !important;
            bottom: 12px !important;
            gap: 10px !important;
          }
          .tap-frame { padding: 10px !important; }
        }
        .tap-btn--accent {
          background: var(--saffron);
          color: var(--charcoal);
          border-color: var(--saffron);
          font-weight: 600;
        }
        .tap-btn--accent:hover:not(:disabled) {
          background: var(--saffron-soft);
        }
        .seed-copy {
          padding: 4px 10px;
          background: var(--saffron);
          color: var(--charcoal);
          border: none;
          font-family: var(--font-cormorant), serif;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }
        .seed-copy:hover { background: var(--saffron-soft); }
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
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: PEARL_TIERS[grade].cssVar,
          display: "inline-block",
          marginInlineEnd: 4,
        }}
      />
      {label}
    </span>
  );
}
