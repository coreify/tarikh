import { describe, expect, it } from "vitest";
import { parseDate } from "../src/core/parse";

describe("parseDate", () => {
  it("parses ISO string", () => {
    const result = parseDate("2026-03-31");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getMonth()).toBe(2);
    expect(result!.getDate()).toBe(31);
  });

  it("parses Date object", () => {
    const d = new Date(2026, 2, 31);
    const result = parseDate(d);
    expect(result).toBeInstanceOf(Date);
    expect(result!.getTime()).toBe(d.getTime());
    expect(result).not.toBe(d);
  });

  it("parses timestamp number", () => {
    const ts = new Date(2026, 2, 31).getTime();
    const result = parseDate(ts);
    expect(result).toBeInstanceOf(Date);
    expect(result!.getTime()).toBe(ts);
  });

  it("parses English 'DD Month YYYY' format", () => {
    const result = parseDate("31 March 2026");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getMonth()).toBe(2);
    expect(result!.getDate()).toBe(31);
  });

  it("parses English short month format", () => {
    const result = parseDate("31 Mar 2026");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getMonth()).toBe(2);
    expect(result!.getDate()).toBe(31);
  });

  it("parses Bangla-formatted Gregorian date", () => {
    const result = parseDate("৩১ মার্চ ২০২৬");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getMonth()).toBe(2);
    expect(result!.getDate()).toBe(31);
  });

  it("parses ISO datetime strings deterministically", () => {
    const result = parseDate("2026-03-31T15:30:00Z");
    expect(result).toBeInstanceOf(Date);
    expect(result!.toISOString()).toBe("2026-03-31T15:30:00.000Z");
  });

  it("parses ISO datetime strings with microsecond precision", () => {
    const result = parseDate("2026-03-31T15:30:00.123456Z");
    expect(result).toBeInstanceOf(Date);
    expect(result!.toISOString()).toBe("2026-03-31T15:30:00.123Z");
  });

  it("parses month-first Gregorian dates", () => {
    const result = parseDate("March 31, 2026");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getMonth()).toBe(2);
    expect(result!.getDate()).toBe(31);
  });

  it("parses hyphenated Gregorian dates", () => {
    const result = parseDate("31-Mar-2026");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getMonth()).toBe(2);
    expect(result!.getDate()).toBe(31);
  });

  it("parses slash-separated year-first Gregorian dates", () => {
    const result = parseDate("2026/03/31");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getMonth()).toBe(2);
    expect(result!.getDate()).toBe(31);
  });

  it("parses Bangla calendar date with English month names (Chaitra)", () => {
    const result = parseDate("17 Chaitra 1432", { calendar: "bangla" });
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getMonth()).toBe(2);
    expect(result!.getDate()).toBe(31);
  });

  it("still parses legacy English spellings (Choitro, Boishakh)", () => {
    expect(
      parseDate("17 Choitro 1432", { calendar: "bangla" })!.getDate()
    ).toBe(31);
    expect(
      parseDate("1 Boishakh 1433", { calendar: "bangla" })!.getDate()
    ).toBe(14);
  });

  it("parses more Bangla calendar aliases and punctuation", () => {
    expect(
      parseDate("1 Boisakh 1433", { calendar: "bangla" })!.getDate()
    ).toBe(14);
    expect(
      parseDate("১৭ চৈত্র, ১৪৩২", { calendar: "bangla" })!.getDate()
    ).toBe(31);
    expect(
      parseDate("১ অঘ্রাণ ১৪৩৩", { calendar: "bangla" })!.getMonth()
    ).toBe(10);
  });

  it("parses Bangla calendar date with Bangla month names", () => {
    const result = parseDate("১৭ চৈত্র ১৪৩২", { calendar: "bangla" });
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getMonth()).toBe(2);
    expect(result!.getDate()).toBe(31);
  });

  it("parses Bangla calendar date with localized ordinal day words", () => {
    const result = parseDate("১লা বৈশাখ ১৪৩৩", { calendar: "bangla" });
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getMonth()).toBe(3);
    expect(result!.getDate()).toBe(14);
  });

  it("parses Bangla calendar date with spoken day words", () => {
    const pohela = parseDate("পহেলা বৈশাখ ১৪৩৩", { calendar: "bangla" });
    expect(pohela).toBeInstanceOf(Date);
    expect(pohela!.getFullYear()).toBe(2026);
    expect(pohela!.getMonth()).toBe(3);
    expect(pohela!.getDate()).toBe(14);

    const poyla = parseDate("পয়লা বৈশাখ ১৪৩৩", { calendar: "bangla" });
    expect(poyla).toBeInstanceOf(Date);
    expect(poyla!.getFullYear()).toBe(2026);
    expect(poyla!.getMonth()).toBe(3);
    expect(poyla!.getDate()).toBe(14);

    const poylaNoNukta = parseDate("পয়লা বৈশাখ ১৪৩৩", {
      calendar: "bangla"
    });
    expect(poylaNoNukta).toBeInstanceOf(Date);
    expect(poylaNoNukta!.getFullYear()).toBe(2026);
    expect(poylaNoNukta!.getMonth()).toBe(3);
    expect(poylaNoNukta!.getDate()).toBe(14);
  });

  it("parses 1 Baishakh", () => {
    const result = parseDate("1 Baishakh 1433", { calendar: "bangla" });
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getMonth()).toBe(3);
    expect(result!.getDate()).toBe(14);
  });

  it("returns null for invalid Bangla calendar dates", () => {
    expect(parseDate("31 Poush 1432", { calendar: "bangla" })).toBeNull();
    expect(parseDate("31 Chaitra 1432", { calendar: "bangla" })).toBeNull();
  });

  it("returns null for invalid input", () => {
    expect(parseDate("not a date")).toBeNull();
    expect(parseDate("03/04/2026")).toBeNull();
  });

  it("returns null for invalid Date object", () => {
    expect(parseDate(new Date("invalid"))).toBeNull();
  });

  it("handles 2-digit year", () => {
    const result = parseDate("31 Mar 26");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2026);
  });

  it("parses Bangla short month names", () => {
    const result = parseDate("৩১ মার্চ ২০২৬");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getMonth()).toBe(2);
  });
});
