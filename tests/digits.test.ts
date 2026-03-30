import { describe, expect, it } from "vitest";
import { toBanglaDigits, toEnglishDigits } from "../src/core/digits";

describe("toBanglaDigits", () => {
  it("converts all digits", () => {
    expect(toBanglaDigits("0123456789")).toBe("০১২৩৪৫৬৭৮৯");
  });

  it("converts numbers", () => {
    expect(toBanglaDigits(2026)).toBe("২০২৬");
  });

  it("converts digits within text", () => {
    expect(toBanglaDigits("31 March 2026")).toBe("৩১ March ২০২৬");
  });

  it("leaves non-digit characters untouched", () => {
    expect(toBanglaDigits("hello")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(toBanglaDigits("")).toBe("");
  });

  it("converts zero", () => {
    expect(toBanglaDigits(0)).toBe("০");
  });
});

describe("toEnglishDigits", () => {
  it("converts all Bangla digits", () => {
    expect(toEnglishDigits("০১২৩৪৫৬৭৮৯")).toBe("0123456789");
  });

  it("converts digits within Bangla text", () => {
    expect(toEnglishDigits("৩১ মার্চ ২০২৬")).toBe("31 মার্চ 2026");
  });

  it("leaves non-Bangla-digit characters untouched", () => {
    expect(toEnglishDigits("hello")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(toEnglishDigits("")).toBe("");
  });

  it("round-trips with toBanglaDigits", () => {
    const original = "31 March 2026";
    expect(toEnglishDigits(toBanglaDigits(original))).toBe(original);
  });
});
