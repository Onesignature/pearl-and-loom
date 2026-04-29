"use client";

// Full-screen ceremony that fires once when 25 rows + 12 pearls land.
// Subscribes to the progress + settings stores via Zustand subscribe so the
// trigger logic runs outside React's effect-cascade lint rule, mirroring the
// AchievementWatcher pattern.

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { useSettings } from "@/lib/store/settings";
import { TAPESTRY_25 } from "@/lib/tapestry/composition";
import { MOTIF_COMPONENTS } from "@/components/motifs";
import { playCue } from "@/lib/audio/cues";
import { buildTapestryPng, downloadBlob } from "@/lib/tapestry/exportPng";
import { buildCertificatePng } from "@/lib/tapestry/buildCertificate";
import { PEARL_TIERS } from "@/lib/pearl/colors";

export function HeirloomCeremony() {
  const { lang, fmt } = useI18n();
  const learnerName = useSettings((s) => s.learnerName);
  const setLearnerName = useSettings((s) => s.setLearnerName);
  const [open, setOpen] = useState(false);
  const [savingCert, setSavingCert] = useState(false);

  useEffect(() => {
    const check = () => {
      const p = useProgress.getState();
      const s = useSettings.getState();
      const earned = p.achievements.includes("heirloom_complete");
      if (earned && !s.seenHeirloomCeremony) {
        setOpen(true);
        playCue("ceremony.heirloom");
      }
    };
    const unsubProgress = useProgress.subscribe(check);
    const unsubSettings = useSettings.subscribe(check);
    return () => {
      unsubProgress();
      unsubSettings();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  function close() {
    useSettings.getState().acknowledgeHeirloomCeremony();
    setOpen(false);
  }

  async function onSave() {
    try {
      const p = useProgress.getState();
      const woven = p.ops.filter((o) => o.kind !== "bead").length;
      const blob = await buildTapestryPng({
        rowsWoven: Math.min(woven, 25),
        streak: p.streak,
        pearlsCollected: p.pearls.length,
        lang,
      });
      const stamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `pearl-and-loom-heirloom-${stamp}.png`);
      playCue("loom.thump");
    } catch (err) {
      console.error(err);
    }
  }

  async function onSaveCertificate() {
    if (!learnerName.trim() || savingCert) return;
    setSavingCert(true);
    try {
      const p = useProgress.getState();
      const woven = p.ops.filter((o) => o.kind !== "bead").length;
      const blob = await buildCertificatePng({
        learnerName: learnerName.trim(),
        rowsWoven: Math.min(woven, 25),
        streak: p.streak,
        pearlsCollected: p.pearls.length,
        lang,
      });
      const stamp = new Date().toISOString().slice(0, 10);
      const slug = learnerName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40) || "heirloom";
      downloadBlob(blob, `pearl-and-loom-certificate-${slug}-${stamp}.png`);
      playCue("ceremony.heirloom");
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCert(false);
    }
  }

  if (!open) return null;

  const totalRows = TAPESTRY_25.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === "en" ? "Heirloom complete" : "اكتمل الإرث"}
      className="ceremony-stage"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="ceremony-inner" onClick={(e) => e.stopPropagation()}>
        <div className="ceremony-eyebrow">
          {lang === "en" ? "An heirloom is complete" : "إرث مكتمل"}
        </div>

        <div className="ceremony-tapestry-frame">
          <div className="ceremony-tapestry">
            {[...TAPESTRY_25].reverse().map((row, i) => {
              const Motif = MOTIF_COMPONENTS[row.motif];
              return (
                <div
                  key={i}
                  className="ceremony-row"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  {Motif && (
                    <Motif
                      w="100%"
                      h="100%"
                      fg={row.palette.fg}
                      bg={row.palette.bg}
                      outline={row.palette.outline}
                    />
                  )}
                  {row.pearl && (
                    <div
                      aria-hidden
                      className="ceremony-pearl"
                      style={{
                        background: PEARL_TIERS[row.pearl].simpleGradient,
                        ...(row.pearl === "royal"
                          ? { width: 11, height: 11 }
                          : {}),
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="ceremony-fringe" aria-hidden>
            {Array.from({ length: 22 }).map((_, i) => (
              <div key={i} className="ceremony-fringe-thread" />
            ))}
          </div>
        </div>

        <div className="ceremony-ornament" aria-hidden>
          <div className="ceremony-rule" />
          <svg width="14" height="14" viewBox="0 0 10 10">
            <path d="M 5 0 L 10 5 L 5 10 L 0 5 Z" fill="var(--saffron)" />
          </svg>
          <div className="ceremony-rule" />
        </div>

        <div className="ceremony-title">
          {lang === "en" ? "Heirloom Complete" : "اكتمل الإرث"}
        </div>
        <div className="ceremony-stats">
          {lang === "en"
            ? `${fmt(totalRows)} rows woven · 12 pearls braided in`
            : `${fmt(totalRows)} صفًّا منسوجًا · ١٢ لؤلؤة مضفورة`}
        </div>
        <div className="ceremony-note">
          {lang === "en"
            ? "A finished tapestry was wrapped around the bride's mother's hand and passed down — the family memory in cloth."
            : "النسيج التام يُلفّ حول يد الأم ويُورَّث — ذاكرة العائلة في القماش."}
        </div>

        <div className="ceremony-signing">
          <label
            htmlFor="ceremony-name"
            className="ceremony-signing-label"
          >
            {lang === "en"
              ? "Sign the heirloom — your name as it will appear on the certificate"
              : "وقّع الإرث — اسمك كما سيظهر على الشهادة"}
          </label>
          <input
            id="ceremony-name"
            type="text"
            value={learnerName}
            onChange={(e) => setLearnerName(e.target.value)}
            placeholder={lang === "en" ? "Your full name" : "اسمك الكامل"}
            maxLength={60}
            autoComplete="name"
            spellCheck={false}
            className="ceremony-signing-input"
            dir={lang === "ar" ? "rtl" : "ltr"}
          />
        </div>

        <div className="ceremony-actions">
          <button
            onClick={onSaveCertificate}
            className="ceremony-save"
            disabled={!learnerName.trim() || savingCert}
            title={
              !learnerName.trim()
                ? lang === "en"
                  ? "Sign your name first"
                  : "وقّع باسمك أولًا"
                : undefined
            }
          >
            {savingCert
              ? lang === "en" ? "Sealing…" : "جاري الختم…"
              : lang === "en" ? "Save your certificate" : "احفظ شهادتك"}
          </button>
          <button onClick={onSave} className="ceremony-save ceremony-save--secondary">
            {lang === "en" ? "Save tapestry" : "احفظ النسيج"}
          </button>
          <button onClick={close} className="ceremony-close">
            {lang === "en" ? "Close" : "إغلاق"}
          </button>
        </div>
      </div>

      <style>{`
        .ceremony-stage {
          position: fixed;
          inset: 0;
          z-index: 250;
          background: radial-gradient(ellipse 100% 80% at 50% 60%, #2A1810 0%, #0A0805 70%, #050302 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(20px, 4vw, 60px);
          overflow-y: auto;
          animation: ceremonyFade 1.2s var(--ease-loom);
          color: var(--wool);
        }
        @keyframes ceremonyFade { from { opacity: 0; } to { opacity: 1; } }

        .ceremony-inner {
          width: min(640px, 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 18px;
          font-family: var(--font-tajawal), sans-serif;
        }

        .ceremony-eyebrow {
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: var(--saffron);
          opacity: 0.85;
          animation: ceremonyEyebrow 1.5s var(--ease-loom);
        }
        @keyframes ceremonyEyebrow {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 0.85; transform: translateY(0); }
        }

        .ceremony-tapestry-frame {
          width: min(380px, 100%);
          padding: 16px;
          background: linear-gradient(170deg, #5A3618, #3D2A1E);
          border: 2px solid #6B4423;
          box-shadow: 0 30px 80px rgba(0,0,0,0.7), inset 0 0 30px rgba(232,163,61,0.18);
          animation: ceremonyFrameRise 1.4s var(--ease-loom) 0.2s backwards;
        }
        @keyframes ceremonyFrameRise {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ceremony-tapestry {
          display: flex;
          flex-direction: column;
          width: 100%;
          border: 1px solid rgba(0,0,0,0.4);
        }
        .ceremony-row {
          position: relative;
          height: 14px;
          opacity: 0;
          animation: ceremonyRowIn 0.5s var(--ease-loom) forwards;
        }
        @keyframes ceremonyRowIn {
          from { opacity: 0; transform: translateY(-3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ceremony-pearl {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(244,184,96,0.7), inset 0 -2px 4px rgba(0,0,0,0.2);
        }
        .ceremony-fringe {
          display: flex;
          justify-content: space-around;
          margin-top: 6px;
          height: 10px;
        }
        .ceremony-fringe-thread {
          width: 1px;
          height: 100%;
          background: rgba(201,168,118,0.55);
        }

        .ceremony-ornament {
          display: flex;
          align-items: center;
          gap: 14px;
          width: min(380px, 100%);
          opacity: 0;
          animation: ceremonyOrnamentIn 1s var(--ease-loom) 2.6s forwards;
        }
        @keyframes ceremonyOrnamentIn { to { opacity: 0.55; } }
        .ceremony-rule {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--saffron) 50%, transparent);
        }

        .ceremony-title {
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-size: clamp(28px, 4vw, 40px);
          color: var(--wool);
          letter-spacing: 0.04em;
          opacity: 0;
          animation: ceremonyTitleIn 1.2s var(--ease-loom) 2.8s forwards;
        }
        @keyframes ceremonyTitleIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ceremony-stats {
          font-family: var(--font-cormorant), serif;
          font-size: 13px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--saffron);
          opacity: 0;
          animation: ceremonyTitleIn 1s var(--ease-loom) 3.1s forwards;
        }
        .ceremony-note {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(240,228,201,0.78);
          max-width: 520px;
          margin-top: 6px;
          opacity: 0;
          animation: ceremonyTitleIn 1s var(--ease-loom) 3.4s forwards;
        }

        .ceremony-signing {
          width: min(420px, 100%);
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
          opacity: 0;
          animation: ceremonyTitleIn 1s var(--ease-loom) 3.55s forwards;
        }
        .ceremony-signing-label {
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--saffron);
          opacity: 0.85;
        }
        .ceremony-signing-input {
          padding: 12px 14px;
          background: rgba(245,235,211,0.06);
          border: 1px solid rgba(232,163,61,0.4);
          color: var(--wool);
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-size: 18px;
          letter-spacing: 0.04em;
          text-align: center;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .ceremony-signing-input::placeholder {
          color: rgba(240,228,201,0.35);
          font-style: italic;
        }
        .ceremony-signing-input:focus {
          border-color: var(--saffron);
          background: rgba(245,235,211,0.10);
        }

        .ceremony-actions {
          display: flex;
          gap: 12px;
          margin-top: 14px;
          flex-wrap: wrap;
          justify-content: center;
          opacity: 0;
          animation: ceremonyTitleIn 1s var(--ease-loom) 3.85s forwards;
        }
        .ceremony-save {
          padding: 12px 24px;
          background: var(--saffron);
          color: var(--charcoal);
          border: 1px solid var(--saffron);
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          font-weight: 600;
          box-shadow: 0 6px 18px rgba(232,163,61,0.32);
          transition: background 0.2s, transform 0.2s;
        }
        .ceremony-save:hover:not(:disabled) { background: var(--saffron-soft); transform: translateY(-1px); }
        .ceremony-save:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .ceremony-save--secondary {
          background: transparent;
          color: var(--saffron);
          box-shadow: none;
        }
        .ceremony-save--secondary:hover:not(:disabled) {
          background: rgba(232,163,61,0.14);
          color: var(--charcoal);
        }
        .ceremony-close {
          padding: 12px 24px;
          background: transparent;
          color: var(--wool);
          border: 1px solid rgba(240,228,201,0.3);
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
        }
        .ceremony-close:hover { background: rgba(245,235,211,0.08); }
      `}</style>
    </div>
  );
}
