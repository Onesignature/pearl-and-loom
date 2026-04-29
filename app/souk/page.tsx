"use client";

// Souk al-Lulu (سوق اللؤلؤ) — pearl-merchant's bazaar where collected
// pearls become spendable currency. Three stalls, nine items; each item
// carries a real pearling-era cultural footnote.

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useProgress } from "@/lib/store/progress";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";
import {
  SOUK_CATALOG,
  STALLS,
  type SoukItem,
  type PearlCost,
} from "@/lib/souk/catalog";
import { playCue } from "@/lib/audio/cues";
import { PEARL_TIERS } from "@/lib/pearl/colors";
import { DialogBackdrop } from "@/components/ui/DialogBackdrop";

export default function SoukPage() {
  const router = useRouter();
  const { lang, fmt } = useI18n();
  const pearls = useProgress((s) => s.pearls);
  const unlockedItems = useProgress((s) => s.unlockedItems);
  const spendPearls = useProgress((s) => s.spendPearls);
  const [pending, setPending] = useState<SoukItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const wallet = useMemo(() => {
    const free = pearls.filter((p) => !p.wovenIntoTapestry);
    return {
      common: free.filter((p) => p.grade === "common").length,
      fine: free.filter((p) => p.grade === "fine").length,
      royal: free.filter((p) => p.grade === "royal").length,
    };
  }, [pearls]);

  const canAfford = (cost: PearlCost) =>
    (cost.common ?? 0) <= wallet.common &&
    (cost.fine ?? 0) <= wallet.fine &&
    (cost.royal ?? 0) <= wallet.royal;

  function confirmPurchase() {
    if (!pending) return;
    const ok = spendPearls(pending.id, pending.cost);
    if (ok) {
      playCue("souk.purchase");
      setFeedback(
        lang === "en"
          ? `Acquired: ${pending.nameEn}`
          : `حصلتَ على: ${pending.nameAr}`,
      );
      setTimeout(() => setFeedback(null), 3000);
    }
    setPending(null);
  }

  return (
    <TentScene>
      <TopChrome
        onHome={() => router.push("/")}
        title={lang === "en" ? "Souk al-Lulu" : "سوق اللؤلؤ"}
        subtitle={
          lang === "en"
            ? "PEARL MARKET · ABU DHABI 1948"
            : "سوق اللؤلؤ · أبو ظبي ١٩٤٨"
        }
      />
      <div className="souk-stage">
        <Wallet wallet={wallet} fmt={fmt} lang={lang} />

        {STALLS.map((stall) => (
          <section key={stall.id} className="souk-stall">
            <header className="souk-stall-head">
              <div className="souk-stall-title">
                {lang === "en" ? stall.titleEn : stall.titleAr}
              </div>
              <div className="souk-stall-sub">
                {lang === "en" ? stall.subEn : stall.subAr}
              </div>
            </header>
            <div className="souk-grid">
              {SOUK_CATALOG.filter((i) => i.stall === stall.id).map((item) => {
                const owned = unlockedItems.includes(item.id);
                const affordable = canAfford(item.cost);
                return (
                  <ItemCard
                    key={item.id}
                    item={item}
                    owned={owned}
                    affordable={affordable}
                    lang={lang}
                    onBuy={() => setPending(item)}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {pending && (
        <PurchaseDialog
          item={pending}
          wallet={wallet}
          canAfford={canAfford(pending.cost)}
          lang={lang}
          onConfirm={confirmPurchase}
          onCancel={() => setPending(null)}
        />
      )}

      {feedback && (
        <div className="souk-feedback" role="status" aria-live="polite">
          {feedback}
        </div>
      )}

      <style>{`
        .souk-stage {
          position: relative;
          width: 100%;
          min-height: 100dvh;
          padding: 96px clamp(16px, 3vw, 48px) 60px;
          color: var(--wool);
        }
        .souk-stall { max-width: 1080px; margin: 0 auto 30px; }
        .souk-stall-head {
          display: flex;
          align-items: baseline;
          gap: 14px;
          padding-bottom: 8px;
          margin-bottom: 14px;
          border-bottom: 1px solid rgba(232,163,61,0.22);
          position: relative;
        }
        .souk-stall-head::before {
          content: "◆";
          color: var(--saffron);
          font-size: 9px;
          opacity: 0.7;
          margin-inline-end: 2px;
          align-self: center;
          line-height: 1;
        }
        .souk-stall-title {
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-size: clamp(20px, 2vw, 26px);
          color: var(--wool);
          letter-spacing: 0.04em;
        }
        .souk-stall-sub {
          font-size: 11px;
          color: var(--saffron);
          letter-spacing: 0.32em;
          text-transform: uppercase;
          opacity: 0.78;
        }
        .souk-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }
        @media (max-width: 640px) {
          .souk-stage { padding-top: 132px !important; padding-bottom: 60px !important; padding-inline: 14px !important; }
          .souk-stall { margin-bottom: 18px !important; }
          .souk-stall-head { padding-bottom: 4px !important; margin-bottom: 8px !important; gap: 8px !important; border-bottom-color: rgba(232,163,61,0.16) !important; }
          .souk-stall-head::before { display: none; }
          .souk-stall-title { font-size: 17px !important; }
          .souk-stall-sub { display: none !important; }
          .souk-grid { display: flex !important; flex-direction: column !important; gap: 6px !important; }
        }
        .souk-feedback {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(232,163,61,0.95);
          color: var(--charcoal);
          padding: 12px 22px;
          font-family: var(--font-cormorant), serif;
          font-size: 14px;
          letter-spacing: 0.16em;
          z-index: 60;
          box-shadow: 0 12px 32px rgba(0,0,0,0.5);
          animation: soukFb 0.3s var(--ease-loom);
        }
        @keyframes soukFb {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </TentScene>
  );
}

function Wallet({
  wallet,
  fmt,
  lang,
}: {
  wallet: { common: number; fine: number; royal: number };
  fmt: (n: number) => string;
  lang: "en" | "ar";
}) {
  return (
    <div className="souk-wallet" aria-label={lang === "en" ? "Pearl wallet" : "محفظة اللؤلؤ"}>
      <div className="souk-wallet-label">
        {lang === "en" ? "Pearls in hand" : "اللؤلؤ في اليد"}
      </div>
      <div className="souk-wallet-counts">
        <PearlPip tier="common" count={fmt(wallet.common)} label={lang === "en" ? "Common" : "عادي"} />
        <PearlPip tier="fine"   count={fmt(wallet.fine)}   label={lang === "en" ? "Fine" : "نفيس"} />
        <PearlPip tier="royal"  count={fmt(wallet.royal)}  label={lang === "en" ? "Royal" : "ملكي"} />
      </div>
      <style>{`
        .souk-wallet {
          max-width: 1080px;
          margin: 0 auto 20px;
          padding: 10px 18px;
          background:
            linear-gradient(180deg, rgba(48,30,16,0.55) 0%, rgba(20,12,8,0.55) 100%);
          border: 1px solid rgba(232,163,61,0.28);
          border-radius: var(--radius-btn, 6px);
          box-shadow: inset 0 1px 0 rgba(245,235,211,0.05);
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .souk-wallet-label {
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-size: 12px;
          letter-spacing: 0.18em;
          color: var(--saffron);
          opacity: 0.82;
        }
        .souk-wallet-counts {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          align-items: center;
        }
        @media (max-width: 640px) {
          .souk-wallet { padding: 8px 12px; gap: 12px; margin-bottom: 16px; }
          .souk-wallet-label { display: none; }
          .souk-wallet-counts { gap: 14px; }
        }
      `}</style>
    </div>
  );
}

function PearlPip({
  tier,
  count,
  label,
}: {
  tier: "common" | "fine" | "royal";
  count: string;
  label: string;
}) {
  const colors = PEARL_TIERS[tier];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span
        aria-hidden
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 28%, #FFFFFF, ${colors.core} 22%, ${colors.mid} 70%)`,
          boxShadow: `0 0 12px ${colors.glow}`,
        }}
      />
      <span
        className="font-display"
        style={{ fontSize: 18, color: "var(--wool)", lineHeight: 1 }}
      >
        {count}
      </span>
      <span
        style={{
          fontSize: 10,
          color: "rgba(240,228,201,0.6)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </span>
  );
}

function ItemCard({
  item,
  owned,
  affordable,
  lang,
  onBuy,
}: {
  item: SoukItem;
  owned: boolean;
  affordable: boolean;
  lang: "en" | "ar";
  onBuy: () => void;
}) {
  return (
    <div className={`item-card${owned ? " owned" : ""}`}>
      <div className="item-head">
        <div className="item-seal" aria-hidden>{item.glyph}</div>
        <div className="item-head-text">
          <div className="item-name">
            {lang === "en" ? item.nameEn : item.nameAr}
          </div>
          <div className="item-effect">
            {lang === "en" ? item.effectEn : item.effectAr}
          </div>
        </div>
      </div>
      <div className="item-foot">
        <CostBadge cost={item.cost} lang={lang} />
        {owned ? (
          <span className="item-owned" aria-label={lang === "en" ? "Owned" : "مَملوك"}>
            <span aria-hidden style={{ marginInlineEnd: 5 }}>✓</span>
            {lang === "en" ? "Owned" : "مَملوك"}
          </span>
        ) : (
          <button
            className="item-buy"
            onClick={onBuy}
            disabled={!affordable}
            title={
              !affordable
                ? lang === "en"
                  ? "Not enough pearls"
                  : "اللؤلؤ غير كافٍ"
                : undefined
            }
          >
            {lang === "en" ? "Trade" : "مبادلة"}
          </button>
        )}
      </div>
      <style>{`
        .item-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 16px 16px 14px;
          background:
            linear-gradient(180deg, rgba(48,30,18,0.38) 0%, rgba(20,12,8,0.48) 100%);
          border: 1px solid rgba(232,163,61,0.18);
          border-radius: var(--radius-btn, 6px);
          color: var(--wool);
          box-shadow:
            inset 0 1px 0 rgba(245,235,211,0.05),
            0 2px 8px rgba(0,0,0,0.18);
          transition: background 0.25s var(--ease-loom), border-color 0.25s var(--ease-loom), transform 0.25s var(--ease-loom), box-shadow 0.25s var(--ease-loom);
        }
        .item-card:hover {
          transform: translateY(-2px);
          border-color: rgba(232,163,61,0.5);
          box-shadow:
            inset 0 1px 0 rgba(245,235,211,0.08),
            0 8px 22px rgba(0,0,0,0.30);
        }
        .item-card.owned {
          background:
            linear-gradient(180deg, rgba(232,163,61,0.14) 0%, rgba(232,163,61,0.04) 100%);
          border-color: rgba(232,163,61,0.5);
        }
        .item-head {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .item-seal {
          flex: 0 0 auto;
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: var(--saffron);
          line-height: 1;
          background:
            radial-gradient(circle at 32% 28%, rgba(232,163,61,0.22), rgba(232,163,61,0.05) 70%);
          border: 1px solid rgba(232,163,61,0.38);
          border-radius: 50%;
          box-shadow: inset 0 1px 0 rgba(245,235,211,0.10);
        }
        .item-head-text { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1; }
        .item-name {
          font-family: var(--font-cormorant), serif;
          font-size: 18px;
          color: var(--wool);
          letter-spacing: 0.04em;
          line-height: 1.2;
        }
        .item-effect {
          font-family: var(--font-tajawal), sans-serif;
          font-size: 12px;
          color: rgba(240,228,201,0.72);
          line-height: 1.4;
        }
        .item-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-top: auto;
          padding-top: 4px;
        }
        .item-buy {
          padding: 8px 16px;
          background:
            linear-gradient(180deg, var(--saffron-soft) 0%, var(--saffron) 100%);
          color: var(--charcoal);
          border: 1px solid var(--saffron);
          border-radius: var(--radius-btn, 6px);
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          box-shadow:
            inset 0 1px 0 rgba(255,238,210,0.55),
            0 3px 10px rgba(232,163,61,0.28);
          transition: background 0.2s var(--ease-loom), box-shadow 0.2s var(--ease-loom), transform 0.2s var(--ease-loom);
        }
        .item-buy:hover:not(:disabled) {
          background: linear-gradient(180deg, #F4C783 0%, var(--saffron-soft) 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,238,210,0.7),
            0 6px 18px rgba(232,163,61,0.4);
          transform: translateY(-1px);
        }
        .item-buy:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          background: rgba(232,163,61,0.4);
          box-shadow: none;
          transform: none;
        }
        .item-owned {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--saffron);
          padding: 7px 14px;
          border: 1px solid rgba(232,163,61,0.65);
          border-radius: var(--radius-btn, 6px);
          background: rgba(232,163,61,0.08);
        }
        @media (max-width: 640px) {
          .item-card {
            display: grid !important;
            grid-template-columns: auto 1fr auto;
            grid-template-rows: auto;
            align-items: center;
            gap: 12px !important;
            padding: 10px 12px !important;
            min-height: 56px;
          }
          .item-head { display: contents; }
          .item-seal {
            grid-column: 1; grid-row: 1;
            width: 30px; height: 30px; font-size: 16px;
          }
          .item-head-text {
            grid-column: 2; grid-row: 1;
            gap: 0 !important;
          }
          .item-name { font-size: 15px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .item-tag { display: none !important; }
          .item-effect { display: none !important; }
          .item-note { display: none !important; }
          .item-foot {
            grid-column: 3; grid-row: 1;
            margin-top: 0 !important;
            display: flex !important;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px !important;
          }
          .item-buy { padding: 6px 12px; font-size: 9px; letter-spacing: 0.22em; }
          .item-owned { padding: 5px 10px; font-size: 9px; letter-spacing: 0.22em; }
        }
      `}</style>
    </div>
  );
}

function CostBadge({ cost, lang }: { cost: PearlCost; lang: "en" | "ar" }) {
  const parts: { tier: "common" | "fine" | "royal"; n: number }[] = [];
  if (cost.royal) parts.push({ tier: "royal", n: cost.royal });
  if (cost.fine) parts.push({ tier: "fine", n: cost.fine });
  if (cost.common) parts.push({ tier: "common", n: cost.common });
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {parts.map((p, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <CostPip tier={p.tier} />
          <span
            className="font-display"
            style={{ fontSize: 13, color: "var(--wool)" }}
          >
            ×{p.n}
          </span>
        </span>
      ))}
      <span
        className="cost-label"
        style={{
          fontSize: 9,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(240,228,201,0.45)",
          marginInlineStart: 4,
        }}
      >
        {lang === "en" ? "pay in" : "ادفع بـ"}
      </span>
      <style>{`
        @media (max-width: 640px) {
          .cost-label { display: none !important; }
        }
      `}</style>
    </span>
  );
}

function CostPip({ tier }: { tier: "common" | "fine" | "royal" }) {
  const c = PEARL_TIERS[tier];
  return (
    <span
      aria-hidden
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: `radial-gradient(circle at 32% 28%, #FFFFFF, ${c.core} 22%, ${c.mid} 70%)`,
        display: "inline-block",
      }}
    />
  );
}

function PurchaseDialog({
  item,
  wallet,
  canAfford,
  lang,
  onConfirm,
  onCancel,
}: {
  item: SoukItem;
  wallet: { common: number; fine: number; royal: number };
  canAfford: boolean;
  lang: "en" | "ar";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <DialogBackdrop
      open
      onClose={onCancel}
      ariaLabel={lang === "en" ? "Confirm trade" : "تأكيد المبادلة"}
      blur={6}
      zIndex={90}
      containerStyle={{ padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(440px, 100%)",
          background: "linear-gradient(180deg, #1A1208 0%, #0A0807 100%)",
          border: "1px solid var(--saffron)",
          padding: 24,
          color: "var(--wool)",
          fontFamily: "var(--font-tajawal), sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "var(--saffron)",
            marginBottom: 8,
          }}
        >
          {lang === "en" ? "Confirm trade" : "تأكيد المبادلة"}
        </div>
        <div
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 22,
            color: "var(--wool)",
          }}
        >
          {lang === "en" ? item.nameEn : item.nameAr}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(240,228,201,0.7)",
            lineHeight: 1.5,
            marginTop: 12,
          }}
        >
          {lang === "en" ? item.noteEn : item.noteAr}
        </div>
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px dashed rgba(232,163,61,0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <CostBadge cost={item.cost} lang={lang} />
          <span style={{ fontSize: 11, color: "rgba(240,228,201,0.5)" }}>
            {lang === "en" ? "Wallet:" : "المحفظة:"}{" "}
            <span style={{ color: "var(--wool)" }}>
              {wallet.royal} / {wallet.fine} / {wallet.common}
            </span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "10px 22px",
              background: "transparent",
              border: "1px solid rgba(240,228,201,0.3)",
              color: "var(--wool)",
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 12,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {lang === "en" ? "Cancel" : "إلغاء"}
          </button>
          <button
            onClick={onConfirm}
            disabled={!canAfford}
            style={{
              padding: "10px 22px",
              background: canAfford ? "var(--saffron)" : "rgba(232,163,61,0.3)",
              border: "1px solid var(--saffron)",
              color: "var(--charcoal)",
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 12,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              cursor: canAfford ? "pointer" : "not-allowed",
              fontWeight: 600,
            }}
          >
            {lang === "en" ? "Trade" : "بادل"}
          </button>
        </div>
      </div>
    </DialogBackdrop>
  );
}
