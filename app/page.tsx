"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/provider";
import { useSettings } from "@/lib/store/settings";
import { useProgress } from "@/lib/store/progress";
import { rowCount } from "@/lib/pattern-engine";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NumeralText } from "@/components/ui/NumeralText";

const subscribeHydration = (cb: () => void) => useSettings.persist.onFinishHydration(cb);
const getHydrated = () => useSettings.persist.hasHydrated();
const getHydratedServer = () => false;

export default function HomePage() {
  // Wait for zustand persist to finish hydrating before deciding splash vs home —
  // useSyncExternalStore avoids the setState-in-effect anti-pattern.
  const hydrated = useSyncExternalStore(subscribeHydration, getHydrated, getHydratedServer);
  const hasChosenLanguage = useSettings((s) => s.hasChosenLanguage);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-sadu-saffron/40" aria-hidden />
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
    <div className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-sadu-wool px-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <span aria-hidden className="text-5xl text-sadu-saffron">◆</span>
        <h1 className="font-display text-4xl tracking-wide text-sadu-charcoal sm:text-5xl">
          The Pearl and the Loom
        </h1>
        <p className="font-sans text-2xl text-sadu-charcoal/80" lang="ar" dir="rtl">
          الَّلؤلؤة والنّول
        </p>
      </div>

      <div className="h-px w-24 bg-sadu-charcoal/20" />

      <div className="flex flex-col items-center gap-4">
        <p className="text-sadu-charcoal/70">
          Choose your language · اختَر لغتك
        </p>
        <div className="flex gap-3">
          <Button size="lg" variant="secondary" onClick={() => setLang("en")}>
            English
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setLang("ar")}
            style={{ fontFamily: "var(--font-tajawal)" }}
          >
            العربية
          </Button>
        </div>
      </div>
    </div>
  );
}

function FamilyTent() {
  const { t } = useI18n();
  const tapestryRowCount = useProgress((s) =>
    rowCount({ seed: s.seed, ops: s.ops, beads: s.beads }),
  );

  return (
    <AppShell>
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-12">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-display text-4xl tracking-wide text-sadu-charcoal sm:text-5xl">
            {t("home.welcome")}
          </h1>
          <p className="max-w-2xl text-lg text-sadu-charcoal/80">{t("home.intro")}</p>
        </header>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <CharacterCard
            href="/loom"
            name={t("home.layla.name")}
            role={t("home.layla.role")}
            tagline={t("home.layla.tagline")}
            accent="sadu"
          />
          <CharacterCard
            href="/sea"
            name={t("home.saif.name")}
            role={t("home.saif.role")}
            tagline={t("home.saif.tagline")}
            accent="sea"
          />
        </div>

        <footer className="flex w-full items-center justify-center text-sm text-sadu-charcoal/60">
          <NumeralText n={tapestryRowCount} className="font-medium text-sadu-charcoal" />
          <span className="ms-2">{t("home.progress")}</span>
        </footer>
      </section>
    </AppShell>
  );
}

interface CharacterCardProps {
  href: string;
  name: string;
  role: string;
  tagline: string;
  accent: "sadu" | "sea";
}

function CharacterCard({ href, name, role, tagline, accent }: CharacterCardProps) {
  const accentBg =
    accent === "sadu"
      ? "linear-gradient(180deg, #FAF3E2 0%, #F0E4C9 100%)"
      : "linear-gradient(180deg, #F0F4F2 0%, #DCE7EC 100%)";
  const accentTextColor = accent === "sadu" ? "text-sadu-charcoal" : "text-[#0A2530]";
  const accentBadgeColor =
    accent === "sadu" ? "bg-sadu-madder text-sadu-wool" : "bg-sea-blue text-sea-foam";

  return (
    <Link href={href} className="group">
      <Card
        tone={accent === "sadu" ? "tent" : "sea"}
        className="relative overflow-hidden p-8 transition-transform duration-500 group-hover:-translate-y-1"
      >
        <div className="absolute inset-0 -z-10" style={{ background: accentBg }} />
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span
              className={[
                "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
                accentBadgeColor,
              ].join(" ")}
            >
              {role}
            </span>
            <h2 className={["font-display text-3xl", accentTextColor].join(" ")}>{name}</h2>
            <p className={["text-base/relaxed", accentTextColor, "opacity-80"].join(" ")}>
              {tagline}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
