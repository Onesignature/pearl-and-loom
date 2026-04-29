// Achievement registry — every milestone is paired with a real Sadu motif
// and a Bedouin-weaving cultural footnote. Pure predicates over progress
// state so the unlock check is trivially testable.

import type { MotifId } from "@/lib/pattern-engine/types";

export interface AchievementCheckInput {
  loomLessonsCompleted: string[];
  diveLessonsCompleted: string[];
  pearls: { grade: "common" | "fine" | "royal"; diveId: string }[];
  ops: { kind: string }[];
  streak: number;
  hasToggledLang: boolean;
  hasToggledNumerals: boolean;
  /** Best-ever quiz score per path. 0 = not yet attempted or 0 correct. */
  quizBestScores: { layla: number; saif: number };
}

export interface AchievementDef {
  id: string;
  motif: MotifId;
  titleEn: string;
  titleAr: string;
  taglineEn: string;
  taglineAr: string;
  /** Bedouin / Sadu cultural note — one sentence of context for the motif or milestone. */
  noteEn: string;
  noteAr: string;
  check: (input: AchievementCheckInput) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_row",
    motif: "mthalath",
    titleEn: "Al-Mthalath",
    titleAr: "المثلث",
    taglineEn: "First row woven",
    taglineAr: "أوّل صفّ منسوج",
    noteEn:
      "Triangles paired tip-to-tip — the most ancient Sadu motif, taught first to every weaver's daughter.",
    noteAr: "المثلثات المتقابلة — أقدم زخارف السدو، يُعلَّمها كل بنت قبل غيرها.",
    check: (s) => s.loomLessonsCompleted.length >= 1,
  },
  {
    id: "first_pearl",
    motif: "eyoun",
    titleEn: "Al-Eyoun",
    titleAr: "العيون",
    taglineEn: "First pearl collected",
    taglineAr: "أوّل لؤلؤة",
    noteEn:
      "The eyes — a guardian motif woven on tent dividers to ward against ill intent.",
    noteAr: "العيون — زخرفة الحماية، تُنسج على فواصل الخيمة لردّ السوء.",
    check: (s) => s.pearls.length >= 1,
  },
  {
    id: "royal_catch",
    motif: "shajarah",
    titleEn: "Al-Shajarah",
    titleAr: "الشجرة",
    taglineEn: "Royal pearl secured",
    taglineAr: "لؤلؤة ملكية",
    noteEn:
      "The tree of life — reserved for cloth woven for a wedding, a birth, or a homecoming.",
    noteAr: "شجرة الحياة — لا تُنسج إلا في عرس أو ميلاد أو عودة.",
    check: (s) => s.pearls.some((p) => p.grade === "royal"),
  },
  {
    id: "master_weaver",
    motif: "mushat",
    titleEn: "Al-Mushat",
    titleAr: "المشط",
    taglineEn: "Ten rows woven — the comb of the loom",
    taglineAr: "عشرة صفوف — مشط النَّول",
    noteEn:
      "The comb that beats every weft tight against its row. A weaver's hand finds its rhythm at ten rows.",
    noteAr: "المشط الذي يُشدّ به اللُّحمة. اليد تجد إيقاعها بعد عشرة صفوف.",
    check: (s) => s.ops.filter((o) => o.kind !== "bead").length >= 10,
  },
  {
    id: "polyglot",
    motif: "chevron",
    titleEn: "Uwairjan",
    titleAr: "عويرجان",
    taglineEn: "Two languages, one cloth",
    taglineAr: "لغتان، نسيج واحد",
    noteEn:
      "Facing triangles — the border that reads the same from either side, like a tongue at home in both directions.",
    noteAr: "المثلثات المتقابلة — حدّ يُقرأ من الجهتين، كاللسان في لغتين.",
    check: (s) => s.hasToggledLang,
  },
  {
    id: "numerical",
    motif: "hubub",
    titleEn: "Al-Hubub",
    titleAr: "الحبوب",
    taglineEn: "Both numeral systems learned",
    taglineAr: "نظامان للأرقام",
    noteEn:
      "Grain seeds — the dot bands a weaver counts under her breath as she keeps the math of the cloth.",
    noteAr: "الحبوب — الفواصل النقطية التي تُحصى لتظلّ زاوية القماش صحيحة.",
    check: (s) => s.hasToggledNumerals,
  },
  {
    id: "deep_diver",
    motif: "dhurs",
    titleEn: "Al-Dhurs",
    titleAr: "الضرس",
    taglineEn: "Twelve metres down and back up",
    taglineAr: "اثنا عشر مترًا وعودة",
    noteEn:
      "Horse-teeth squares — the unbroken rhythm of breath the nahham sings to keep the divers' lungs steady.",
    noteAr: "الضرس — إيقاع النَّفس الذي يُغنّيه النّهام ليُثبّت رئة الغوّاص.",
    check: (s) => s.diveLessonsCompleted.includes("deepReef") || s.diveLessonsCompleted.includes("coralGarden"),
  },
  {
    id: "streak_3",
    motif: "mthalath",
    titleEn: "Three-Day Streak",
    titleAr: "ثلاثة أيام متتالية",
    taglineEn: "Layla's loom stays warm",
    taglineAr: "نَول ليلى دافئ",
    noteEn:
      "A weaver who returns three days in a row finds her warp tension still set — the loom remembers her.",
    noteAr: "من تعود ثلاثة أيام تجد سداها مشدودًا — النَّول يذكرها.",
    check: (s) => s.streak >= 3,
  },
  {
    id: "streak_7",
    motif: "shajarah",
    titleEn: "Seven-Day Streak",
    titleAr: "سبعة أيام متتالية",
    taglineEn: "A full week at the loom",
    taglineAr: "أسبوع كامل عند النَّول",
    noteEn:
      "Seven dawns, seven rows — the rhythm by which a tapestry of the heart is built.",
    noteAr: "سبعة فجرات، سبعة صفوف — على إيقاعها يُبنى النسيج.",
    check: (s) => s.streak >= 7,
  },
  {
    id: "heirloom_complete",
    motif: "shajarah",
    titleEn: "The Heirloom Complete",
    titleAr: "الإرث مكتمل",
    taglineEn: "Five lessons woven · pearls in the chest",
    taglineAr: "خمسة دروس مَنسوجة · لؤلؤ في الصندوق",
    noteEn:
      "A finished tapestry was wrapped around the bride's mother's hand and passed down — the family memory in cloth.",
    noteAr: "النسيج التام يُلفّ حول يد الأم ويُورَّث — ذاكرة العائلة في القماش.",
    // Trigger when the kid has woven the full 5-lesson Layla curriculum
    // AND brought home at least three pearls from Saif's dives. Gates the
    // HeirloomCeremony modal + the /tapestry Certificate button.
    check: (s) =>
      s.loomLessonsCompleted.length >= 5 && s.pearls.length >= 3,
  },
  {
    id: "laylas_apprentice",
    motif: "mthalath",
    titleEn: "Layla's Apprentice",
    titleAr: "تلميذة ليلى",
    taglineEn: "Passed the loom quiz · 4/5 or better",
    taglineAr: "اجتازت اختبار النَّول · ٤/٥ أو أفضل",
    noteEn:
      "A weaver's apprentice passed her first cloth review when she could explain — not just weave — every motif on the loom.",
    noteAr:
      "كانت التلميذة لا تُعتبر ناسجةً حتى تستطيع شرح كل زخرفة، لا أن تنسجها فحسب.",
    check: (s) => s.quizBestScores.layla >= 4,
  },
  {
    id: "saifs_apprentice",
    motif: "dhurs",
    titleEn: "Saif's Apprentice",
    titleAr: "تلميذ سيف",
    taglineEn: "Passed the dive quiz · 4/5 or better",
    taglineAr: "اجتاز اختبار الغوص · ٤/٥ أو أفضل",
    noteEn:
      "Before a young diver was trusted with the rope, the nahham would test his grasp of breath, depth, and the moods of the sea.",
    noteAr:
      "قبل أن يُسلَّم الغوّاص الشاب الحبل، كان النّهام يختبر علمه بالنَّفس والعمق وأمزجة البحر.",
    check: (s) => s.quizBestScores.saif >= 4,
  },
];

export const ACHIEVEMENT_BY_ID: Record<string, AchievementDef> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);
