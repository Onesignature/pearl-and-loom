"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/provider";
import { useSettings } from "@/lib/store/settings";
import { useProgress } from "@/lib/store/progress";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { CharacterCard } from "@/components/home/CharacterCard";
import { TapestryStrip } from "@/components/tapestry/TapestryStrip";

const subscribeHydration = (cb: () => void) =>
  useSettings.persist.onFinishHydration(cb);
const getHydrated = () => useSettings.persist.hasHydrated();
const getHydratedServer = () => false;

export default function HomePage() {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getHydrated,
    getHydratedServer,
  );
  const hasChosenLanguage = useSettings((s) => s.hasChosenLanguage);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-saffron/40" aria-hidden />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {hasChosenLanguage ? (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FamilyTent />
        </motion.div>
      ) : (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LanguageSplash />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LanguageSplash() {
  const { setLang } = useI18n();
  return (
    <TentScene>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          <div
            className="font-display"
            style={{
              fontSize: 14,
              color: "var(--saffron)",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
            }}
          >
            Abu Dhabi · 1948
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 64,
              fontWeight: 400,
              color: "var(--wool)",
              letterSpacing: "0.02em",
              fontStyle: "italic",
              lineHeight: 1.05,
            }}
          >
            The Pearl and the Loom
          </h1>
          <p
            style={{
              fontFamily: "var(--font-tajawal), sans-serif",
              fontSize: 28,
              color: "var(--wool)",
              opacity: 0.85,
              margin: 0,
            }}
            lang="ar"
            dir="rtl"
          >
            اللؤلؤة والنَّول
          </p>
          <div
            style={{
              marginTop: 8,
              fontSize: 13,
              color: "rgba(240,228,201,0.55)",
              fontStyle: "italic",
              letterSpacing: "0.08em",
            }}
          >
            A family story, woven row by row · حكاية عائلة، تُنسَج صفًّا بعد صف
          </div>
        </div>

        <div style={{ width: 96, height: 1, background: "rgba(240,228,201,0.25)" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
          <div
            style={{
              fontSize: 11,
              color: "var(--wool)",
              opacity: 0.65,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            Choose your language · اختَر لغتك
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <button onClick={() => setLang("en")} className="splash-btn">
              <span className="font-display" style={{ fontSize: 18, letterSpacing: "0.12em" }}>
                English
              </span>
            </button>
            <button
              onClick={() => setLang("ar")}
              className="splash-btn"
              style={{ fontFamily: "var(--font-tajawal), sans-serif" }}
            >
              <span style={{ fontSize: 22, letterSpacing: 0 }}>العربية</span>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .splash-btn {
          background: rgba(245,235,211,0.06);
          color: var(--wool);
          border: 1px solid rgba(244,184,96,0.4);
          padding: 16px 36px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s var(--ease-loom);
        }
        .splash-btn:hover {
          background: rgba(244,184,96,0.18);
          border-color: var(--saffron);
          transform: translateY(-2px);
        }
      `}</style>
    </TentScene>
  );
}

function FamilyTent() {
  const router = useRouter();
  const { t, fmt, lang } = useI18n();
  const ops = useProgress((s) => s.ops);
  const pearls = useProgress((s) => s.pearls);
  const wovenCount = ops.filter((op) => op.kind !== "bead").length;

  return (
    <TentScene>
      <TopChrome />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 110,
          paddingTop: 80,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 38, maxWidth: 760 }}>
          <div
            className="font-display"
            style={{
              fontSize: 14,
              color: "var(--saffron)",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            {t("era.abuDhabi1948")}
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily:
                lang === "ar"
                  ? "var(--font-tajawal), sans-serif"
                  : "var(--font-cormorant), serif",
              fontSize: lang === "ar" ? 56 : 72,
              fontWeight: 400,
              color: "var(--wool)",
              letterSpacing: lang === "ar" ? "0" : "0.02em",
              lineHeight: 1.05,
              whiteSpace: "nowrap",
              fontStyle: lang === "en" ? "italic" : "normal",
            }}
          >
            {t("meta.title")}
          </h1>
          <div
            style={{
              marginTop: 18,
              color: "rgba(240,228,201,0.65)",
              fontSize: 15,
              letterSpacing: "0.08em",
              fontStyle: "italic",
            }}
          >
            {t("meta.subtitle")}
          </div>
        </div>

        <div
          style={{
            color: "var(--wool)",
            marginBottom: 28,
            fontSize: 12,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            opacity: 0.55,
          }}
        >
          {t("home.chooseChild")}
        </div>

        <div style={{ display: "flex", gap: 36, flexWrap: "wrap", justifyContent: "center" }}>
          <CharacterCard
            who="layla"
            onClick={() => router.push("/loom")}
            progress={{ current: wovenCount, total: 30, label: "home.rowsWoven" }}
          />
          <CharacterCard
            who="saif"
            onClick={() => router.push("/sea")}
            progress={{ current: pearls.length, total: 12, label: "home.pearlsCollected" }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          padding: "16px 28px",
          background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              color: "var(--wool)",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            {t("home.familyTapestry")}
          </div>
          <div
            style={{
              color: "var(--saffron)",
              fontSize: 12,
              fontFamily: "var(--font-cormorant), serif",
              letterSpacing: "0.1em",
            }}
          >
            <span className="font-display" style={{ fontSize: 18 }}>
              {fmt(wovenCount)}
            </span>
            <span style={{ opacity: 0.5, margin: "0 6px" }}>/</span>
            <span style={{ opacity: 0.7 }}>
              {fmt(30)} {t("home.rowsWoven")}
            </span>
          </div>
        </div>
        <TapestryStrip woven={wovenCount} height={48} />
      </div>
    </TentScene>
  );
}
