"use client";

// TitleReveal — animates a heading letter-by-letter with a stagger.
// Used for big-moment titles (splash, lesson openings, dive openings)
// where the page wants to read as cinematic. Reduced-motion: collapses
// to instant render with no animation.
//
// Splits the input into characters but keeps spaces as zero-stagger
// units so words don't visually break apart on slow staggers.

import { motion, useReducedMotion } from "framer-motion";
import { createElement, type CSSProperties } from "react";

type TitleTag = "span" | "h1" | "h2" | "h3" | "div";

interface Props {
  text: string;
  /** Per-character delay in seconds. Default 0.03 (≈30ms). */
  stagger?: number;
  /** Initial render delay before the first character animates. */
  delay?: number;
  /** Inline style on the wrapper. */
  style?: CSSProperties;
  className?: string;
  /** When true, the parent wraps the title; pass false to make it inline. */
  block?: boolean;
  /** Tag override — defaults to span; use h1/h2/etc. for semantic correctness. */
  as?: TitleTag;
  /** Optional aria-label override (defaults to the full text). */
  ariaLabel?: string;
}

export function TitleReveal({
  text,
  stagger = 0.03,
  delay = 0,
  style,
  className,
  block = true,
  as = "span",
  ariaLabel,
}: Props) {
  const reduce = useReducedMotion();
  const wrapperStyle: CSSProperties = {
    display: block ? "block" : "inline-block",
    ...style,
  };
  const wrapperProps = {
    className,
    style: wrapperStyle,
    "aria-label": ariaLabel ?? text,
  };

  // Reduced-motion path: render the string as plain text. Skip the per-
  // character split entirely so screen readers don't get confused and
  // the DOM stays cheap.
  if (reduce) {
    return createElement(as, wrapperProps, text);
  }

  const chars = Array.from(text);

  return createElement(
    as,
    wrapperProps,
    <span aria-hidden style={{ display: "inline-block" }}>
      {chars.map((ch, i) => {
        const isSpace = ch === " ";
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: delay + i * stagger,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              display: "inline-block",
              whiteSpace: isSpace ? "pre" : "normal",
            }}
          >
            {isSpace ? " " : ch}
          </motion.span>
        );
      })}
    </span>,
  );
}
