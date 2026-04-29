import { describe, it, expect } from "vitest";
import { buildTapestryPng } from "@/lib/tapestry/exportPng";

// jsdom does not implement HTMLCanvasElement.getContext('2d') unless the
// `canvas` package is installed. Detect that and skip the smoke test
// without failing CI.
const canvasSupported = (() => {
  try {
    const c = document.createElement("canvas");
    return c.getContext("2d") != null;
  } catch {
    return false;
  }
})();

describe("buildTapestryPng (smoke)", () => {
  it.skipIf(!canvasSupported)("returns a PNG Blob", async () => {
    const blob = await buildTapestryPng({
      rowsWoven: 12,
      streak: 3,
      pearlsCollected: 5,
      lang: "en",
    });
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("image/png");
    expect(blob.size).toBeGreaterThan(0);
  });

  it.skipIf(!canvasSupported)("renders the AR variant without throwing", async () => {
    const blob = await buildTapestryPng({
      rowsWoven: 25,
      streak: 7,
      pearlsCollected: 12,
      lang: "ar",
    });
    expect(blob).toBeInstanceOf(Blob);
  });

  it("rejects gracefully when canvas is unavailable", async () => {
    if (canvasSupported) return;
    await expect(
      buildTapestryPng({
        rowsWoven: 0,
        streak: 0,
        pearlsCollected: 0,
        lang: "en",
      }),
    ).rejects.toThrow();
  });
});
