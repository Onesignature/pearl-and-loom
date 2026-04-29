"use client";

// Walkthrough modal — embeds the inline Claude Design "demo film" HTML in
// an iframe. The inline HTML is a same-origin React app with its own play /
// pause / seek / restart controls and a built-in Space-key handler. Two
// things we do at the parent level:
//
//   1. Auto-trigger playback after the iframe loads — synthesises a click
//      on the internal play button inside the inline HTML's user-gesture
//      window so audio is allowed to start without a second click.
//
//   2. Route Space key presses from the parent window down into the iframe
//      so the demo's own play/pause toggle fires regardless of whether the
//      iframe has focus.
//
// We do NOT set `pointer-events: none` on the iframe — the demo needs its
// own pointer events to function (initial click, seek, audio toggle).

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { DialogBackdrop } from "@/components/ui/DialogBackdrop";

const WALKTHROUGH_PATH = "/Pearl-and-Loom-inline.html";

interface WalkthroughDialogProps {
  onClose: () => void;
}

export function WalkthroughDialog({ onClose }: WalkthroughDialogProps) {
  const { lang } = useI18n();
  const [started, setStarted] = useState(false);
  // Increments on every (re)start so the iframe gets a fresh `key` and
  // unmount/remount cycle drives the demo back to the first frame.
  const [runId, setRunId] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Dispatch the Space key into the iframe so the demo's own play/pause
  // handler fires. Same-origin so this is permitted.
  function dispatchSpaceIntoIframe() {
    const w = iframeRef.current?.contentWindow;
    if (!w) return;
    try {
      w.dispatchEvent(
        new KeyboardEvent("keydown", { code: "Space", key: " ", bubbles: true }),
      );
    } catch {
      /* swallow — cross-origin guard, shouldn't happen for same-origin */
    }
  }

  // Escape + body-scroll-lock are owned by <DialogBackdrop>. Here we only
  // catch Space (passed through to the iframe's own play/pause handler).
  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        dispatchSpaceIntoIframe();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started]);

  // After each iframe mount, wait for load, then synthesise a click on
  // the internal play button so playback starts from the beginning without
  // the user needing a second click. We're inside the user-gesture window
  // from the original PlayOverlay click, so audio is allowed to start.
  useEffect(() => {
    if (!started || !iframeRef.current) return;
    const iframe = iframeRef.current;
    let cancelled = false;

    const tryAutoStart = () => {
      if (cancelled) return;
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        // Inline HTML's play button has title="Play/pause (space)".
        const btn = doc.querySelector(
          'button[title*="Play/pause"]',
        ) as HTMLButtonElement | null;
        if (btn) {
          btn.click();
        }
      } catch {
        /* swallow */
      }
    };

    // Two-stage start: most demos finish their React mount in <300 ms but
    // some take longer; try once early and once later as insurance.
    const t1 = window.setTimeout(tryAutoStart, 350);
    const t2 = window.setTimeout(tryAutoStart, 900);

    return () => {
      cancelled = true;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [started, runId]);

  const heading = lang === "en" ? "Walkthrough" : "العرض التوضيحي";
  const close = lang === "en" ? "Close" : "إغلاق";

  return (
    <DialogBackdrop
      open
      onClose={onClose}
      ariaLabel={heading}
      backdropOpacity={0.86}
      containerStyle={{
        flexDirection: "column",
        gap: 12,
        padding: "clamp(20px, 4vw, 60px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "min(1200px, 100%)",
        }}
      >
        <div
          className="font-display"
          style={{
            color: "var(--saffron)",
            fontSize: 13,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
          }}
        >
          {heading}
        </div>
        {started && (
          <div
            style={{
              fontSize: 11,
              color: "rgba(240,228,201,0.6)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily: "var(--font-cormorant), serif",
            }}
          >
            {lang === "en" ? "Space to play / pause" : "مسافة للتشغيل والإيقاف"}
          </div>
        )}
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              "linear-gradient(to right, rgba(232,163,61,0.5), transparent)",
          }}
        />
        {started && (
          <button
            onClick={() => setRunId((r) => r + 1)}
            title={lang === "en" ? "Restart from beginning" : "ابدأ من البداية"}
            style={{
              height: 36,
              padding: "0 12px",
              borderRadius: 18,
              border: "1px solid rgba(240,228,201,0.3)",
              background: "rgba(245,235,211,0.06)",
              color: "var(--wool)",
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "var(--font-cormorant), serif",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ↻ <span>{lang === "en" ? "Restart" : "إعادة"}</span>
          </button>
        )}
        <button
          onClick={onClose}
          aria-label={close}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid rgba(240,228,201,0.3)",
            background: "rgba(245,235,211,0.06)",
            color: "var(--wool)",
            cursor: "pointer",
            fontSize: 16,
            lineHeight: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1200px, 100%)",
          flex: 1,
          maxHeight: "min(82vh, 800px)",
          background: "#0a0807",
          border: "1px solid rgba(232,163,61,0.3)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
          overflow: "hidden",
          position: "relative",
          animation: "slideUp 0.4s var(--ease-loom)",
        }}
      >
        {!started ? (
          <PlayOverlay
            onPlay={() => {
              setStarted(true);
              setRunId((r) => r + 1);
            }}
            lang={lang}
          />
        ) : (
          <iframe
            ref={iframeRef}
            // Bumping runId remounts the iframe → demo restarts from frame 0.
            key={`frame-${runId}`}
            src={WALKTHROUGH_PATH}
            title={heading}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
              background: "#08070a",
            }}
            allow="autoplay; fullscreen; encrypted-media; clipboard-write"
          />
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </DialogBackdrop>
  );
}

function PlayOverlay({
  onPlay,
  lang,
}: {
  onPlay: () => void;
  lang: "en" | "ar";
}) {
  return (
    <button
      onClick={onPlay}
      style={{
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse 60% 70% at 50% 50%, #3a2a1f 0%, #0a0807 100%)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        color: "var(--wool)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(244,184,96,0.32) 0%, rgba(232,163,61,0.08) 40%, transparent 70%)",
          animation: "pearlGlow 4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "var(--saffron)",
          color: "var(--charcoal)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          paddingInlineStart: 6,
          boxShadow:
            "0 10px 40px rgba(232,163,61,0.5), inset 0 -6px 12px rgba(0,0,0,0.18)",
          position: "relative",
        }}
      >
        ▶
      </div>
      <div style={{ position: "relative", textAlign: "center", maxWidth: 480 }}>
        <div
          className="font-display"
          style={{
            fontSize: 28,
            color: "var(--wool)",
            letterSpacing: "0.04em",
            fontStyle: lang === "en" ? "italic" : "normal",
            fontFamily:
              lang === "ar"
                ? "var(--font-tajawal), sans-serif"
                : "var(--font-cormorant), serif",
          }}
        >
          {lang === "en" ? "Press play to begin" : "اضغط للتشغيل"}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "rgba(240,228,201,0.6)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          {lang === "en"
            ? "90-second visual tour · with sound · Space to pause"
            : "جولة ٩٠ ثانية · مع الصوت · مسافة للإيقاف"}
        </div>
      </div>
    </button>
  );
}
