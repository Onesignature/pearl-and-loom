// Quiz banks — five questions per path, drawn from the curriculum the
// learner just walked through. Layla covers Grade 4 math (symmetry,
// fractions, tessellation, arrays, angles); Saif covers Grade 8 science
// (buoyancy, pressure, marine biology). Bilingual.

export type QuizPath = "layla" | "saif";

export interface QuizQuestion {
  id: string;
  promptEn: string;
  promptAr: string;
  /** Four options; index of the correct one. */
  optionsEn: [string, string, string, string];
  optionsAr: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  /** One-sentence "why" surfaced after the learner answers. */
  explainEn: string;
  explainAr: string;
}

const LAYLA: QuizQuestion[] = [
  {
    id: "l1",
    promptEn: "How many lines of symmetry does a square have?",
    promptAr: "كم خط تماثل يملك المربع؟",
    optionsEn: ["1", "2", "4", "8"],
    optionsAr: ["١", "٢", "٤", "٨"],
    correctIndex: 2,
    explainEn:
      "A square folds in half four ways — vertical, horizontal, and along both diagonals.",
    explainAr: "المربع يطوي إلى نصفين بأربع طرق: عمودي، أفقي، وقطريَين.",
  },
  {
    id: "l2",
    promptEn: "Which fraction is equivalent to 1/2?",
    promptAr: "أيُّ كسر يساوي ١/٢؟",
    optionsEn: ["2/3", "3/6", "1/3", "2/5"],
    optionsAr: ["٢/٣", "٣/٦", "١/٣", "٢/٥"],
    correctIndex: 1,
    explainEn: "3 out of 6 equal parts is the same as 1 out of 2 — both halve the whole.",
    explainAr: "٣ من ٦ أجزاء متساوية تساوي ١ من ٢ — كلاهما نصف الكل.",
  },
  {
    id: "l3",
    promptEn: "Which shape can tessellate (tile a row with no gaps)?",
    promptAr: "أيُّ شكل يبلِّط الصف دون فراغات؟",
    optionsEn: ["Circle", "Pentagon (5 sides)", "Equilateral triangle", "Octagon (8 sides)"],
    optionsAr: ["دائرة", "خماسي (٥ أضلاع)", "مثلث متساوي الأضلاع", "ثُماني (٨ أضلاع)"],
    correctIndex: 2,
    explainEn:
      "Equilateral triangles fit edge to edge with no gap — six of them meet at every point.",
    explainAr: "المثلثات المتساوية تلتقي عند كل نقطة ستةً ستة دون فراغ.",
  },
  {
    id: "l4",
    promptEn: "An array has 4 rows of 6 squares. How many squares total?",
    promptAr: "مصفوفة من ٤ صفوف، كل صف ٦ مربعات. كم مربعًا في الكلّ؟",
    optionsEn: ["10", "18", "24", "36"],
    optionsAr: ["١٠", "١٨", "٢٤", "٣٦"],
    correctIndex: 2,
    explainEn: "4 × 6 = 24. An array turns multiplication into something you can count.",
    explainAr: "٤ × ٦ = ٢٤. المصفوفة تحوّل الضرب إلى شيء يمكن عدّه.",
  },
  {
    id: "l5",
    promptEn: "A right angle measures…",
    promptAr: "قياس الزاوية القائمة…",
    optionsEn: ["45°", "90°", "180°", "360°"],
    optionsAr: ["٤٥°", "٩٠°", "١٨٠°", "٣٦٠°"],
    correctIndex: 1,
    explainEn:
      "A right angle is one quarter of a full turn. Two of them make a straight line.",
    explainAr: "الزاوية القائمة ربع دورة كاملة. اثنتان منها تكوّنان خطًا مستقيمًا.",
  },
];

const SAIF: QuizQuestion[] = [
  {
    id: "s1",
    promptEn:
      "A diver carries a heavy stone. The stone helps because of which force?",
    promptAr: "يحمل الغوّاص حجرًا ثقيلًا. الحجر يساعده بأيّ قوة؟",
    optionsEn: [
      "Friction",
      "Gravity",
      "Magnetism",
      "Surface tension",
    ],
    optionsAr: ["الاحتكاك", "الجاذبية", "المغناطيسية", "التوتّر السطحي"],
    correctIndex: 1,
    explainEn:
      "Gravity pulls the stone — and the diver — down faster than buoyancy can push them up.",
    explainAr: "الجاذبية تشدّ الحجر — والغوّاص — نحو الأسفل أسرع مما يدفعه الطفو نحو الأعلى.",
  },
  {
    id: "s2",
    promptEn: "What happens to water pressure as a diver goes deeper?",
    promptAr: "ماذا يحدث لضغط الماء كلّما نزل الغوّاص أعمق؟",
    optionsEn: [
      "It decreases",
      "It stays the same",
      "It increases",
      "It disappears below 5 m",
    ],
    optionsAr: ["يتناقص", "يبقى ثابتًا", "يزداد", "يختفي تحت ٥ م"],
    correctIndex: 2,
    explainEn:
      "Every 10 m of depth adds about 1 atmosphere of pressure on top of the surface air.",
    explainAr: "كل ١٠ أمتار عمق تضيف نحو جوّ ضغطي واحد فوق ضغط الهواء عند السطح.",
  },
  {
    id: "s3",
    promptEn:
      "Which object has more buoyancy in seawater than in fresh water?",
    promptAr: "أيُّ جسم طفوُه في ماء البحر أكبر من طفوه في الماء العذب؟",
    optionsEn: ["The same object", "An iron weight", "An empty bottle", "Nothing — it's the same"],
    optionsAr: [
      "الجسم نفسه",
      "ثقل من حديد",
      "زجاجة فارغة",
      "لا شيء — هما متساويان",
    ],
    correctIndex: 0,
    explainEn:
      "Seawater is denser than fresh water, so any object floats higher in it. That's why pearling is in the sea.",
    explainAr:
      "ماء البحر أكثف من الماء العذب، لذا أيّ جسم يطفو فيه أعلى. لهذا يكون الغوص في البحر.",
  },
  {
    id: "s4",
    promptEn: "Why do oysters open and close their shells?",
    promptAr: "لماذا يفتح المحار صدفته ويغلقها؟",
    optionsEn: [
      "To filter water for food",
      "To swim to a new spot",
      "To attack divers",
      "To dry the pearl inside",
    ],
    optionsAr: [
      "لتصفية الماء بحثًا عن الطعام",
      "للسباحة إلى مكان جديد",
      "لمهاجمة الغوّاصين",
      "لتجفيف اللؤلؤة في الداخل",
    ],
    correctIndex: 0,
    explainEn:
      "Oysters are filter-feeders — they pull plankton out of the water by pumping it through their gills.",
    explainAr: "المحار يقتات بالترشيح — يستخرج العوالق بضخّ الماء عبر خياشيمه.",
  },
  {
    id: "s5",
    promptEn: "Light bends when it enters water. This is called…",
    promptAr: "ينحرف الضوء عند دخوله الماء. هذه الظاهرة تُسمّى…",
    optionsEn: ["Reflection", "Refraction", "Diffraction", "Absorption"],
    optionsAr: ["انعكاس", "انكسار", "حيود", "امتصاص"],
    correctIndex: 1,
    explainEn:
      "Refraction is why a stick looks bent at the water's surface — and why pearls glint differently from above.",
    explainAr:
      "الانكسار سبب رؤية العصا منحنية عند سطح الماء — وسبب اختلاف لمعان اللؤلؤ من فوقه.",
  },
];

export const QUIZ_BANKS: Record<QuizPath, QuizQuestion[]> = {
  layla: LAYLA,
  saif: SAIF,
};

/** Total questions per quiz — referenced by score formatting and the store. */
export const QUIZ_LENGTH = 5;
