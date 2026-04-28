"use client";

import { useI18n } from "@/lib/i18n/provider";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NumeralText } from "@/components/ui/NumeralText";
import { LangToggle } from "@/components/layout/LangToggle";
import { NumeralToggle } from "@/components/layout/NumeralToggle";
import { SADU_COLORS } from "@/lib/pattern-engine/palette";
import { MOTIFS } from "@/lib/pattern-engine/motifs";

const SEA_PALETTE: Record<string, string> = {
  "sea-blue": "#0E5E7B",
  "sea-coral": "#E07856",
  "sea-dhow": "#6B4423",
  "sea-sunset": "#F4B860",
  "sea-foam": "#F0F4F2",
};

export default function StyleguidePage() {
  const { lang, t } = useI18n();
  return (
    <AppShell>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest text-sadu-charcoal/60">
            {t("nav.styleguide")}
          </p>
          <h1 className="font-display text-4xl tracking-wide text-sadu-charcoal">
            Design system
          </h1>
          <p className="text-sadu-charcoal/70">
            Tokens, type, motion, and motif library — the visual contract for the whole product.
          </p>
        </header>

        <Section label="Palettes">
          <div className="grid grid-cols-2 gap-6">
            <PaletteSwatches title="Sadu (loom world)" colors={SADU_COLORS} />
            <PaletteSwatches title="Sea (dive world)" colors={SEA_PALETTE} />
          </div>
        </Section>

        <Section label="Typography">
          <Card className="flex flex-col gap-4 p-8">
            <p className="font-display text-5xl tracking-wide text-sadu-charcoal">
              The Pearl and the Loom
            </p>
            <p className="text-3xl" lang="ar" dir="rtl">
              الَّلؤلؤة والنّول
            </p>
            <div className="grid grid-cols-2 gap-4 text-sadu-charcoal/80">
              <div>
                <p className="text-xs uppercase tracking-widest text-sadu-charcoal/60">Display</p>
                <p className="font-display text-2xl">Cormorant Garamond</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-sadu-charcoal/60">Body</p>
                <p className="text-xl">Tajawal — supports Arabic & Latin</p>
              </div>
            </div>
            <p className="text-base text-sadu-charcoal/70">
              Numerals respond to your active mode:{" "}
              <NumeralText n={1234567890} className="font-mono tabular-nums" />.
              Currently <code className="rounded bg-sadu-wool px-2 py-1">{lang}</code>.
            </p>
          </Card>
        </Section>

        <Section label="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </Section>

        <Section label="Toggles">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm uppercase tracking-widest text-sadu-charcoal/60 w-32">
                Language
              </p>
              <LangToggle />
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm uppercase tracking-widest text-sadu-charcoal/60 w-32">
                Numerals
              </p>
              <NumeralToggle />
            </div>
          </div>
        </Section>

        <Section label="Sadu motif library">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {(["mthalath", "shajarah", "eyoun", "mushat", "diamond"] as const).map((id) => {
              const spec = MOTIFS[id];
              return (
                <Card key={id} className="flex flex-col items-center gap-2 p-4">
                  <svg
                    viewBox="0 0 100 100"
                    className="h-24 w-24"
                    aria-label={spec.name}
                  >
                    {spec.paths.map((d, i) => (
                      <path
                        key={i}
                        d={d}
                        fill={spec.filled ? SADU_COLORS.indigo : "none"}
                        stroke={SADU_COLORS.indigo}
                        strokeWidth={spec.strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                  </svg>
                  <div className="text-center">
                    <p className="font-display text-base">{spec.name}</p>
                    <p className="text-sm" lang="ar" dir="rtl">
                      {spec.arName}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section label="Numeral toggle demo">
          <Card className="flex flex-col gap-3 p-6">
            <p className="text-sadu-charcoal/70">
              The same number in your active mode (toggle above):
            </p>
            <div className="flex items-baseline gap-6">
              <p className="font-display text-4xl">
                <NumeralText n={1234567890} />
              </p>
              <p className="font-mono text-sm text-sadu-charcoal/50">1234567890 / ١٢٣٤٥٦٧٨٩٠</p>
            </div>
          </Card>
        </Section>
      </section>
    </AppShell>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <p className="text-xs uppercase tracking-widest text-sadu-charcoal/60">{label}</p>
      {children}
    </section>
  );
}

function PaletteSwatches({
  title,
  colors,
}: {
  title: string;
  colors: Record<string, string>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-display text-xl">{title}</p>
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(colors).map(([name, hex]) => (
          <div key={name} className="flex flex-col gap-1">
            <div
              className="aspect-square rounded-lg border border-[var(--border-soft)]"
              style={{ background: hex }}
              aria-label={`${name} ${hex}`}
            />
            <p className="text-xs leading-tight text-sadu-charcoal/70">
              <span className="block font-medium text-sadu-charcoal">{name}</span>
              <span className="font-mono">{hex}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
