import { describe, it, expect } from "vitest";
import {
  buildLeaderboard,
  formatTime,
  SEED_ENTRIES,
} from "@/lib/leaderboard/seed";

const NOW = new Date("2026-04-29T05:00:00Z").getTime();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

describe("buildLeaderboard", () => {
  it("returns just the seed list when there is no learner profile yet", () => {
    const list = buildLeaderboard({
      learnerName: "",
      learnerAvatar: null,
      hikma: 0,
      trophies: 0,
      startedAt: null,
      completedAt: null,
      now: NOW,
    });
    expect(list).toHaveLength(SEED_ENTRIES.length);
    expect(list.find((e) => e.id === "you")).toBeUndefined();
  });

  it("inserts the current learner when a name is set", () => {
    const list = buildLeaderboard({
      learnerName: "Bilal",
      learnerAvatar: "pearl",
      hikma: 500,
      trophies: 6,
      startedAt: NOW - 2 * DAY,
      completedAt: null,
      now: NOW,
    });
    expect(list).toHaveLength(SEED_ENTRIES.length + 1);
    const you = list.find((e) => e.id === "you");
    expect(you).toBeDefined();
    expect(you?.name).toBe("Bilal");
    expect(you?.avatar).toBe("pearl");
    expect(you?.hikma).toBe(500);
    expect(you?.timeMs).toBe(2 * DAY);
    expect(you?.completed).toBe(false);
  });

  it("treats only the first word of the learner name as the display name", () => {
    const list = buildLeaderboard({
      learnerName: "Bilal Saeed Ahmed",
      learnerAvatar: "falcon",
      hikma: 100,
      trophies: 1,
      startedAt: null,
      completedAt: null,
      now: NOW,
    });
    expect(list.find((e) => e.id === "you")?.name).toBe("Bilal");
  });

  it("sorts by hikma descending", () => {
    const list = buildLeaderboard({
      learnerName: "Bilal",
      learnerAvatar: "pearl",
      hikma: 5000,
      trophies: 13,
      startedAt: NOW - 1 * DAY,
      completedAt: NOW,
      now: NOW,
    });
    expect(list[0].id).toBe("you");
    expect(list[0].hikma).toBe(5000);
  });

  it("breaks ties by completion status, then by shorter time", () => {
    const list = buildLeaderboard({
      // Match Mariam's 1180 exactly.
      learnerName: "Bilal",
      learnerAvatar: "pearl",
      hikma: 1180,
      trophies: 13,
      startedAt: NOW - 1 * DAY,
      completedAt: NOW,
      now: NOW,
    });
    // Bilal finished in 1 day. Mariam finished in 5d 3h. Bilal should rank
    // above Mariam at the same hikma score.
    const you = list.findIndex((e) => e.id === "you");
    const mariam = list.findIndex((e) => e.id === "seed-1");
    expect(you).toBeLessThan(mariam);
  });

  it("startedAt = null leaves timeMs null", () => {
    const list = buildLeaderboard({
      learnerName: "Bilal",
      learnerAvatar: "falcon",
      hikma: 0,
      trophies: 0,
      startedAt: null,
      completedAt: null,
      now: NOW,
    });
    expect(list.find((e) => e.id === "you")?.timeMs).toBeNull();
  });
});

describe("formatTime", () => {
  it("returns — for null", () => {
    expect(formatTime(null, "en")).toBe("—");
  });

  it("formats day-scale durations as Xd Yh", () => {
    expect(formatTime(2 * DAY + 4 * HOUR, "en")).toBe("2d 4h");
    expect(formatTime(2 * DAY + 4 * HOUR, "ar")).toBe("2ي 4س");
  });

  it("formats hour-scale durations as Xh Ym", () => {
    expect(formatTime(3 * HOUR + 22 * 60_000, "en")).toBe("3h 22m");
  });

  it("formats sub-hour durations in minutes (minimum 1m)", () => {
    expect(formatTime(15 * 60_000, "en")).toBe("15m");
    expect(formatTime(15_000, "en")).toBe("1m");
  });
});
