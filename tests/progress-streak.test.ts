import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { bumpStreak } from "@/lib/store/progress";

// `bumpStreak` reads the current calendar day from `new Date()`. Pin it.
const FROZEN = new Date("2026-04-29T12:00:00Z");
const yesterday = "2026-04-28";
const today = "2026-04-29";
const twoDaysAgo = "2026-04-27";
const distantPast = "2026-01-01";

describe("bumpStreak", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FROZEN);
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  it("returns 1 when there is no prior weave date", () => {
    expect(bumpStreak(0, null)).toBe(1);
    expect(bumpStreak(7, null)).toBe(1);
  });

  it("is a no-op on the same calendar day", () => {
    expect(bumpStreak(3, today)).toBe(3);
    expect(bumpStreak(0, today)).toBe(0);
  });

  it("increments by exactly one when the prior weave was yesterday", () => {
    expect(bumpStreak(3, yesterday)).toBe(4);
    expect(bumpStreak(0, yesterday)).toBe(1);
    expect(bumpStreak(7, yesterday)).toBe(8);
  });

  it("resets to 1 when there is a gap of two or more days", () => {
    expect(bumpStreak(5, twoDaysAgo)).toBe(1);
    expect(bumpStreak(99, distantPast)).toBe(1);
  });
});
