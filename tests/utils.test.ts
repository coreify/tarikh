import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addDays,
  addMonths,
  addYears,
  endOfDay,
  endOfMonth,
  endOfYear,
  getBanglaMonth,
  isToday,
  isTomorrow,
  isYesterday,
  startOfMonth,
  startOfYear,
  startOfDay,
  subMonths,
  subYears,
  subDays,
  toDate
} from "../src/core/utils";

describe("toDate", () => {
  it("clones a Date object", () => {
    const d = new Date(2026, 2, 31);
    const result = toDate(d);
    expect(result.getTime()).toBe(d.getTime());
    expect(result).not.toBe(d);
  });

  it("converts a timestamp", () => {
    const ts = Date.now();
    const result = toDate(ts);
    expect(result.getTime()).toBe(ts);
  });

  it("converts a date-only ISO string as a local date", () => {
    const result = toDate("2026-03-31");
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(31);
  });

  it("converts an ISO datetime string deterministically", () => {
    const result = toDate("2026-03-31T15:30:00Z");
    expect(result.toISOString()).toBe("2026-03-31T15:30:00.000Z");
  });

  it("converts a human-readable Gregorian date", () => {
    const result = toDate("31 March 2026");
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(31);
  });

  it("converts a Bangla-digit human-readable Gregorian date", () => {
    const result = toDate("৩১ মার্চ ২০২৬");
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(31);
  });

  it("throws on invalid string", () => {
    expect(() => toDate("not a date")).toThrow("Invalid date input");
  });

  it("throws on invalid Date objects", () => {
    expect(() => toDate(new Date("invalid"))).toThrow("Invalid date input");
  });

  it("throws on invalid numeric timestamps", () => {
    expect(() => toDate(NaN)).toThrow("Invalid date input");
  });

  it("accepts the maximum supported ECMAScript timestamp", () => {
    const result = toDate(8_640_000_000_000_000);
    expect(result.toISOString()).toBe("+275760-09-13T00:00:00.000Z");
  });

  it("throws a range error beyond the supported ECMAScript timestamp", () => {
    expect(() => toDate(8_640_000_000_000_001)).toThrow(
      "Date input is outside the supported range"
    );
    expect(() => toDate(-8_640_000_000_000_001)).toThrow(
      "Date input is outside the supported range"
    );
  });

  it("converts a month-first Gregorian date", () => {
    const result = toDate("March 31, 2026");
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(31);
  });

  it("converts a hyphenated Gregorian date", () => {
    const result = toDate("31-Mar-2026");
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(31);
  });

  it("converts a slash-separated year-first Gregorian date", () => {
    const result = toDate("2026/03/31");
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(31);
  });

  it("throws a range error when date arithmetic overflows", () => {
    const maxDate = new Date(8_640_000_000_000_000);
    expect(() => addDays(maxDate, 1)).toThrow(
      "addDays() output is outside the supported range"
    );
    expect(() => addMonths(maxDate, 1)).toThrow(
      "addMonths() output is outside the supported range"
    );
    expect(() => addYears(maxDate, 1)).toThrow(
      "addYears() output is outside the supported range"
    );
  });
});

describe("isToday / isYesterday / isTomorrow", () => {
  const NOW = new Date("2026-03-31T12:00:00");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("isToday returns true for today", () => {
    expect(isToday(new Date("2026-03-31T08:00:00"))).toBe(true);
  });

  it("isToday returns false for yesterday", () => {
    expect(isToday(new Date("2026-03-30T12:00:00"))).toBe(false);
  });

  it("isYesterday returns true", () => {
    expect(isYesterday(new Date("2026-03-30T12:00:00"))).toBe(true);
  });

  it("isYesterday returns false for today", () => {
    expect(isYesterday(new Date("2026-03-31T12:00:00"))).toBe(false);
  });

  it("isTomorrow returns true", () => {
    expect(isTomorrow(new Date("2026-04-01T06:00:00"))).toBe(true);
  });

  it("isTomorrow returns false for today", () => {
    expect(isTomorrow(new Date("2026-03-31T12:00:00"))).toBe(false);
  });
});

describe("startOfDay / endOfDay", () => {
  it("startOfDay sets time to 00:00:00.000", () => {
    const result = startOfDay(new Date(2026, 2, 31, 15, 30, 45, 123));
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it("endOfDay sets time to 23:59:59.999", () => {
    const result = endOfDay(new Date(2026, 2, 31, 8, 0));
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getSeconds()).toBe(59);
    expect(result.getMilliseconds()).toBe(999);
  });
});

describe("addDays / subDays", () => {
  it("adds days", () => {
    const result = addDays(new Date(2026, 2, 31), 5);
    expect(result.getMonth()).toBe(3); // April
    expect(result.getDate()).toBe(5);
  });

  it("subtracts days", () => {
    const result = subDays(new Date(2026, 2, 31), 3);
    expect(result.getDate()).toBe(28);
  });

  it("handles month boundary", () => {
    const result = addDays(new Date(2026, 0, 31), 1);
    expect(result.getMonth()).toBe(1); // February
    expect(result.getDate()).toBe(1);
  });

  it("accepts string input", () => {
    const result = addDays("2026-03-31", 1);
    expect(result.getDate()).toBe(1);
    expect(result.getMonth()).toBe(3);
  });

  it("accepts human-readable string input", () => {
    const result = addDays("31 March 2026", 1);
    expect(result.getDate()).toBe(1);
    expect(result.getMonth()).toBe(3);
  });
});

describe("month/year utilities", () => {
  it("adds months with end-of-month clamping", () => {
    const result = addMonths(new Date(2026, 0, 31), 1);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(28);
  });

  it("subtracts months", () => {
    const result = subMonths(new Date(2026, 2, 31), 1);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(28);
  });

  it("adds years with leap-day clamping", () => {
    const result = addYears(new Date(2024, 1, 29), 1);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(28);
  });

  it("subtracts years", () => {
    const result = subYears(new Date(2026, 2, 31), 1);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(31);
  });
});

describe("month/year boundaries", () => {
  it("returns startOfMonth", () => {
    const result = startOfMonth(new Date(2026, 2, 31, 15, 30, 45, 123));
    expect(result.getDate()).toBe(1);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it("returns endOfMonth", () => {
    const result = endOfMonth(new Date(2026, 1, 2, 8, 0));
    expect(result.getDate()).toBe(28);
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getSeconds()).toBe(59);
    expect(result.getMilliseconds()).toBe(999);
  });

  it("returns startOfYear", () => {
    const result = startOfYear(new Date(2026, 5, 15, 11, 45));
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
    expect(result.getHours()).toBe(0);
  });

  it("returns endOfYear", () => {
    const result = endOfYear(new Date(2026, 5, 15, 11, 45));
    expect(result.getMonth()).toBe(11);
    expect(result.getDate()).toBe(31);
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getSeconds()).toBe(59);
    expect(result.getMilliseconds()).toBe(999);
  });
});

describe("getBanglaMonth", () => {
  it("returns full Bangla month name for March", () => {
    expect(getBanglaMonth(3)).toBe("মার্চ");
  });

  it("returns short Bangla month name for March", () => {
    expect(getBanglaMonth(3, "short")).toBe("মার্চ");
  });

  it("returns January in Bangla", () => {
    expect(getBanglaMonth(1)).toBe("জানুয়ারি");
  });

  it("returns December in Bangla", () => {
    expect(getBanglaMonth(12)).toBe("ডিসেম্বর");
  });

  it("returns short December", () => {
    expect(getBanglaMonth(12, "short")).toBe("ডিসে");
  });

  it("throws on invalid month", () => {
    expect(() => getBanglaMonth(0)).toThrow("Invalid month number");
    expect(() => getBanglaMonth(13)).toThrow("Invalid month number");
  });
});
