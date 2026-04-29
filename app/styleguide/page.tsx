"use client";

import { useI18n } from "@/lib/i18n/provider";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { useRouter } from "next/navigation";
import { MOTIF_COMPONENTS, MOTIF_REGISTRY } from "@/components/motifs";
import { TAPESTRY_25 } from "@/lib/tapestry/composition";

const SADU_PALETTE: { name: string; hex: string }[] = [
  { name: "indigo", hex: "#1B2D5C" },
  { name: "madder", hex: "#B5341E" },
  { name: "saffron", hex: "#E8A33D" },
  { name: "charcoal", hex: "#2A2522" },
  { name: "wool", hex: "#F0E4C9" },
];

const SEA_PALETTE: { name: string; hex: string }[] = [
  { name: "sea-blue", hex: "#0E5E7B" },
  { name: "coral", hex: "#E07856" },
  { name: "dhow-wood", hex: "#6B4423" },
  { name: "sunset-gold", hex: "#F4B860" },
  { name: "foam", hex: "#F0F4F2" },
];

export default function StyleguidePage() {
  const router = useRouter();
  const { fmt, lang } = useI18n();

  return (
    <TentScene time="day">
      <TopChrome
        onHome={() => router.push("/")}
        title="Style guide"
        subtitle="DESIGN SYSTEM"
      />
      <div
        style={{
          position: "relative",
          minHeight: "100dvh",
          paddingTop: 110,
          paddingBottom: 60,
          paddingInline: "clamp(16px, 3vw, 60px)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", color: "var(--wool)" }}>
          <header style={{ marginBottom: 40 }}>
            <h1
              className="font-display"
              style={{ fontSize: 40, letterSpacing: "0.04em", margin: 0 }}
            >
              Design system
            </h1>
            <p style={{ opacity: 0.7, marginTop: 8 }}>
              Tokens, type, motifs, motion, and the live tapestry sandbox — every visual
              contract a reviewer might want to scan in 60 seconds.
            </p>
          </header>

          <Section label="Sadu palette · loom world">
            <PaletteSwatches colors={SADU_PALETTE} />
          </Section>

          <Section label="Sea palette · dive world">
            <PaletteSwatches colors={SEA_PALETTE} />
          </Section>

          <Section label="Typography">
            <div className="paper-bg" style={{ padding: 32 }}>
              <p
                className="font-display"
                style={{
                  fontSize: 56,
                  margin: 0,
                  color: "var(--ink)",
                  fontStyle: "italic",
                }}
              >
                The Pearl and the Loom
              </p>
              <p
                style={{
                  fontFamily: "var(--font-tajawal), sans-serif",
                  fontSize: 36,
                  color: "var(--ink)",
                  margin: "12px 0",
                }}
                lang="ar"
                dir="rtl"
              >
                اللؤلؤة والنَّول
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  color: "var(--ink-soft)",
                  marginTop: 18,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    Display
                  </p>
                  <p
                    className="font-display"
                    style={{ fontSize: 24, color: "var(--ink)", margin: "4px 0 0" }}
                  >
                    Cormorant Garamond
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    Body
                  </p>
                  <p
                    style={{
                      fontSize: 18,
                      color: "var(--ink)",
                      margin: "4px 0 0",
                      fontFamily: "var(--font-tajawal), sans-serif",
                    }}
                  >
                    Tajawal — Arabic & Latin
                  </p>
                </div>
              </div>
              <p style={{ marginTop: 18, color: "var(--ink-soft)" }}>
                Numerals respond to your active mode (try toggling top-right):{" "}
                <span
                  className="font-display"
                  style={{ fontSize: 22, color: "var(--ink)" }}
                >
                  {fmt(1234567890)}
                </span>{" "}
                — locale: <code style={{ background: "var(--wool)", padding: "2px 6px" }}>{lang}</code>
              </p>
            </div>
          </Section>

          <Section label="Sadu motif library">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              {MOTIF_REGISTRY.map((m) => {
                const Motif = MOTIF_COMPONENTS[m.id];
                if (!Motif) return null;
                return (
                  <div
                    key={m.id}
                    className="paper-bg"
                    style={{ padding: 16, display: "flex", gap: 14, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 80,
                        height: 50,
                        flexShrink: 0,
                        border: "1px solid rgba(80,55,30,0.2)",
                        background: "var(--wool)",
                      }}
                    >
                      <Motif w="100%" h="100%" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p
                        className="font-display"
                        style={{ fontSize: 16, margin: 0, color: "var(--ink)" }}
                      >
                        {m.en}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-tajawal), sans-serif",
                          fontSize: 14,
                          margin: "2px 0",
                          color: "var(--madder)",
                        }}
                      >
                        {m.ar}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          margin: 0,
                          color: "var(--ink-soft)",
                          lineHeight: 1.4,
                        }}
                      >
                        {lang === "en" ? m.noteEn : m.noteAr}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section label="Tapestry sandbox · 25-row narrative">
            <div
              className="paper-aged"
              style={{
                padding: 20,
                background: "linear-gradient(170deg, #5A3618, #3D2A1E)",
                maxWidth: 480,
                margin: "0 auto",
              }}
            >
              <div
                className="ltr-internal"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column-reverse",
                  border: "1px solid rgba(0,0,0,0.4)",
                }}
              >
                {TAPESTRY_25.map((row, i) => {
                  const Motif = MOTIF_COMPONENTS[row.motif];
                  if (!Motif) return null;
                  return (
                    <div key={i} style={{ height: 18 }}>
                      <Motif {...row.palette} w="100%" h="100%" />
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>

          <Section label="Motion timing">
            <div
              className="paper-bg"
              style={{
                padding: 20,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              {[
                ["Loom thump", "400-800ms", "var(--ease-loom)"],
                ["Underwater", "1000-1500ms", "var(--ease-water)"],
                ["Pearl rise", "1200ms", "var(--ease-pearl)"],
                ["Weave row", "400 / 800 / 600ms", "var(--ease-loom)"],
              ].map(([name, dur, ease]) => (
                <div key={name as string} style={{ color: "var(--ink)" }}>
                  <p
                    className="font-display"
                    style={{ fontSize: 14, margin: 0, letterSpacing: "0.1em" }}
                  >
                    {name}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--ink-soft)" }}>{dur}</p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: "var(--ink-soft)",
                    }}
                  >
                    {ease}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section label="Numeral toggle demo">
            <div className="paper-bg" style={{ padding: 24, display: "flex", gap: 30 }}>
              <div>
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--ink-soft)",
                    margin: 0,
                  }}
                >
                  Active
                </p>
                <p
                  className="font-display"
                  style={{ fontSize: 36, margin: "4px 0 0", color: "var(--ink)" }}
                >
                  {fmt(1234567890)}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--ink-soft)",
                    margin: 0,
                  }}
                >
                  Latin
                </p>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: 22,
                    margin: "4px 0 0",
                    color: "var(--ink)",
                  }}
                >
                  1234567890
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--ink-soft)",
                    margin: 0,
                  }}
                >
                  Arabic-Indic
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-tajawal), sans-serif",
                    fontSize: 22,
                    margin: "4px 0 0",
                    color: "var(--ink)",
                  }}
                >
                  ١٢٣٤٥٦٧٨٩٠
                </p>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </TentScene>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 36 }}>
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--saffron)",
          marginBottom: 14,
          opacity: 0.85,
        }}
      >
        {label}
      </p>
      {children}
    </section>
  );
}

function PaletteSwatches({ colors }: { colors: { name: string; hex: string }[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12,
      }}
    >
      {colors.map((c) => (
        <div
          key={c.name}
          style={{
            background: c.hex,
            padding: 14,
            color: c.name === "wool" || c.name === "foam" ? "var(--ink)" : "var(--wool)",
            border: "1px solid rgba(0,0,0,0.2)",
            minHeight: 90,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <span
            className="font-display"
            style={{ fontSize: 14, letterSpacing: "0.08em" }}
          >
            {c.name}
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 11, opacity: 0.85 }}>
            {c.hex}
          </span>
        </div>
      ))}
    </div>
  );
}
