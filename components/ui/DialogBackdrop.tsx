"use client";

// Shared modal backdrop. Owns: position-fixed full-viewport overlay,
// `role="dialog"` + `aria-modal` semantics, body-scroll lock, Escape-to-close
// keydown listener, click-outside-to-close (only the outermost element
// triggers `onClose`; children stop propagation themselves). Used by every
// modal in the app — Walkthrough, Tutorial, Souk Purchase confirmation.

import { useEffect, type CSSProperties, type ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  /** Override the default 0.78 black tint. */
  backdropOpacity?: number;
  /** Override the default 8 px backdrop blur. */
  blur?: number;
  /** Stack-order — defaults to 9999 to sit above everything. */
  zIndex?: number;
  /** Style overrides for the outer flex container (e.g. alignItems). */
  containerStyle?: CSSProperties;
  children: ReactNode;
}

export function DialogBackdrop({
  open,
  onClose,
  ariaLabel,
  backdropOpacity = 0.78,
  blur = 8,
  zIndex = 9999,
  containerStyle,
  children,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        pointerEvents: "auto",
        background: `rgba(8, 5, 3, ${backdropOpacity})`,
        backdropFilter: `blur(${blur}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(20px, 4vw, 60px)",
        animation: "dlgBackdropFadeIn 0.3s var(--ease-loom)",
        ...containerStyle,
      }}
    >
      {children}
      <style>{`
        @keyframes dlgBackdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
