import type { MotifId, PearlGrade } from "@/lib/pattern-engine/types";

export interface TapestryRowDef {
  motif: MotifId;
  palette: { fg: string; bg: string; outline?: string };
  label: string;
  pearl?: PearlGrade;
}

/**
 * The hand-curated 25-row narrative arc — bottom (oldest) to top (newest).
 * Story: family history, foundation → desert origins → protection → tree
 * of life → the sea → pearls → ghasa → homecoming → today. The student
 * "weaves" rows by completing lessons, revealing this composition over time.
 */
export const TAPESTRY_25: TapestryRowDef[] = [
  { motif: "stripe",   palette: { fg: "var(--wool)",         bg: "var(--madder-deep)" },                                  label: "foundation" },
  { motif: "chevron",  palette: { fg: "var(--saffron)",      bg: "var(--madder)" },                                       label: "dunes" },
  { motif: "mthalath", palette: { fg: "var(--madder)",       bg: "var(--wool)" },                                          label: "dunes" },
  { motif: "hubub",    palette: { fg: "var(--saffron-soft)", bg: "var(--indigo)" },                                       label: "grains" },
  { motif: "stripe",   palette: { fg: "var(--saffron)",      bg: "var(--charcoal)" },                                     label: "" },
  { motif: "eyoun",    palette: { fg: "var(--saffron)",      bg: "var(--wool-warm)", outline: "var(--indigo)" },          label: "protection" },
  { motif: "mushat",   palette: { fg: "var(--charcoal)",     bg: "var(--wool)" },                                          label: "daily life", pearl: "common" },
  { motif: "stripe",   palette: { fg: "var(--wool)",         bg: "var(--madder-deep)" },                                  label: "" },
  { motif: "dhurs",    palette: { fg: "var(--wool)",         bg: "var(--charcoal)" },                                      label: "horsemen" },
  { motif: "shajarah", palette: { fg: "var(--indigo)",       bg: "var(--wool-warm)" },                                     label: "the tree", pearl: "common" },
  { motif: "shajarah", palette: { fg: "var(--madder)",       bg: "var(--wool-warm)" },                                     label: "" },
  { motif: "eyoun",    palette: { fg: "var(--madder)",       bg: "var(--wool)", outline: "var(--indigo)" },                label: "" },
  { motif: "stripe",   palette: { fg: "var(--saffron)",      bg: "var(--indigo-deep)" },                                  label: "", pearl: "royal" },
  { motif: "chevron",  palette: { fg: "var(--saffron)",      bg: "var(--sea-blue)" },                                     label: "the sea begins" },
  { motif: "mthalath", palette: { fg: "var(--sea-blue)",     bg: "var(--foam)" },                                          label: "waves" },
  { motif: "hubub",    palette: { fg: "var(--pearl-common)", bg: "var(--sea-deep)" },                                     label: "pearls", pearl: "fine" },
  { motif: "stripe",   palette: { fg: "var(--coral)",        bg: "var(--sea-deep)" },                                     label: "" },
  { motif: "eyoun",    palette: { fg: "var(--coral)",        bg: "var(--wool-warm)", outline: "var(--sea-blue)" },         label: "ghasa" },
  { motif: "mushat",   palette: { fg: "var(--sea-blue)",     bg: "var(--wool)" },                                          label: "" },
  { motif: "dhurs",    palette: { fg: "var(--wool)",         bg: "var(--sea-blue)" },                                      label: "" },
  { motif: "shajarah", palette: { fg: "var(--saffron)",      bg: "var(--indigo)" },                                       label: "homecoming", pearl: "common" },
  { motif: "chevron",  palette: { fg: "var(--saffron)",      bg: "var(--madder)" },                                       label: "" },
  { motif: "mthalath", palette: { fg: "var(--madder)",       bg: "var(--saffron-soft)" },                                  label: "" },
  { motif: "stripe",   palette: { fg: "var(--wool)",         bg: "var(--madder-deep)" },                                  label: "" },
  { motif: "stripe",   palette: { fg: "var(--saffron)",      bg: "var(--charcoal)" },                                     label: "today" },
];

export const TAPESTRY_TOTAL_ROWS = 30;
