import type { Dict } from "./en";

// Arabic copy — AI-drafted, flagged in README for native-speaker review before production.
export const ar: Dict = {
  meta: {
    title: "الَّلؤلؤة والنّول",
    subtitle: "مسارُ تعلُّمٍ منسوجٌ في تراث الإمارات",
  },
  splash: {
    chooseLanguage: "اختَر لغتك",
    english: "English",
    arabic: "العربية",
    continue: "متابعة",
  },
  home: {
    welcome: "أهلاً بكم في خيمة العائلة",
    intro:
      "طفلان من عائلةٍ واحدة. ليلى تنسجُ على النّول، وسيف يغوصُ في البحر. ما يتعلَّمانه يصبحُ قصّتَهما المشتركة.",
    chooseSibling: "من تريد أن تكون؟",
    layla: {
      name: "ليلى",
      role: "الصف الرابع · رياضيات على نَول السدو",
      tagline: "تناظرٌ وكسورٌ وأنماطٌ تُنسج في نسيج.",
    },
    saif: {
      name: "سيف",
      role: "الصف الثامن · علومٌ في البحر",
      tagline: "طفوٌ وضغطٌ وأحياءٌ بحرية — من خلال الغوص.",
    },
    progress: "صفّاً منسوجاً",
  },
  nav: {
    back: "رجوع",
    home: "الرئيسية",
    loom: "النّول",
    sea: "البحر",
    tapestry: "النسيج",
    styleguide: "دليل التصميم",
    settings: "الإعدادات",
  },
  settings: {
    language: "اللغة",
    numerals: "الأرقام",
    numeralAuto: "تلقائي",
    numeralWestern: "1234567890",
    numeralArabic: "١٢٣٤٥٦٧٨٩٠",
    audio: "الصوت",
    audioOn: "تشغيل",
    audioOff: "إيقاف",
  },
  loom: {
    hubTitle: "النّول",
    hubSubtitle: "كلُّ درسٍ ينسجُ صفّاً جديداً من نسيجك.",
    weaveRow: "انسجي هذا الصف",
    rowsWoven: "صفّاً منسوجاً",
    locked: "مقفل",
    next: "التالي",
    woven: "منسوج",
    needsPearls: "يحتاج {n} لآلئ",
    lessons: {
      symmetry: {
        title: "محاور التناظر",
        topic: "اعكسي الزخرفة حول المحور",
      },
      fractions: {
        title: "الكسور المتكافئة",
        topic: "لوّني الصف بالكسر نفسه بطريقتين",
      },
      tessellation: {
        title: "التبليط الهندسي",
        topic: "اختاري الدوران الذي يملأ دون فراغ",
      },
      arrays: {
        title: "صفوف الضرب",
        topic: "اجمعي عدد الزخارف في صفوف وأعمدة",
      },
      angles: {
        title: "الزوايا الهندسية",
        topic: "أديري المثلث ليُلائم النسج السداسي",
      },
    },
  },
  sea: {
    hubTitle: "البحر",
    hubSubtitle: "موسمُ الغوص — الغصة — يُنادي سيفاً إلى السفينة.",
    beginDive: "ابدأ الغوص",
    breath: "النَفَس",
    depth: "العمق",
    surface: "اطفُ",
    banked: "في السلّة",
    pearls: "لآلئ",
    dives: {
      buoyancy: {
        title: "ضِحلُ الساحل",
        topic: "الطفو والكثافة",
      },
      pressure: {
        title: "الشِّعب العميق",
        topic: "الضغط تحت الماء",
      },
      marineBio: {
        title: "حديقة المرجان",
        topic: "الأحياء البحرية",
      },
      lung: {
        title: "رئةُ البحر",
        topic: "سَعةُ الرئة والتنفس",
      },
      refraction: {
        title: "تجربةُ الانكسار",
        topic: "الضوءُ تحت الماء",
      },
    },
  },
  pearls: {
    common: "عادية",
    fine: "نفيسة",
    royal: "ملكية",
  },
  feedback: {
    correct: "إجابة صحيحة",
    wrong: "حاول مرة أخرى",
    celebration: "أحسنتَ صنعاً",
  },
};
