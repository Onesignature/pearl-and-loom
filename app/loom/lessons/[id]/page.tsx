"use client";

import { use } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LoomLessonPage({ params }: PageProps) {
  const { id } = use(params);
  const { t } = useI18n();
  return (
    <AppShell world="loom">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
        <header>
          <p className="text-sm uppercase tracking-widest text-sadu-charcoal/60">
            {t("nav.loom")} · {id}
          </p>
        </header>
        <Card className="p-6">
          <p className="text-sadu-charcoal/70">Lesson player mounts here.</p>
        </Card>
      </section>
    </AppShell>
  );
}
