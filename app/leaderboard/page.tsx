"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useSettings } from "@/lib/store/settings";
import { useProgress } from "@/lib/store/progress";
import { TentScene } from "@/components/scenes/TentScene";
import { TopChrome } from "@/components/layout/TopChrome";
import { AvatarToken } from "@/components/onboarding/AvatarToken";
import { computeHikma } from "@/lib/hikma/points";
import { buildLeaderboard, formatTime } from "@/lib/leaderboard/seed";

export default function LeaderboardPage() {
  const router = useRouter();
  const { t, fmt, lang } = useI18n();
  const learnerName = useSettings((s) => s.learnerName);
  const learnerAvatar = useSettings((s) => s.learnerAvatar);

  const loomLessonsCompleted = useProgress((s) => s.loomLessonsCompleted);
  const pearls = useProgress((s) => s.pearls);
  const achievements = useProgress((s) => s.achievements);
  const streak = useProgress((s) => s.streak);
  const startedAt = useProgress((s) => s.startedAt);
  const completedAt = useProgress((s) => s.completedAt);
  // Snapshot "now" once on mount — the leaderboard's elapsed-time column
  // is approximate and doesn't need to tick per second.
  const [now] = useState(() => Date.now());

  const hikma = useMemo(
    () =>
      computeHikma({
        loomLessonsCompleted,
        pearls,
        achievements,
        streak,
      }),
    [loomLessonsCompleted, pearls, achievements, streak],
  );

  const entries = useMemo(
    () =>
      buildLeaderboard({
        learnerName,
        learnerAvatar,
        hikma,
        trophies: achievements.length,
        startedAt,
        completedAt,
        now,
      }),
    [
      learnerName,
      learnerAvatar,
      hikma,
      achievements.length,
      startedAt,
      completedAt,
      now,
    ],
  );

  return (
    <TentScene>
      <TopChrome
        onHome={() => router.push("/")}
        title={t("leaderboard.title")}
        subtitle={t("leaderboard.subtitle")}
      />
      <div className="lb-stage">
        <div className="lb-card">
          <div className="lb-head" role="row" aria-hidden>
            <span className="lb-head-cell lb-rank-col">{t("leaderboard.rank")}</span>
            <span className="lb-head-cell lb-name-col">{t("leaderboard.learner")}</span>
            <span className="lb-head-cell lb-points-col">{t("leaderboard.points")}</span>
            <span className="lb-head-cell lb-tro-col">🏆</span>
            <span className="lb-head-cell lb-time-col">{t("leaderboard.timeTaken")}</span>
          </div>
          {entries.map((e, i) => {
            const rank = i + 1;
            const isYou = e.id === "you";
            const isPodium = rank <= 3;
            return (
              <div
                key={e.id}
                role="row"
                className={`lb-row${isYou ? " is-you" : ""}${isPodium ? ` is-podium is-rank-${rank}` : ""}`}
                data-rank={rank}
              >
                <span className="lb-rank-col">
                  <RankBadge rank={rank} />
                </span>
                <span className="lb-name-col">
                  <AvatarToken avatar={e.avatar} size={isPodium ? 36 : 32} />
                  <span className="lb-name-text">
                    <span className="lb-name-name">{e.name}</span>
                    {isYou && (
                      <span className="lb-you-tag">{t("leaderboard.you")}</span>
                    )}
                  </span>
                </span>
                <span className="lb-meta">
                  <span className="lb-points-col" aria-label={t("leaderboard.points")}>
                    <span className="lb-spark" aria-hidden>✦</span>
                    {fmt(e.hikma)}
                  </span>
                  <span className="lb-tro-col" aria-label={t("leaderboard.trophies")}>
                    <span className="lb-tro-icon" aria-hidden>🏆</span>
                    {fmt(e.trophies)}
                  </span>
                  <span className="lb-time-col" aria-label={t("leaderboard.timeTaken")}>
                    {e.timeMs === null ? (
                      <span className="lb-progress">
                        {t("leaderboard.inProgress")}
                      </span>
                    ) : (
                      <>
                        <span className="lb-time-icon" aria-hidden>⏱</span>
                        {formatTime(e.timeMs, lang)}
                      </>
                    )}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .lb-stage {
          position: absolute;
          inset: 0;
          padding: 96px 18px 40px;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          justify-content: center;
        }
        .lb-card {
          width: min(860px, 100%);
          height: fit-content;
          padding: 32px clamp(16px, 3vw, 40px) 24px;
          background: linear-gradient(145deg, rgba(40,28,20,0.65) 0%, rgba(15,10,8,0.85) 100%);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(232,163,61,0.25);
          border-top: 1px solid rgba(232,163,61,0.45);
          border-radius: 32px;
          color: var(--wool);
          font-family: var(--font-tajawal), sans-serif;
          box-shadow:
            0 40px 100px rgba(0,0,0,0.65),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        /* Desktop / tablet — 5-column grid table. The .lb-meta wrapper
           collapses to display: contents so its three children act as
           direct grid cells. */
        .lb-head,
        .lb-row {
          display: grid;
          grid-template-columns: 60px 1.8fr 1fr 70px 1fr;
          gap: 16px;
          align-items: center;
          padding: 14px 18px;
        }
        .lb-head {
          padding: 10px 18px 16px;
          font-family: var(--font-cormorant), serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--saffron);
          opacity: 0.9;
          border-bottom: 1px solid rgba(240,228,201,0.1);
          margin-bottom: 12px;
        }
        .lb-row {
          margin-top: 10px;
          background: rgba(245,235,211,0.03);
          border: 1px solid rgba(240,228,201,0.08);
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .lb-row:hover {
          background: rgba(245,235,211,0.08);
          border-color: rgba(232,163,61,0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .lb-meta {
          display: contents;
        }

        /* Cell typography defaults */
        .lb-name-col,
        .lb-points-col,
        .lb-tro-col,
        .lb-time-col {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }
        .lb-rank-col { display: inline-flex; align-items: center; }
        .lb-name-text {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          min-width: 0;
        }
        .lb-name-name {
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-weight: 600;
          font-size: 19px;
          color: var(--wool);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lb-you-tag {
          font-family: var(--font-tajawal), sans-serif;
          font-style: normal;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--charcoal);
          background: var(--saffron);
          padding: 3px 8px;
          border-radius: 999px;
          font-weight: 600;
        }
        .lb-points-col {
          font-family: var(--font-cormorant), serif;
          font-size: 20px;
          color: var(--saffron);
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .lb-spark {
          opacity: 0.85;
          font-size: 14px;
          text-shadow: 0 0 6px rgba(232,163,61,0.5);
        }
        .lb-tro-col {
          font-family: var(--font-cormorant), serif;
          font-size: 16px;
          color: rgba(240,228,201,0.85);
        }
        .lb-tro-icon { font-size: 14px; }
        .lb-time-col {
          font-size: 13px;
          color: rgba(240,228,201,0.7);
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .lb-time-icon { opacity: 0.7; }
        .lb-progress {
          font-style: italic;
          color: rgba(240,228,201,0.45);
          font-size: 12px;
        }

        /* Highlighted states */
        .lb-row.is-you {
          background: linear-gradient(90deg, rgba(232,163,61,0.18) 0%, rgba(232,163,61,0.04) 100%);
          border-color: rgba(232,163,61,0.6);
          box-shadow: 0 0 24px rgba(232,163,61,0.15), inset 0 0 12px rgba(232,163,61,0.08);
        }
        .lb-row.is-you:hover {
          border-color: rgba(232,163,61,0.9);
          box-shadow: 0 6px 32px rgba(232,163,61,0.25), inset 0 0 16px rgba(232,163,61,0.12);
        }
        .lb-row.is-podium { border-width: 1.5px; }
        .lb-row.is-rank-1 {
          border-color: rgba(248,216,122,0.85);
          background: linear-gradient(90deg, rgba(248,216,122,0.18) 0%, rgba(20,12,8,0.4) 100%);
          box-shadow: 0 0 32px rgba(248,216,122,0.22);
        }
        .lb-row.is-rank-2 {
          border-color: rgba(220,220,230,0.65);
          background: linear-gradient(90deg, rgba(200,200,210,0.12) 0%, rgba(20,12,8,0.4) 100%);
        }
        .lb-row.is-rank-3 {
          border-color: rgba(225,168,124,0.65);
          background: linear-gradient(90deg, rgba(196,128,88,0.14) 0%, rgba(20,12,8,0.4) 100%);
        }

        /* MOBILE — two-row stacked layout. The .lb-meta wrapper switches
           from display:contents back to a flex row so points/trophies/time
           sit on a single line under the name. */
        @media (max-width: 640px) {
          .lb-head { display: none; }
          .lb-row {
            grid-template-columns: 52px 1fr;
            grid-template-areas:
              "rank name"
              "rank meta";
            row-gap: 6px;
            padding: 12px;
          }
          .lb-row .lb-rank-col { grid-area: rank; align-self: center; }
          .lb-row .lb-name-col { grid-area: name; }
          .lb-row .lb-meta {
            grid-area: meta;
            display: flex !important;
            align-items: center;
            gap: 14px;
            flex-wrap: wrap;
          }
          .lb-row .lb-points-col { font-size: 16px; }
          .lb-row .lb-tro-col { font-size: 14px; }
          .lb-row .lb-time-col { font-size: 12px; }
          .lb-name-name { font-size: 16px; }
        }
      `}</style>
    </TentScene>
  );
}

/** Podium pill for rank 1-3 (gold/silver/bronze with engraved medal),
 *  numbered pill for everyone else. Sized up at the top of the leaderboard
 *  so the visual hierarchy reads immediately. */
function RankBadge({ rank }: { rank: number }) {
  const isPodium = rank <= 3;
  return (
    <span
      className={`lb-rank-pill${isPodium ? " is-podium" : ""}`}
      data-rank={rank}
      aria-label={`Rank ${rank}`}
    >
      {rank === 1 ? (
        <span className="lb-medal" aria-hidden>🥇</span>
      ) : rank === 2 ? (
        <span className="lb-medal" aria-hidden>🥈</span>
      ) : rank === 3 ? (
        <span className="lb-medal" aria-hidden>🥉</span>
      ) : (
        <span className="lb-rank-num">{rank}</span>
      )}
      <style>{`
        .lb-rank-pill {
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(232,163,61,0.10);
          border: 1.5px solid rgba(232,163,61,0.32);
          border-radius: 50%;
          font-family: var(--font-cormorant), serif;
          font-size: 16px;
          font-weight: 600;
          color: var(--saffron);
          flex: 0 0 auto;
          transition: all 0.22s var(--ease-loom);
        }
        .lb-rank-pill.is-podium {
          width: 44px;
          height: 44px;
          font-size: 22px;
        }
        .lb-rank-pill[data-rank="1"] {
          background: linear-gradient(180deg, #F8D87A 0%, #C7891C 100%);
          border-color: #F4C783;
          color: #3a230d;
          box-shadow:
            0 0 18px rgba(232,163,61,0.55),
            inset 0 1px 0 rgba(255,238,210,0.7);
        }
        .lb-rank-pill[data-rank="2"] {
          background: linear-gradient(180deg, #E8E9EE 0%, #9097A4 100%);
          border-color: #DCDFE6;
          color: #2a2d33;
          box-shadow:
            0 0 14px rgba(200,210,230,0.42),
            inset 0 1px 0 rgba(255,255,255,0.6);
        }
        .lb-rank-pill[data-rank="3"] {
          background: linear-gradient(180deg, #E1A87C 0%, #8B5128 100%);
          border-color: #D69666;
          color: #3a200d;
          box-shadow:
            0 0 14px rgba(196,128,88,0.45),
            inset 0 1px 0 rgba(255,228,200,0.5);
        }
        .lb-medal {
          font-size: 22px;
          line-height: 1;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.35));
        }
        .lb-rank-num {
          line-height: 1;
        }
      `}</style>
    </span>
  );
}
