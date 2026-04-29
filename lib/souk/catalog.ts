// Souk al-Lulu (سوق اللؤلؤ) — the pearl-merchant's catalog. Three stalls,
// three items each. Each item carries a real Bedouin / pearling cultural
// footnote so that "spending pearls" doubles as a brief lesson in trade
// vocabulary. Prices use only un-woven pearls (woven ones are heirloom).

export type Stall = "threads" | "gear" | "heirlooms";

export interface PearlCost {
  common?: number;
  fine?: number;
  royal?: number;
}

export interface SoukItem {
  id: string;
  stall: Stall;
  glyph: string;
  nameEn: string;
  nameAr: string;
  /** Cultural one-liner (poetic flavor). */
  taglineEn: string;
  taglineAr: string;
  /** Mechanical effect — what changes in the app once owned. */
  effectEn: string;
  effectAr: string;
  /** Long cultural footnote shown on the item card. */
  noteEn: string;
  noteAr: string;
  cost: PearlCost;
}

export const SOUK_CATALOG: SoukItem[] = [
  // ── Sadu Threads — palette unlocks ────────────────────────────────────
  {
    id: "thread.saffron-charcoal",
    stall: "threads",
    glyph: "▦",
    nameEn: "Saffron-on-Charcoal Skein",
    nameAr: "خيط زعفراني على فحمي",
    taglineEn: "Festival weft",
    taglineAr: "لُحمة الأعياد",
    effectEn: "Tints the live tapestry view in saffron-on-charcoal.",
    effectAr: "يُلوِّن عرض النسيج بالزعفران على الفحمي.",
    noteEn:
      "Saffron threads were dyed with crocus carried by dhow from Persia and Spain — a luxury saved for festival cloth.",
    noteAr: "الزعفران كان يُحمل بالسفن من فارس والأندلس — ترف لقماش العيد.",
    cost: { fine: 2 },
  },
  {
    id: "thread.royal-wool",
    stall: "threads",
    glyph: "◇",
    nameEn: "Royal-on-Wool Skein",
    nameAr: "خيط ملكي على صوف",
    taglineEn: "Bridal weft",
    taglineAr: "لُحمة العرس",
    effectEn: "Tints the live tapestry view in golden royal on wool.",
    effectAr: "يُلوِّن النسيج بالذهبي الملكي على الصوف.",
    noteEn:
      "Cloth woven for a bride was begun on a Friday and finished only on a full moon. The royal pearl belongs in this border.",
    noteAr: "قماش العروس يبدأ يوم الجمعة ولا ينتهي إلا في ليلة بدر.",
    cost: { royal: 1, fine: 2 },
  },
  {
    id: "thread.pearling-coast",
    stall: "threads",
    glyph: "≈",
    nameEn: "Pearling-Coast Palette",
    nameAr: "ألوان الساحل",
    taglineEn: "The dhow's daybreak",
    taglineAr: "فجر السفينة",
    effectEn: "Tints the live tapestry view in foam, sea-blue, and gold.",
    effectAr: "يُلوِّن النسيج بألوان الزَّبَد والبحر والذهب.",
    noteEn:
      "Foam-white, sunset-gold, and sea-blue — the palette a pearl merchant remembered when describing the morning he found his finest lulu.",
    noteAr: "أبيض الزَّبَد، ذهب الغروب، وأزرق البحر — ألوان فجر اللؤلؤة الأثمن.",
    cost: { fine: 4 },
  },

  // ── Diving Gear — narrative upgrades ──────────────────────────────────
  {
    id: "gear.fattam",
    stall: "gear",
    glyph: "◉",
    nameEn: "Tortoiseshell Fattam",
    nameAr: "فطّام من قشر السلحفاة",
    taglineEn: "Nose-clip — extends the breath",
    taglineAr: "ملقط الأنف — يُطيل النفس",
    effectEn: "+10 starting breath, 15% slower drain in every dive.",
    effectAr: "+١٠ نفسٍ ابتدائي، استهلاكٌ أبطأ بنسبة ١٥٪ في الغوص.",
    noteEn:
      "Worn over the nose so the diver's breath stayed in his chest, not his throat. Boys carved their first one from tortoiseshell at age twelve.",
    noteAr: "يُلبس على الأنف ليُحبس النفس في الصدر. كان الصبي ينحت أوّل فطّام في الثانية عشرة.",
    cost: { common: 3 },
  },
  {
    id: "gear.diveen-stone",
    stall: "gear",
    glyph: "■",
    nameEn: "Honed Diveen Stone",
    nameAr: "حجر الزِّبيل المصقول",
    taglineEn: "Smoother sink, less drag",
    taglineAr: "نزول أنعم، احتكاك أقل",
    effectEn: "Saif descends and ascends 1.5× faster — less wasted breath.",
    effectAr: "ينزل سيف ويصعد بسرعة ١٫٥× — نفسٌ أقلُّ ضياعًا.",
    noteEn:
      "The diveen — a weight tied to the diver's foot. A well-honed stone descends straight; a poor one drags him sideways.",
    noteAr: "الزِّبيل — حجر يُربط في القدم. الحجر المصقول ينزل مستقيمًا.",
    cost: { common: 5 },
  },
  {
    id: "gear.heritage-net",
    stall: "gear",
    glyph: "▤",
    nameEn: "Heritage Pearl-Net",
    nameAr: "ديين تراثي",
    taglineEn: "Hand-stitched al-deyeen basket",
    taglineAr: "ديين منسوج باليد",
    effectEn: "Each successful dive yields a free common pearl on top.",
    effectAr: "كل غوصة ناجحة تربح لؤلؤةً عاديةً إضافية.",
    noteEn:
      "The al-deyeen, hung from the diver's neck, gathered the oysters he prised loose. The finest were stitched by the captain's mother.",
    noteAr: "الديين الذي يُعلَّق على عنق الغوّاص. أجوده كان من خياطة أم النوخذة.",
    cost: { fine: 3 },
  },

  // ── Tent Heirlooms — atmosphere modifiers ─────────────────────────────
  {
    id: "heirloom.brass-lantern",
    stall: "heirlooms",
    glyph: "✦",
    nameEn: "Brass Pearling Lantern",
    nameAr: "فانوس برّاق",
    taglineEn: "The captain's reading lamp",
    taglineAr: "قنديل قراءة النوخذة",
    effectEn:
      "Hangs an animated brass lantern in every tent scene (home, loom, chest, tapestry).",
    effectAr: "يُعلِّق فانوسًا برّاقًا متحرّكًا في كل مشهد خيمة.",
    noteEn:
      "Hung above the dhow's quarterdeck. The captain read the day's pearl-count by its light each evening before prayer.",
    noteAr: "كان يُعلَّق فوق سطح السفينة، يُحصى به اللؤلؤ قبل صلاة المغرب.",
    cost: { common: 4 },
  },
  {
    id: "heirloom.father-photo",
    stall: "heirlooms",
    glyph: "▢",
    nameEn: "Framed Father Photo",
    nameAr: "صورة الأب المؤطَّرة",
    taglineEn: "1948, the season before oil",
    taglineAr: "موسم ١٩٤٨، قبل النفط",
    effectEn: "Adds a framed family photograph above the chest.",
    effectAr: "يضيف صورةً عائليةً مؤطَّرة فوق الصندوق.",
    noteEn:
      "A traveling photographer reached Abu Dhabi for the first time the year before oil arrived. Most families never saw the prints.",
    noteAr: "وصل أوّل مصوّر متجوّل إلى أبو ظبي قبل عام النفط. أكثر العائلات لم تَرَ صورها.",
    cost: { fine: 1, common: 2 },
  },
  {
    id: "heirloom.dawn-sky",
    stall: "heirlooms",
    glyph: "☼",
    nameEn: "Dawn Sky for the Tent",
    nameAr: "سماء الفجر للخيمة",
    taglineEn: "Layla's loom in early light",
    taglineAr: "نَول ليلى في الضوء الباكر",
    effectEn: "Swaps the home tent's dusk gradient for a dawn one.",
    effectAr: "يستبدل غروب الخيمة بفجرٍ ورديّ.",
    noteEn:
      "Mothers worked the loom before sunrise — the cool hour when the warp threads held their tension and the children still slept.",
    noteAr: "الأمهات يعملن قبل الفجر — ساعة برد، يبقى السدى مشدودًا والأطفال نائمين.",
    cost: { common: 6 },
  },
];

export const STALLS: { id: Stall; titleEn: string; titleAr: string; subEn: string; subAr: string }[] =
  [
    {
      id: "threads",
      titleEn: "Sadu Threads",
      titleAr: "خيوط السدو",
      subEn: "Skeins for Layla's loom",
      subAr: "خيوط لنَول ليلى",
    },
    {
      id: "gear",
      titleEn: "Diving Gear",
      titleAr: "عُدّة الغوص",
      subEn: "Saif's tackle and weights",
      subAr: "أدوات سيف وأوزانه",
    },
    {
      id: "heirlooms",
      titleEn: "Tent Heirlooms",
      titleAr: "إرث الخيمة",
      subEn: "Lanterns, frames, and dawns",
      subAr: "قناديل وإطارات وفجور",
    },
  ];
