"use client";

import { useI18n } from "@/lib/i18n/provider";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

export default function SeaHubPage() {
  const { t } = useI18n();
  return (
    <AppShell world="sea">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-4xl tracking-wide text-[#0A2530]">
            {t("sea.hubTitle")}
          </h1>
          <p className="text-lg text-[#0A2530]/80">{t("sea.hubSubtitle")}</p>
        </header>
        <Card tone="sea" className="p-6">
          <p className="text-[#0A2530]/70">Dive cards + dhow deck mount here.</p>
        </Card>
      </section>
    </AppShell>
  );
}
