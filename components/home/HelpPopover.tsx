"use client";

// Help popover — collapses the previously-separate "Walkthrough" and
// "How it works" buttons into a single ? control. Same dialogs open on
// click; only the chrome got quieter.

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { playCue } from "@/lib/audio/cues";

interface Props {
  onOpenWalkthrough: () => void;
  onOpenTutorial: () => void;
}

export function HelpPopover({ onOpenWalkthrough, onOpenTutorial }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          playCue("ui.tap");
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        className="hp-chip hp-chip--icon"
        title={t("settings.help")}
      >
        <span aria-hidden>?</span>
      </button>
      {open && (
        <div role="menu" className="hp-pop">
          <div className="hp-pop-eyebrow">{t("settings.help")}</div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onOpenWalkthrough();
            }}
            className="hp-pop-item hp-pop-item--accent"
          >
            <span aria-hidden style={{ marginInlineEnd: 8 }}>▶</span>
            {t("settings.helpWalkthrough")}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onOpenTutorial();
            }}
            className="hp-pop-item"
          >
            {t("settings.helpHowItWorks")}
          </button>
        </div>
      )}
    </div>
  );
}
