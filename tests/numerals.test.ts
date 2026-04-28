import { describe, it, expect } from "vitest";
import {
  toArabicIndic,
  fmtNumber,
  resolveNumeralMode,
} from "@/lib/i18n/numerals";

describe("toArabicIndic", () => {
  it("converts digits 0-9 to Arabic-Indic equivalents", () => {
    expect(toArabicIndic(0)).toBe("٠");
    expect(toArabicIndic(42)).toBe("٤٢");
    expect(toArabicIndic("1234567890")).toBe("١٢٣٤٥٦٧٨٩٠");
  });

  it("preserves non-digit characters", () => {
    expect(toArabicIndic("3/8")).toBe("٣/٨");
    expect(toArabicIndic("Lesson 1: 2+2")).toBe("Lesson ١: ٢+٢");
  });

  it("handles negatives, decimals, scientific notation", () => {
    expect(toArabicIndic(-7)).toBe("-٧");
    expect(toArabicIndic(3.14)).toBe("٣.١٤");
    expect(toArabicIndic("1.5e3")).toBe("١.٥e٣");
  });
});

describe("resolveNumeralMode", () => {
  it("auto returns arabic-indic for ar, western for en", () => {
    expect(resolveNumeralMode("auto", "en")).toBe("western");
    expect(resolveNumeralMode("auto", "ar")).toBe("arabic-indic");
  });

  it("explicit modes are preserved regardless of lang", () => {
    expect(resolveNumeralMode("western", "ar")).toBe("western");
    expect(resolveNumeralMode("arabic-indic", "en")).toBe("arabic-indic");
  });
});

describe("fmtNumber", () => {
  it("formats according to mode + lang", () => {
    expect(fmtNumber(42, "auto", "en")).toBe("42");
    expect(fmtNumber(42, "auto", "ar")).toBe("٤٢");
    expect(fmtNumber(42, "western", "ar")).toBe("42");
    expect(fmtNumber(42, "arabic-indic", "en")).toBe("٤٢");
  });
});
