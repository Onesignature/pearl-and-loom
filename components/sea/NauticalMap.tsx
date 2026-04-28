"use client";

import { useI18n } from "@/lib/i18n/provider";
import type { DiveDef } from "@/app/sea/page";

export function NauticalMap({ dives }: { dives: DiveDef[] }) {
  const { t, fmt } = useI18n();
  return (
    <div style={{ position: "relative", flex: 1, padding: "20px 0" }}>
      <div
        className="paper-aged"
        style={{
          padding: 28,
          height: "100%",
          border: "1px solid rgba(80,55,30,0.3)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "var(--ink-soft)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          {t("sea.pearlingBanks")}
        </div>
        <div
          className="font-display"
          style={{
            fontSize: 28,
            color: "var(--ink)",
            marginTop: 6,
            fontStyle: "italic",
          }}
        >
          {t("sea.location")}
        </div>
        <svg
          viewBox="0 0 600 380"
          style={{ width: "100%", height: "calc(100% - 80px)", marginTop: 14 }}
          className="ltr-internal"
        >
          <path
            d="M 0 60 Q 100 40 180 80 Q 260 50 360 70 Q 460 100 600 80 L 600 0 L 0 0 Z"
            fill="#E8C896"
            stroke="#8C5A2E"
            strokeWidth="1"
          />
          <text
            x="60"
            y="40"
            fill="#5A3618"
            fontSize="10"
            fontFamily="serif"
            letterSpacing="2"
          >
            {t("sea.abuDhabiCoast")}
          </text>
          <rect x="0" y="80" width="600" height="300" fill="#0E5E7B" opacity="0.18" />
          {[140, 200, 260, 320].map((y, i) => (
            <path
              key={y}
              d={`M 20 ${y} Q 200 ${y - 6} 380 ${y + 4} T 580 ${y}`}
              stroke="#0E5E7B"
              strokeWidth="0.6"
              fill="none"
              opacity={0.4 - i * 0.05}
              strokeDasharray="3 4"
            />
          ))}
          <g transform="translate(540 320)">
            <circle r="22" fill="none" stroke="#5A3618" strokeWidth="0.8" />
            <path d="M 0 -22 L 4 0 L 0 22 L -4 0 Z" fill="#8C2614" />
            <path d="M -22 0 L 0 -4 L 22 0 L 0 4 Z" fill="#5A3618" opacity="0.5" />
            <text x="0" y="-26" textAnchor="middle" fontSize="8" fill="#5A3618" fontFamily="serif">
              N
            </text>
          </g>
          {dives.map((d, i) => {
            const x = 80 + i * 105;
            const y = 130 + (i % 2) * 70 + i * 18;
            return (
              <g key={d.id}>
                <path
                  d={`M ${x} ${y} Q ${x - 30} ${(y + 80) / 2} ${x - 40} 80`}
                  stroke="#8C2614"
                  strokeWidth="0.8"
                  fill="none"
                  strokeDasharray="2 3"
                  opacity="0.6"
                />
                <g style={{ cursor: d.state === "available" ? "pointer" : "not-allowed" }}>
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill={d.state === "available" ? "#B5341E" : "#5A3618"}
                    opacity="0.85"
                  />
                  <circle cx={x} cy={y} r="8" fill="#F0E4C9" />
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="Cormorant Garamond, serif"
                    fontWeight="600"
                    fill="#8C2614"
                  >
                    {fmt(d.id)}
                  </text>
                  <text
                    x={x}
                    y={y + 28}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="serif"
                    fill="#5A3618"
                    letterSpacing="1"
                  >
                    {fmt(d.depth)}M
                  </text>
                  {d.state === "locked" && (
                    <text x={x} y={y - 18} textAnchor="middle" fontSize="11" fill="#5A3618">
                      🔒
                    </text>
                  )}
                </g>
              </g>
            );
          })}
          <text
            x="300"
            y="370"
            textAnchor="middle"
            fontSize="9"
            fill="#5A3618"
            fontFamily="serif"
            fontStyle="italic"
            letterSpacing="2"
          >
            {t("sea.fiveBanks")}
          </text>
        </svg>
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -10,
          insetInlineStart: -20,
          insetInlineEnd: -20,
          height: 24,
          background: "linear-gradient(to bottom, #6B4423, #4A2F18)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
}
