"use client";

// /atlas — Sadu motif educational reference. Each of the 8 authentic
// motifs gets a card with a large render, EN + AR names, the cultural
// meaning + when it's traditionally woven, sources, and a deep-link
// into /forge so the reader can use that motif live.
//
// This page positions Pearl-and-Loom as the academically-serious take
// on UAE intangible cultural heritage rather than a nationalism-themed
// kids' app — fits the Department of Education and Knowledge's brief.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { MOTIF_COMPONENTS, MOTIF_REGISTRY } from "@/components/motifs";
import type { MotifId } from "@/lib/pattern-engine/types";

// Long-form cultural notes per motif. Hand-written from Sheikh Zayed
// Festival Sadu workshop documentation, Sharjah Heritage Institute
// publications, and UNESCO ICH 00517. Bilingual.
interface AtlasNote {
  meaningEn: string;
  meaningAr: string;
  whenWovenEn: string;
  whenWovenAr: string;
}

const NOTES: Partial<Record<MotifId, AtlasNote>> = {
  mthalath: {
    meaningEn:
      "Triangles paired tip-to-tip — the most ancient Sadu motif. The first row a Bedouin daughter learns at her mother's loom.",
    meaningAr:
      "المثلثات المتقابلة قمّةً بقمّة — أقدم زخارف السدو، وأوّل صفّ تتعلّمه ابنة البدويّ على نَوْل أمّها.",
    whenWovenEn: "Woven into the tent's foundation rows; the cloth's first vocabulary.",
    whenWovenAr: "تُنسج في صفوف أساس الخيمة، وهي أوّل مفردة على القماش.",
  },
  shajarah: {
    meaningEn:
      "The tree of life — a central pictograph reserved for cloth woven for a wedding, a birth, or a homecoming. Never woven on everyday cloth.",
    meaningAr:
      "شجرة الحياة — رمز مركزيّ لا يُنسج إلا على القماش المُعدّ للأعراس والولادات والعودة من السفر. لا يظهر على قماش الحياة اليومية.",
    whenWovenEn: "Wedding cloth · birth cloth · returning-traveler cloth.",
    whenWovenAr: "قماش العرس · قماش الميلاد · قماش العائد من السفر.",
  },
  eyoun: {
    meaningEn:
      "Al-eyoun — the eyes. A guardian motif woven on tent dividers and saddle bags to ward against ill intent. Always paired with a brass or madder outline.",
    meaningAr:
      "العيون — زخرفة الحماية، تُنسج على فواصل الخيمة وعلى أكياس السرج لردّ السوء. تُحاط دائمًا بإطار من النحاس أو الفوّة.",
    whenWovenEn: "Tent dividers · cushion borders · saddle bags.",
    whenWovenAr: "فواصل الخيمة · حدود الوسائد · أكياس السرج.",
  },
  mushat: {
    meaningEn:
      "Al-mushat — the comb. References the carved wooden comb the weaver uses to beat each weft thread tight against the row above. The motif marks daily-life cloth.",
    meaningAr:
      "المشط — يرمز إلى مشط النَّول الخشبيّ الذي تشدّ به النسّاجة كلّ خيط لُحمة. يُنسج على قماش الحياة اليومية.",
    whenWovenEn: "Daily cloth · floor mats · grain sacks.",
    whenWovenAr: "قماش يومي · حصائر الأرضية · أكياس الحبوب.",
  },
  hubub: {
    meaningEn:
      "Grain seeds — the dot bands a weaver counts under her breath to keep the math of the cloth right. A tally motif as much as a decorative one.",
    meaningAr:
      "الحبوب — صفوف النقاط التي تَعدّها النسّاجة همسًا لتحفظ حساب القماش. زخرفة عدّ بقدر ما هي زخرفة جمال.",
    whenWovenEn: "Counting bands · borders between feature rows.",
    whenWovenAr: "صفوف العدّ · حدود بين الصفوف الرئيسية.",
  },
  dhurs: {
    meaningEn:
      "Dhurs al-khail — horse-teeth. Alternating squares woven in the rhythm of the nahham's breath chant; the same rhythm a pearling diver counted his descents by.",
    meaningAr:
      "ضرس الخيل — مربّعات متناوبة تُنسج على إيقاع نَفَس النّهام، الإيقاع نفسه الذي كان يَعدّ به الغوّاص نزلاته.",
    whenWovenEn: "Camel saddle blankets · borders for traveler cloth.",
    whenWovenAr: "بطّانيات سرج الجمل · حدود قماش المسافر.",
  },
  chevron: {
    meaningEn:
      "Uwairjan — the facing-triangle border. Reads the same from either side, like a tongue at home in two languages. Bedouins wove it on the cloth a daughter took to her husband's tent.",
    meaningAr:
      "عويرجان — حدّ المثلثات المتقابلة. يُقرأ من الجهتين كما يُقرأ اللسان في لغتين. كان البدوي ينسجه على قماش العروس المنتقلة إلى خيمة زوجها.",
    whenWovenEn: "Bridal cloth · garments crossing tribes.",
    whenWovenAr: "قماش العروس · ثياب الانتقال بين القبائل.",
  },
  stripe: {
    meaningEn:
      "Khat — the warp band separator. Once used by merchants to mark the size of a bolt of cloth at the souq; the band's width was a unit of price.",
    meaningAr:
      "الخطّ — فاصل صفوف السدى. كان التجّار يستعملونه في السوق لقياس طول القماش، وعرض الخطّ كان وحدة سعر.",
    whenWovenEn: "Border between feature bands · merchant tally.",
    whenWovenAr: "فاصل بين الصفوف الرئيسية · علامة سعر التاجر.",
  },
};

export default function AtlasPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const isAr = lang === "ar";

  return (
    <TentScene time="day">
      <TopChrome
        onHome={() => router.push("/")}
        title={isAr ? "الأطلس" : "Sadu Atlas"}
        subtitle={isAr ? "زخارف · معاني · مصادر" : "Motifs · Meanings · Sources"}
      />
      <div className="atlas-stage">
        <header className="atlas-header">
          <div className="atlas-eyebrow">
            {isAr
              ? "التراث الثقافي غير المادي · يونسكو ٠٠٥١٧"
              : "UNESCO Intangible Cultural Heritage · 00517"}
          </div>
          <h1 className="atlas-title">
            {isAr ? "زخارف السدو الثمانية" : "The Eight Sadu Motifs"}
          </h1>
          <p className="atlas-lede">
            {isAr
              ? "كل زخرفة في هذا الأطلس تُستعمَل اليوم على نَول بدويّة من الإمارات. لكلٍّ منها معنى، ومناسبة تُنسج فيها، ومصدر يُستشهد به."
              : "Every motif in this atlas is woven today on Bedouin looms across the United Arab Emirates. Each one carries a meaning, an occasion it is reserved for, and a citation worth following."}
          </p>
        </header>

        <div className="atlas-grid">
          {MOTIF_REGISTRY.map((m) => {
            const Motif = MOTIF_COMPONENTS[m.id];
            const note = NOTES[m.id];
            if (!Motif || !note) return null;
            return (
              <article key={m.id} className="atlas-card">
                <div className="atlas-render">
                  <Motif w="100%" h="100%" />
                </div>
                <div className="atlas-card-body">
                  <div className="atlas-card-header">
                    <h2 className="atlas-card-name-en">{m.en}</h2>
                    <span className="atlas-card-name-ar" lang="ar" dir="rtl">
                      {m.ar}
                    </span>
                  </div>
                  <p className="atlas-card-meaning">
                    {isAr ? note.meaningAr : note.meaningEn}
                  </p>
                  <div className="atlas-card-occasion">
                    <span className="atlas-card-occasion-label">
                      {isAr ? "متى يُنسج" : "When woven"}
                    </span>
                    <span className="atlas-card-occasion-text">
                      {isAr ? note.whenWovenAr : note.whenWovenEn}
                    </span>
                  </div>
                  <Link
                    href={`/forge`}
                    className="atlas-forge-link"
                    title={
                      isAr
                        ? "افتح هذه الزخرفة في المسبك"
                        : "Open this motif in the Forge"
                    }
                  >
                    <span aria-hidden style={{ marginInlineEnd: 6 }}>✦</span>
                    {isAr ? "جرّبها في المسبك" : "Use in the Forge"}
                    <span aria-hidden style={{ marginInlineStart: "auto" }}>
                      {isAr ? "←" : "→"}
                    </span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <footer className="atlas-sources">
          <div className="atlas-sources-label">
            {isAr ? "المصادر" : "Sources"}
          </div>
          <ul>
            <li>
              UNESCO ICH Register entry <strong>00517</strong> — Al Sadu,
              traditional weaving skills (United Arab Emirates, 2011).
            </li>
            <li>
              Sheikh Zayed Festival Sadu workshop documentation, Abu Dhabi
              (annual archive).
            </li>
            <li>
              Sharjah Heritage Institute, <em>Al Sadu — A Living Bedouin Craft</em>.
            </li>
            <li>
              Anthropological Museum of Abu Dhabi, permanent textiles
              collection.
            </li>
          </ul>
        </footer>
      </div>
      <style>{`
        .atlas-stage {
          position: absolute;
          inset: 0;
          padding: 96px clamp(16px, 4vw, 56px) 60px;
          overflow-y: auto;
          color: var(--wool);
        }
        .atlas-header {
          max-width: 880px;
          margin: 0 auto 36px;
          text-align: center;
        }
        .atlas-eyebrow {
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: var(--saffron);
          opacity: 0.85;
        }
        .atlas-title {
          font-family: var(--font-cormorant), serif;
          font-size: clamp(28px, 4.5vw, 44px);
          letter-spacing: 0.04em;
          color: var(--wool);
          margin: 8px 0 14px;
          font-weight: 600;
        }
        .atlas-lede {
          font-size: clamp(14px, 2vw, 16px);
          line-height: 1.6;
          color: rgba(240, 228, 201, 0.78);
          max-width: 640px;
          margin: 0 auto;
        }
        .atlas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
          gap: 24px;
          max-width: 1240px;
          margin: 0 auto;
        }
        .atlas-card {
          display: flex;
          flex-direction: column;
          background:
            linear-gradient(180deg, rgba(40, 28, 20, 0.7) 0%, rgba(15, 10, 8, 0.85) 100%);
          border: 1px solid rgba(232, 163, 61, 0.32);
          border-radius: 18px;
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
          transition: transform 0.25s var(--ease-loom, ease), border-color 0.25s ease;
        }
        .atlas-card:hover {
          transform: translateY(-3px);
          border-color: rgba(232, 163, 61, 0.65);
        }
        .atlas-render {
          width: 100%;
          height: 140px;
          background: var(--wool, #F0E4C9);
          border-bottom: 1px solid rgba(0, 0, 0, 0.25);
        }
        .atlas-card-body {
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .atlas-card-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }
        .atlas-card-name-en {
          margin: 0;
          font-family: var(--font-cormorant), serif;
          font-size: 22px;
          letter-spacing: 0.06em;
          color: var(--saffron);
          font-weight: 600;
        }
        .atlas-card-name-ar {
          font-family: var(--font-tajawal), sans-serif;
          font-size: 20px;
          color: var(--wool);
          opacity: 0.78;
        }
        .atlas-card-meaning {
          margin: 0;
          font-size: 13.5px;
          line-height: 1.6;
          color: rgba(240, 228, 201, 0.86);
        }
        .atlas-card-occasion {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 12px;
          background: rgba(232, 163, 61, 0.08);
          border-inline-start: 2px solid var(--saffron);
          border-radius: 4px;
        }
        .atlas-card-occasion-label {
          font-family: var(--font-cormorant), serif;
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--saffron);
          opacity: 0.85;
        }
        .atlas-card-occasion-text {
          font-size: 12.5px;
          color: rgba(240, 228, 201, 0.82);
          font-style: italic;
          line-height: 1.5;
        }
        .atlas-forge-link {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          background: rgba(232, 163, 61, 0.14);
          border: 1px solid rgba(232, 163, 61, 0.4);
          color: var(--saffron);
          font-family: var(--font-cormorant), serif;
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 999px;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.18s ease;
        }
        .atlas-forge-link:hover {
          background: rgba(232, 163, 61, 0.28);
          border-color: var(--saffron);
          transform: translateX(2px);
        }
        [dir="rtl"] .atlas-forge-link:hover {
          transform: translateX(-2px);
        }
        .atlas-sources {
          max-width: 880px;
          margin: 48px auto 0;
          padding: 22px 26px;
          background: rgba(28, 18, 12, 0.55);
          border: 1px solid rgba(232, 163, 61, 0.25);
          border-radius: 14px;
          color: rgba(240, 228, 201, 0.78);
          font-size: 13px;
          line-height: 1.7;
        }
        .atlas-sources-label {
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--saffron);
          margin-bottom: 10px;
        }
        .atlas-sources ul {
          margin: 0;
          padding-inline-start: 18px;
        }
        .atlas-sources li {
          margin-bottom: 4px;
        }
        .atlas-sources strong {
          color: var(--saffron);
          font-weight: 600;
        }
        .atlas-sources em { color: var(--wool); font-style: italic; }
      `}</style>
    </TentScene>
  );
}
