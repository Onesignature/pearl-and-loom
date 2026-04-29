"use client";

// Tiny inline SVG tokens used for learner avatars + the ProfileChip.
// Authored as pure SVG so they scale to any size, render in either
// palette, and add zero asset bytes.

import type { LearnerAvatar } from "@/lib/store/settings";

interface Props {
  avatar: LearnerAvatar;
  size?: number;
  /** Token outline + glyph color. Defaults to saffron. */
  tone?: string;
}

export function AvatarToken({ avatar, size = 36, tone = "var(--saffron)" }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role="img"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <circle cx="24" cy="24" r="22" fill="rgba(20,12,8,0.65)" stroke={tone} strokeWidth="1.4" />
      {avatar === "falcon" && (
        // Stylised falcon — the UAE's national bird. Diamond head + chevron wings.
        <g fill="none" stroke={tone} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 14 L29 22 L24 26 L19 22 Z" />
          <path d="M14 22 Q19 18 24 22 Q29 18 34 22" />
          <path d="M14 28 Q19 32 24 30 Q29 32 34 28" />
          <circle cx="24" cy="20" r="0.9" fill={tone} stroke="none" />
        </g>
      )}
      {avatar === "dhow" && (
        // Lateen-rigged pearling dhow on a wave line.
        <g fill="none" stroke={tone} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 30 Q24 33 34 30" />
          <path d="M16 30 L32 30 L29 34 L19 34 Z" />
          <path d="M24 30 L24 14 L33 28 Z" fill={tone} fillOpacity="0.18" />
          <path d="M14 36 Q19 38 24 36 T34 36" />
        </g>
      )}
      {avatar === "pearl" && (
        // Pearl in an oyster — the heart of the heirloom.
        <g fill="none" stroke={tone} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 28 Q24 22 34 28 Q24 36 14 28 Z" />
          <circle cx="24" cy="26" r="3.6" fill={tone} fillOpacity="0.28" />
          <circle cx="22.6" cy="24.8" r="1" fill="rgba(245,235,211,0.85)" stroke="none" />
        </g>
      )}
      {avatar === "palm" && (
        // Date palm — the "tree of life" of the Gulf.
        <g fill="none" stroke={tone} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 20 L24 36" />
          <path d="M24 20 Q18 15 14 17" />
          <path d="M24 20 Q30 15 34 17" />
          <path d="M24 20 Q19 13 21 10" />
          <path d="M24 20 Q29 13 27 10" />
          <path d="M24 20 Q24 14 24 12" />
          <circle cx="22" cy="22" r="0.9" fill={tone} stroke="none" />
          <circle cx="26" cy="22.5" r="0.9" fill={tone} stroke="none" />
        </g>
      )}
    </svg>
  );
}
