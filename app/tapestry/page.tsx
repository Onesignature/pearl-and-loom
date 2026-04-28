"use client";

import { useI18n } from "@/lib/i18n/provider";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

export default function TapestryPage() {
  const { t } = useI18n();
  return (
    <AppShell>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <header>
          <h1 className="font-display text-4xl tracking-wide text-sadu-charcoal">
            {t("nav.tapestry")}
          </h1>
        </header>
        <Card className="p-6">
          <p className="text-sadu-charcoal/70">Full zoomable tapestry mounts here.</p>
        </Card>
      </section>
    </AppShell>
  );
}
