"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { LangToggle } from "./LangToggle";

interface AppShellProps {
  world?: "loom" | "sea" | "neutral";
  showNav?: boolean;
  children: React.ReactNode;
}

export function AppShell({ world = "neutral", showNav = true, children }: AppShellProps) {
  const { t, lang } = useI18n();
  return (
    <div
      data-world={world === "neutral" ? undefined : world}
      className="flex min-h-dvh flex-col"
    >
      {showNav ? (
        <header className="sticky top-0 z-40 border-b border-[var(--border-soft)] bg-background/85 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-3">
            <Link href="/" className="flex items-center gap-2 font-display text-xl tracking-wide">
              <span aria-hidden="true" className="text-sadu-saffron text-2xl leading-none">◆</span>
              <span className={lang === "ar" ? "font-sans" : "font-display"}>
                {t("meta.title")}
              </span>
            </Link>
            <nav className="flex items-center gap-3">
              <LangToggle compact />
            </nav>
          </div>
        </header>
      ) : null}
      <main className="flex-1">{children}</main>
    </div>
  );
}
