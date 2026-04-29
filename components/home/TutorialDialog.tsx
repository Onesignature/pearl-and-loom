"use client";

// "How it works" modal — surfaces the cultural thesis and quick-start
// instructions for first-time visitors. Reachable from the home navbar.

import { useI18n } from "@/lib/i18n/provider";
import { useSettings } from "@/lib/store/settings";
import { DialogBackdrop } from "@/components/ui/DialogBackdrop";

interface TutorialDialogProps {
  open: boolean;
  onClose: () => void;
  onOpenWalkthrough?: () => void;
}

export function TutorialDialog({
  open,
  onClose,
  onOpenWalkthrough,
}: TutorialDialogProps) {
  const { lang } = useI18n();
  const resetOnboarding = useSettings((s) => s.resetOnboarding);

  const items = lang === "en" ? FAQ_EN : FAQ_AR;
  const heading = lang === "en" ? "How it works" : "كيف يعمل";
  const close = lang === "en" ? "Close" : "إغلاق";

  return (
    <DialogBackdrop
      open={open}
      onClose={onClose}
      ariaLabel={heading}
      containerStyle={{ overflow: "hidden", padding: "clamp(16px, 4vw, 60px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="paper-bg tutorial-card"
        style={{
          width: "min(720px, 100%)",
          maxHeight: "min(82vh, 700px)",
          padding: "clamp(24px, 3vw, 40px)",
          position: "relative",
          overflowY: "scroll",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          animation: "slideUp 0.4s var(--ease-loom)",
        }}
      >
        <button
          onClick={onClose}
          aria-label={close}
          style={{
            position: "absolute",
            top: 14,
            insetInlineEnd: 14,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid rgba(80, 55, 30, 0.3)",
            background: "rgba(245, 235, 211, 0.5)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ink)",
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--madder)",
            marginBottom: 6,
            fontFamily: "var(--font-cormorant), serif",
          }}
        >
          {lang === "en" ? "Welcome" : "أهلاً بك"}
        </div>
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(28px, 3.6vw, 40px)",
            margin: 0,
            color: "var(--ink)",
            letterSpacing: "0.02em",
            fontStyle: lang === "en" ? "italic" : "normal",
            fontFamily:
              lang === "ar"
                ? "var(--font-tajawal), sans-serif"
                : "var(--font-cormorant), serif",
          }}
        >
          {heading}
        </h2>

        <div
          aria-hidden
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 14,
            marginBottom: 20,
            opacity: 0.6,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to right, transparent, var(--madder) 50%, transparent)",
            }}
          />
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M 5 0 L 10 5 L 5 10 L 0 5 Z" fill="var(--madder)" />
          </svg>
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(to right, transparent, var(--madder) 50%, transparent)",
            }}
          />
        </div>

        {/* Walkthrough CTA — opens the in-app modal with an embedded iframe */}
        <button
          onClick={() => onOpenWalkthrough?.()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 18px",
            marginBottom: 24,
            background:
              "linear-gradient(135deg, rgba(244, 184, 96, 0.22) 0%, rgba(181, 52, 30, 0.18) 100%)",
            border: "1px solid rgba(232, 163, 61, 0.6)",
            color: "var(--ink)",
            cursor: "pointer",
            width: "100%",
            textAlign: "start",
            fontFamily: "var(--font-tajawal), sans-serif",
            transition: "transform 0.2s var(--ease-loom), border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.borderColor = "var(--saffron)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "rgba(232, 163, 61, 0.6)";
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--saffron)",
              color: "var(--charcoal)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flex: "0 0 auto",
              boxShadow: "0 2px 10px rgba(232, 163, 61, 0.45)",
            }}
          >
            ▶
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="font-display"
              style={{
                fontSize: 17,
                color: "var(--ink)",
                letterSpacing: "0.04em",
                lineHeight: 1.1,
                marginBottom: 3,
              }}
            >
              {lang === "en"
                ? "Watch the walkthrough"
                : "شاهد العرض التوضيحي"}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--ink-soft)",
                lineHeight: 1.4,
              }}
            >
              {lang === "en"
                ? "A quick visual tour of every screen — Loom lessons, dive scene, pearl reveal, the heirloom braiding."
                : "جولة بصرية سريعة لكل الشاشات — دروس النَّول، الغوص، كشف اللؤلؤ، ضفر الإرث."}
            </div>
          </div>
          <div
            aria-hidden
            style={{
              color: "var(--madder)",
              fontSize: 18,
              flex: "0 0 auto",
              transform: lang === "ar" ? "scaleX(-1)" : "none",
            }}
          >
            →
          </div>
        </button>

        <button
          onClick={() => {
            resetOnboarding();
            onClose();
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            marginBottom: 22,
            background: "transparent",
            border: "1px dashed rgba(80, 55, 30, 0.5)",
            color: "var(--ink-soft)",
            cursor: "pointer",
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--saffron)";
            e.currentTarget.style.color = "var(--ink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(80, 55, 30, 0.5)";
            e.currentTarget.style.color = "var(--ink-soft)";
          }}
        >
          <span aria-hidden>↻</span>
          {lang === "en" ? "Replay welcome tour" : "أعد الجولة التعريفية"}
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {items.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>

        <div
          style={{
            marginTop: 28,
            padding: "14px 16px",
            background: "rgba(27,45,92,0.08)",
            borderInlineStart: "3px solid var(--indigo)",
            fontSize: 12,
            color: "var(--ink)",
            lineHeight: 1.6,
          }}
        >
          {lang === "en"
            ? "Cultural sources: UNESCO Intangible Cultural Heritage — Al Sadu (UAE 2011) and Gulf Pearling (2005). Motif geometry researched from museum collections in Sharjah, Doha, and Abu Dhabi."
            : "المصادر الثقافية: قوائم اليونسكو للتراث الثقافي غير المادي — السدو (الإمارات ٢٠١١) واللؤلؤ الخليجي (٢٠٠٥). الزخارف مستندة إلى مجموعات المتاحف في الشارقة والدوحة وأبوظبي."}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tutorial-card::-webkit-scrollbar {
          width: 10px;
        }
        .tutorial-card::-webkit-scrollbar-track {
          background: rgba(80, 55, 30, 0.08);
          margin: 8px 0;
        }
        .tutorial-card::-webkit-scrollbar-thumb {
          background: rgba(232, 163, 61, 0.45);
          border-radius: 5px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .tutorial-card::-webkit-scrollbar-thumb:hover {
          background: rgba(232, 163, 61, 0.7);
          background-clip: content-box;
        }
      `}</style>
    </DialogBackdrop>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <div
        className="font-display"
        style={{
          fontSize: 17,
          color: "var(--ink)",
          letterSpacing: "0.02em",
          marginBottom: 6,
        }}
      >
        {q}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "var(--ink-soft)",
          lineHeight: 1.65,
        }}
      >
        {a}
      </div>
    </div>
  );
}

const FAQ_EN = [
  {
    q: "What is The Pearl and the Loom?",
    a: "A bilingual Grade 4 / Grade 8 learning path set in 1940s pre-oil Abu Dhabi. The student plays two siblings in one family — Layla, who weaves Sadu math at the tent, and Saif, who dives for pearls at sea. Their crafts braid into one heirloom.",
  },
  {
    q: "How do I play?",
    a: "Pick Layla to enter the Loom and complete math lessons (symmetry, fractions, tessellation) — each lesson weaves a new row of the family tapestry. Pick Saif to enter the Sea, choose a dive stone, descend, and answer Grade 8 science questions to bank pearls. From Saif's chest, braid pearls back into Layla's tapestry to complete the heirloom.",
  },
  {
    q: "Why two characters?",
    a: "Pre-oil Gulf families ran a twin economy — men diving for pearls during the ghasa season, women weaving Sadu textiles in the tent. A family's wealth and identity sat at the junction of the two crafts. The math (symmetry, fractions, geometry) and science (buoyancy, pressure, marine biology) the children learn here are the literal mathematics those crafts required.",
  },
  {
    q: "Toggles in the corner?",
    a: "ع switches the entire interface to Arabic with full RTL flip and Tajawal typography. ١٢٣ switches numerals to Arabic-Indic — including inside math problems, so students can practice both numeral systems. Both settings persist across sessions.",
  },
  {
    q: "How long does a session take?",
    a: "A core lesson is 2–3 minutes; a dive is 60–90 seconds; the full vertical slice (3 lessons + 3 dives + the braiding cinematic) runs about 20 minutes. Locked stretch lessons hint at the full curriculum scope.",
  },
];

const FAQ_AR = [
  {
    q: "ما هو الَّلؤلؤة والنّول؟",
    a: "مسار تعلُّم ثنائي اللغة للصف الرابع والثامن، يقع في أبوظبي قبل اكتشاف النفط في أربعينيات القرن الماضي. يلعب الطالب دور شقيقين من عائلة واحدة — ليلى تنسج الرياضيات السدوية في الخيمة، وسيف يغوص للؤلؤ في البحر. تُضفر حِرفتاهما إرثًا واحدًا.",
  },
  {
    q: "كيف ألعب؟",
    a: "اختر ليلى لتدخل النَّول وتُكمل دروس الرياضيات (التناظر، الكسور، التبليط) — كل درس ينسج صفًّا جديدًا من نسيج العائلة. اختر سيف للدخول إلى البحر، واختر حجر الغوص، وانزل، وأجب عن أسئلة العلوم لجمع اللؤلؤ. من صندوق سيف، اضمّ اللؤلؤ إلى نسيج ليلى لإكمال الإرث.",
  },
  {
    q: "لماذا شخصيتان؟",
    a: "كانت عائلات الخليج قبل النفط تعيش اقتصادًا مزدوجًا — الرجال يغوصون للؤلؤ في موسم الغصة، والنساء ينسجن السدو في الخيمة. كانت ثروة العائلة وهويتها تقع في تقاطع الحرفتين. الرياضيات والعلوم التي يتعلمها الأطفال هنا هي الرياضيات التي كانت تتطلبها هاتان الحرفتان فعلاً.",
  },
  {
    q: "الأزرار في الزاوية؟",
    a: "ع يُحوِّل الواجهة بالكامل إلى العربية مع انعكاس RTL كامل وخط طجوال. ١٢٣ يُحوِّل الأرقام إلى الأرقام العربية الهندية — حتى داخل المسائل الرياضية، ليتدرب الطالب على النظامين. تبقى الإعدادات محفوظة بين الجلسات.",
  },
  {
    q: "كم تستغرق الجلسة؟",
    a: "الدرس الأساسي يستغرق ٢-٣ دقائق، والغوصة ٦٠-٩٠ ثانية، والشريحة الكاملة (٣ دروس + ٣ غوصات + مشهد الضفر) حوالي ٢٠ دقيقة. الدروس المتقدمة المقفلة تشير إلى نطاق المنهج الكامل.",
  },
];
