"use client";

// DiveTipsRail — small floating fact chips placed in the side gutters
// of the PreDive screen on wide desktops. Each dive carries 4 hand-
// picked tips spanning physics, biology, and pearling history so the
// kid picks up real context before they descend. Hidden on screens
// narrower than 1180px since the rails would crowd the loadout there.

import { useI18n } from "@/lib/i18n/provider";
import type { DiveKey } from "@/app/sea/page";

interface Tip {
  /** Small glyph at the start — emoji is fine here, kids parse it instantly. */
  glyph: string;
  en: string;
  ar: string;
}

const DIVE_TIPS: Record<DiveKey, [Tip, Tip, Tip, Tip]> = {
  shallowBank: [
    {
      glyph: "🪨",
      en: "The honed dive stone is called diveen.",
      ar: "حجر الغوص المصقول يُسمَّى الزِّبيل.",
    },
    {
      glyph: "🌊",
      en: "Saltwater pushes back ~3% harder than fresh water.",
      ar: "ماء البحر يدفع نحو ٣٪ أقوى من العذب.",
    },
    {
      glyph: "🫁",
      en: "Full lungs add ~1L of buoyancy — exhale to descend.",
      ar: "الرئتان الممتلئتان تضيفان لترًا من الطفو — ازفر لتنزل.",
    },
    {
      glyph: "📐",
      en: "Density = mass ÷ volume. Less than water = float.",
      ar: "الكثافة = الكتلة ÷ الحجم. أقل من الماء = طفو.",
    },
  ],
  deepReef: [
    {
      glyph: "📈",
      en: "Pressure adds 1 atm every 10 metres of depth.",
      ar: "يزيد الضغط جوًا واحدًا كل ١٠ أمتار.",
    },
    {
      glyph: "💨",
      en: "Air in your lungs halves in volume by 10m.",
      ar: "هواء الرئتين ينخفض إلى النصف عند ١٠م.",
    },
    {
      glyph: "🎵",
      en: "The nahham's chant kept divers' breath in rhythm.",
      ar: "أهازيج النّهام تحفظ إيقاع نفس الغوّاص.",
    },
    {
      glyph: "👂",
      en: "Equalize ears every 1-2m or the pressure hurts.",
      ar: "وازن الأذنين كل ١–٢م وإلا آذاك الضغط.",
    },
  ],
  coralGarden: [
    {
      glyph: "🐚",
      en: "An oyster filters ~190 litres of water a day.",
      ar: "المحارة الواحدة ترشّح نحو ١٩٠ لترًا يوميًا.",
    },
    {
      glyph: "🪸",
      en: "Coral provides anchor points for oyster larvae.",
      ar: "المرجان يوفّر نقاط ارتساء لِيرقات المحار.",
    },
    {
      glyph: "💎",
      en: "Nacre is the same material that lines the shell.",
      ar: "النُّكر هو نفسه ما يبطّن الصدفة من الداخل.",
    },
    {
      glyph: "📅",
      en: "A pearl grows ~0.3mm per year inside the oyster.",
      ar: "تنمو اللؤلؤة نحو ٠٫٣مم سنويًا داخل المحارة.",
    },
  ],
  lungOfSea: [
    {
      glyph: "❤️",
      en: "Face submerged → heart slows 10–25%. Free oxygen.",
      ar: "غمر الوجه → القلب يبطّئ ١٠–٢٥٪. أكسجين أوفر.",
    },
    {
      glyph: "🫁",
      en: "Trained pearl divers held breath ~90 seconds at depth.",
      ar: "كان الغوّاصون المدرَّبون يكتمون أنفاسهم نحو ٩٠ ث في العمق.",
    },
    {
      glyph: "🌬️",
      en: "It's CO₂ buildup — not low oxygen — that says 'breathe!'",
      ar: "إنّ تراكم ثاني أكسيد الكربون — لا قلّة الأكسجين — يصرخ 'تنفّس!'",
    },
    {
      glyph: "🧘",
      en: "A calm heart burns 4× less oxygen than a racing one.",
      ar: "القلب الهادئ يستهلك أكسجينًا أقل ٤ مرات من المتسارع.",
    },
  ],
  refractionTrial: [
    {
      glyph: "💡",
      en: "Light slows down and bends entering water.",
      ar: "يبطّئ الضوء وينحرف عند دخول الماء.",
    },
    {
      glyph: "🔴",
      en: "Red light vanishes by ~5m. Blue travels deepest.",
      ar: "يختفي الأحمر عند ٥م. الأزرق ينفذ أعمق.",
    },
    {
      glyph: "☀️",
      en: "Pearling boats worked at noon for the clearest light.",
      ar: "كان الغوّاصون يعملون ظهرًا لأوضح ضوء.",
    },
    {
      glyph: "🎯",
      en: "Spear-fishers aim below the fish they see.",
      ar: "يصوّب الصيّاد أسفل السمكة التي يراها.",
    },
  ],
};

export function DiveTipsRail({ diveKey }: { diveKey: DiveKey }) {
  const { lang } = useI18n();
  const tips = DIVE_TIPS[diveKey];
  // Split 2 left, 2 right.
  const left = tips.slice(0, 2);
  const right = tips.slice(2);

  return (
    <>
      <div className="dive-tips dive-tips-l" aria-hidden>
        <div className="dive-tips-eyebrow">
          {lang === "en" ? "Did you know" : "هل تعلم"}
        </div>
        {left.map((tip, i) => (
          <TipChip key={i} tip={tip} lang={lang} index={i} />
        ))}
      </div>
      <div className="dive-tips dive-tips-r" aria-hidden>
        <div className="dive-tips-eyebrow">
          {lang === "en" ? "Sea lore" : "حكمة البحر"}
        </div>
        {right.map((tip, i) => (
          <TipChip key={i} tip={tip} lang={lang} index={i + 2} />
        ))}
      </div>
      <style>{`
        .dive-tips {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 280px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          z-index: 1;
          pointer-events: none;
        }
        .dive-tips-l { inset-inline-start: 28px; }
        .dive-tips-r { inset-inline-end: 28px; }

        .dive-tips-eyebrow {
          font-family: var(--font-cormorant), serif;
          font-size: 18px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--sunset-gold);
          font-weight: 700;
          opacity: 1;
          padding-inline-start: 4px;
          margin-bottom: 8px;
        }

        /* Hide rails on screens too narrow for them to fit beside the
           780px loadout column. Below 1180px they'd crowd the
           composition. */
        @media (max-width: 1180px) {
          .dive-tips { display: none; }
        }
      `}</style>
    </>
  );
}

function TipChip({ tip, lang, index }: { tip: Tip; lang: "en" | "ar"; index: number }) {
  return (
    <div className="dive-tip" style={{ animationDelay: `${0.2 + index * 0.12}s` }}>
      <span className="dive-tip-glyph" aria-hidden>{tip.glyph}</span>
      <span className="dive-tip-text">{lang === "en" ? tip.en : tip.ar}</span>
      <style>{`
        .dive-tip {
          padding: 16px 20px;
          background: linear-gradient(180deg, rgba(8,55,74,0.85) 0%, rgba(5,30,44,0.85) 100%);
          border: 2px solid rgba(244,184,96,0.6);
          border-radius: 20px;
          color: var(--foam);
          font-family: var(--font-tajawal), sans-serif;
          font-size: 18px;
          font-weight: 500;
          line-height: 1.5;
          backdrop-filter: blur(6px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          display: flex;
          gap: 14px;
          align-items: flex-start;
          opacity: 0;
          animation: tipRise 0.7s var(--ease-water, ease) forwards;
        }
        @keyframes tipRise {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .dive-tips-r .dive-tip {
          animation-name: tipRiseRight;
        }
        @keyframes tipRiseRight {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .dive-tip-glyph {
          flex: 0 0 auto;
          font-size: 28px;
          line-height: 1.2;
        }
        .dive-tip-text {
          flex: 1;
          color: rgba(240,244,242,0.92);
        }
        @media (prefers-reduced-motion: reduce) {
          .dive-tip { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
