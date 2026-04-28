"use client";

import { useI18n } from "@/lib/i18n/provider";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

export default function LoomHubPage() {
  const { t } = useI18n();
  return (
    <AppShell world="loom">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-4xl tracking-wide text-sadu-charcoal">
            {t("loom.hubTitle")}
          </h1>
          <p className="text-lg text-sadu-charcoal/80">{t("loom.hubSubtitle")}</p>
        </header>
        <Card className="p-6">
          <p className="text-sadu-charcoal/70">
            {/* Placeholder until Claude Design hi-fi mockup arrives */}
            Lessons + tapestry preview will mount here.
          </p>
        </Card>
      </section>
    </AppShell>
  );
}
