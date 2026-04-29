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
        .souk-stall { max-width: 1080px; margin: 0 auto 36px; }
        .souk-stall-head {
          display: flex;
          align-items: baseline;
          gap: 16px;
          padding-bottom: 10px;
          margin-bottom: 14px;
          border-bottom: 1px solid rgba(232,163,61,0.25);
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
          opacity: 0.8;
        }
        .souk-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
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
          margin: 0 auto 22px;
          padding: 14px 18px;
          background: linear-gradient(135deg, rgba(28,18,12,0.85), rgba(48,30,16,0.7));
          border: 1px solid rgba(232,163,61,0.3);
          display: flex;
          align-items: center;
          gap: 22px;
          flex-wrap: wrap;
        }
        .souk-wallet-label {
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: var(--saffron);
          opacity: 0.8;
        }
        .souk-wallet-counts {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
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
      <div className="item-glyph" aria-hidden>{item.glyph}</div>
      <div className="item-name">
        {lang === "en" ? item.nameEn : item.nameAr}
      </div>
      <div className="item-tag">
        {lang === "en" ? item.taglineEn : item.taglineAr}
      </div>
      <div className="item-effect">
        <span aria-hidden style={{ marginInlineEnd: 6 }}>⚡</span>
        {lang === "en" ? item.effectEn : item.effectAr}
      </div>
      <div className="item-note">
        {lang === "en" ? item.noteEn : item.noteAr}
      </div>
      <div className="item-foot">
        <CostBadge cost={item.cost} lang={lang} />
        {owned ? (
          <span className="item-owned">{lang === "en" ? "Owned" : "مَملوك"}</span>
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
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px 16px 14px;
          background: rgba(245,235,211,0.04);
          border: 1px solid rgba(232,163,61,0.22);
          color: var(--wool);
          min-height: 220px;
          transition: background 0.25s, border-color 0.25s, transform 0.25s;
        }
        .item-card:hover { transform: translateY(-2px); border-color: rgba(232,163,61,0.5); }
        .item-card.owned { background: rgba(232,163,61,0.10); border-color: rgba(232,163,61,0.65); }
        .item-glyph {
          font-size: 24px;
          color: var(--saffron);
          line-height: 1;
        }
        .item-name {
          font-family: var(--font-cormorant), serif;
          font-size: 17px;
          color: var(--wool);
          letter-spacing: 0.04em;
        }
        .item-tag {
          font-size: 10px;
          color: var(--saffron);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          opacity: 0.85;
        }
        .item-effect {
          margin-top: 4px;
          padding: 6px 10px;
          background: rgba(232,163,61,0.14);
          border: 1px solid rgba(232,163,61,0.45);
          font-family: var(--font-tajawal), sans-serif;
          font-size: 11.5px;
          color: var(--saffron-soft);
          line-height: 1.45;
          letter-spacing: 0.01em;
        }
        .item-note {
          font-size: 12px;
          color: rgba(240,228,201,0.7);
          line-height: 1.5;
          flex: 1;
          margin-top: 4px;
        }
        .item-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px dashed rgba(232,163,61,0.25);
        }
        .item-buy {
          padding: 7px 16px;
          background: var(--saffron);
          color: var(--charcoal);
          border: 1px solid var(--saffron);
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
        }
        .item-buy:hover:not(:disabled) { background: var(--saffron-soft); }
        .item-buy:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          background: rgba(232,163,61,0.4);
        }
        .item-owned {
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--saffron);
          padding: 7px 16px;
          border: 1px solid var(--saffron);
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
