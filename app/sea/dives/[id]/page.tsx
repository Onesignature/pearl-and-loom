"use client";

import { use } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DivePage({ params }: PageProps) {
  const { id } = use(params);
  const { t } = useI18n();
  return (
    <AppShell world="sea">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
        <header>
          <p className="text-sm uppercase tracking-widest text-[#0A2530]/60">
            {t("nav.sea")} · {id}
          </p>
        </header>
        <Card tone="sea" className="p-6">
          <p className="text-[#0A2530]/70">R3F dive scene mounts here.</p>
        </Card>
      </section>
    </AppShell>
  );
}
