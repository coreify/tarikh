import { describe, expect, it } from "vitest";
import {
  fromBanglaCalendar,
  toBanglaCalendar
} from "../src/core/calendar";

describe("toBanglaCalendar", () => {
  it("defaults to English month names (Latin script)", () => {
    const result = toBanglaCalendar("2026-03-31");
    expect(result).toEqual({
      day: 17,
      month: "Chaitra",
      monthIndex: 12,
      year: 1432
    });
  });

  it("uses Bangla month names when locale is bn-BD", () => {
    const result = toBanglaCalendar("2026-03-31", { locale: "bn-BD" });
    expect(result).toEqual({
      day: "১৭",
      month: "চৈত্র",
      monthIndex: 12,
      year: "১৪৩২"
    });
  });

  it("converts Pohela Baishakh (April 14) correctly", () => {
    const result = toBanglaCalendar("2026-04-14");
    expect(result).toEqual({
      day: 1,
      month: "Baishakh",
      monthIndex: 1,
      year: 1433
    });
  });

  it("converts April 13 to last day of previous Bengali year", () => {
    const result = toBanglaCalendar("2026-04-13");
    expect(result.month).toBe("Chaitra");
    expect(result.year).toBe(1432);
    expect(result.monthIndex).toBe(12);
  });

  it("converts a mid-year date correctly", () => {
    const result = toBanglaCalendar("2026-07-15");
    expect(result.month).toBe("Asharh");
    expect(result.monthIndex).toBe(3);
    expect(result.day).toBe(31);
    expect(result.year).toBe(1433);
  });

  it("handles leap year correctly", () => {
    const result = toBanglaCalendar("2024-03-14");
    expect(result.month).toBe("Falgun");
    expect(result.day).toBe(31);
    expect(result.year).toBe(1430);
  });

  it("handles non-leap year Falgun (30 days)", () => {
    const result = toBanglaCalendar("2026-03-14");
    expect(result.month).toBe("Falgun");
    expect(result.day).toBe(30);
    expect(result.year).toBe(1432);
  });

  it("converts January 1 correctly (mid-Bengali-year)", () => {
    const result = toBanglaCalendar("2026-01-01");
    expect(result.year).toBe(1432);
    expect(result.month).toBe("Poush");
  });

  it("accepts Date object", () => {
    const result = toBanglaCalendar(new Date(2026, 2, 31));
    expect(result.day).toBe(17);
    expect(result.month).toBe("Chaitra");
  });

  it("accepts timestamp number", () => {
    const ts = new Date(2026, 3, 14).getTime();
    const result = toBanglaCalendar(ts);
    expect(result.day).toBe(1);
    expect(result.month).toBe("Baishakh");
    expect(result.year).toBe(1433);
  });
});

describe("fromBanglaCalendar", () => {
  it("converts 1 Baishakh 1433 back to April 14, 2026", () => {
    const date = fromBanglaCalendar(1, 1, 1433);
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(3); // April
    expect(date.getDate()).toBe(14);
  });

  it("converts 17 Chaitra 1432 back to March 31, 2026", () => {
    const date = fromBanglaCalendar(17, 12, 1432);
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(2); // March
    expect(date.getDate()).toBe(31);
  });

  it("round-trips with toBanglaCalendar", () => {
    const original = new Date(2025, 6, 20); // July 20, 2025
    const bangla = toBanglaCalendar(original);
    const back = fromBanglaCalendar(bangla.day, bangla.monthIndex, bangla.year);
    expect(back.getFullYear()).toBe(original.getFullYear());
    expect(back.getMonth()).toBe(original.getMonth());
    expect(back.getDate()).toBe(original.getDate());
  });

  it("handles leap year Falgun reverse conversion", () => {
    const date = fromBanglaCalendar(31, 11, 1430);
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(2); // March
    expect(date.getDate()).toBe(14);
  });

  it("rejects invalid Bangla dates", () => {
    expect(() => fromBanglaCalendar(31, 9, 1432)).toThrow(
      "Invalid Bangla calendar day"
    );
    expect(() => fromBanglaCalendar(0, 1, 1433)).toThrow(
      "Invalid Bangla calendar day"
    );
    expect(() => fromBanglaCalendar(1, 13, 1433)).toThrow(
      "Invalid Bangla calendar month index"
    );
  });
});
