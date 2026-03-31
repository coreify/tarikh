import { describe, expect, it } from "vitest";
import { format, formatBanglaCalendarDay } from "../src/core/format";

const testDate = new Date(2026, 2, 31); // March 31, 2026

describe("format (standard mode)", () => {
  it("formats in en-BD by default", () => {
    expect(format(testDate, { mode: "standard" })).toBe("31 Mar 2026");
  });

  it("formats in bn-BD with Bangla digits and months", () => {
    expect(format(testDate, { mode: "standard", locale: "bn-BD" })).toBe(
      "৩১ মার্চ ২০২৬"
    );
  });

  it("respects long month format", () => {
    expect(format(testDate, { mode: "standard", month: "long" })).toBe(
      "31 March 2026"
    );
  });

  it("respects long month format in bn-BD", () => {
    expect(
      format(testDate, { mode: "standard", locale: "bn-BD", month: "long" })
    ).toBe("৩১ মার্চ ২০২৬");
  });

  it("respects 2-digit year", () => {
    expect(format(testDate, { mode: "standard", year: "2-digit" })).toBe(
      "31 Mar 26"
    );
  });

  it("respects 2-digit day", () => {
    const jan1 = new Date(2026, 0, 5);
    expect(format(jan1, { mode: "standard", day: "2-digit" })).toBe(
      "05 Jan 2026"
    );
  });

  it("supports weekday output", () => {
    expect(format(testDate, { mode: "standard", weekday: "short" })).toBe(
      "Tue, 31 Mar 2026"
    );
    expect(format(testDate, { mode: "standard", weekday: "long" })).toBe(
      "Tuesday, 31 Mar 2026"
    );
  });

  it("supports time output", () => {
    const date = new Date(2026, 2, 31, 15, 4, 9);
    expect(
      format(date, {
        mode: "standard",
        hour: "numeric",
        minute: "2-digit"
      })
    ).toBe("31 Mar 2026, 15:04");
    expect(
      format(date, {
        mode: "standard",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      })
    ).toBe("31 Mar 2026, 03:04:09 PM");
  });

  it("supports weekday and time in bn-BD", () => {
    const date = new Date(2026, 2, 31, 9, 5, 7);
    expect(
      format(date, {
        mode: "standard",
        locale: "bn-BD",
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      })
    ).toBe("মঙ্গল, ৩১ মার্চ ২০২৬, ৯:০৫:০৭ পূর্বাহ্ণ");
  });

  it("accepts string input", () => {
    expect(format("2026-03-31", { mode: "standard" })).toBe("31 Mar 2026");
  });

  it("accepts timestamp input", () => {
    expect(format(testDate.getTime(), { mode: "standard" })).toBe(
      "31 Mar 2026"
    );
  });

  it("throws on invalid Date objects", () => {
    expect(() => format(new Date("invalid"), { mode: "standard" })).toThrow(
      "Invalid date input"
    );
  });

  it("throws on invalid numeric timestamps", () => {
    expect(() => format(NaN, { mode: "standard" })).toThrow(
      "Invalid date input"
    );
  });
});

describe("format (pattern and mode)", () => {
  it("replaces DD MMM YYYY", () => {
    expect(format(testDate, { pattern: "DD MMM YYYY" })).toBe("31 Mar 2026");
  });

  it("replaces D MMMM YYYY", () => {
    expect(format(testDate, { pattern: "D MMMM YYYY" })).toBe("31 March 2026");
  });

  it("replaces DD/MM/YYYY", () => {
    expect(format(testDate, { pattern: "DD/MM/YYYY" })).toBe("31/03/2026");
  });

  it("replaces YY", () => {
    expect(format(testDate, { pattern: "DD MMM YY" })).toBe("31 Mar 26");
  });

  it("handles bn-BD locale", () => {
    expect(
      format(testDate, { pattern: "DD MMMM YYYY", locale: "bn-BD" })
    ).toBe("৩১ মার্চ ২০২৬");
  });

  it("handles single digit day with D token", () => {
    const jan5 = new Date(2026, 0, 5);
    expect(format(jan5, { pattern: "D MMM YYYY" })).toBe("5 Jan 2026");
  });

  it("pads day with DD token", () => {
    const jan5 = new Date(2026, 0, 5);
    expect(format(jan5, { pattern: "DD MMM YYYY" })).toBe("05 Jan 2026");
  });

  it("supports weekday and time tokens", () => {
    const date = new Date(2026, 2, 31, 15, 4, 9);
    expect(format(date, { pattern: "ddd, D MMM YYYY HH:mm:ss" })).toBe(
      "Tue, 31 Mar 2026 15:04:09"
    );
    expect(format(date, { pattern: "dddd h:mm A" })).toBe("Tuesday 3:04 PM");
  });

  it("supports localized weekday and meridiem tokens", () => {
    const date = new Date(2026, 2, 31, 9, 4, 9);
    expect(
      format(date, { pattern: "ddd, D MMM YYYY h:mm a", locale: "bn-BD" })
    ).toBe("মঙ্গল, ৩১ মার্চ ২০২৬ ৯:০৪ পূর্বাহ্ণ");
  });

  it("supports bracket-escaped literals in patterns", () => {
    const date = new Date(2026, 2, 31, 15, 4, 9);
    expect(format(date, { pattern: "[Today at] h:mm a" })).toBe(
      "Today at 3:04 pm"
    );
  });

  it("supports multiple bracket literals in a single pattern", () => {
    const date = new Date(2026, 2, 31, 15, 4, 9);
    expect(
      format(date, { pattern: "[Version] DD [of] MMM YYYY" })
    ).toBe("Version 31 of Mar 2026");
    expect(
      format(date, { pattern: "[Version] DD [of] MMM YYYY", locale: "bn-BD" })
    ).toBe("Version ৩১ of মার্চ ২০২৬");
  });

  it("keeps bracket literals unchanged in bn-BD", () => {
    const date = new Date(2026, 2, 31, 15, 4, 9);
    expect(
      format(date, { pattern: "[Version 2] D MMM YYYY", locale: "bn-BD" })
    ).toBe("Version 2 ৩১ মার্চ ২০২৬");
  });

  it("does not treat raw placeholder-like text as escaped literals", () => {
    expect(format(testDate, { pattern: "<<1>> DD MMM YYYY" })).toBe(
      "<<1>> 31 Mar 2026"
    );
  });

  it("treats the first closing bracket as the end of a literal block", () => {
    const date = new Date(2026, 2, 31, 15, 4, 9);
    expect(format(date, { pattern: "[x] ] h:mm" })).toBe("x ] 3:04");
  });

  it("treats unmatched opening bracket as plain text", () => {
    expect(format(testDate, { pattern: "[Today h:mm a" })).toBe("[Today h:mm a");
  });

  it("treats empty bracket literals as empty text", () => {
    expect(format(testDate, { pattern: "[] DD MMM YYYY" })).toBe(
      " 31 Mar 2026"
    );
    expect(format(testDate, { pattern: "[] DD MMM YYYY", locale: "bn-BD" })).toBe(
      " ৩১ মার্চ ২০২৬"
    );
  });

  it("supports adjacent and nested-looking bracket literals", () => {
    expect(format(testDate, { pattern: "[A][B]DD MMM YYYY" })).toBe(
      "AB31 Mar 2026"
    );
    expect(format(testDate, { pattern: "[[A]] DD MMM YYYY" })).toBe(
      "[A] 31 Mar 2026"
    );
    expect(
      format(testDate, { pattern: "[[A]] DD MMM YYYY", locale: "bn-BD" })
    ).toBe("[A] ৩১ মার্চ ২০২৬");
  });

  it("supports standard mode", () => {
    expect(format(testDate, { mode: "standard" })).toBe("31 Mar 2026");
    expect(format(testDate, { mode: "standard", locale: "bn-BD" })).toBe(
      "৩১ মার্চ ২০২৬"
    );
  });

  it("rejects passing mode when pattern is also present", () => {
    expect(
      () =>
        format(testDate, {
          mode: "bangla",
          pattern: "DD MMM YYYY"
        } as never)
    ).toThrow(
      "Do not pass `mode` when `pattern` is provided. `pattern` formatting does not use mode."
    );
  });

  it("rejects empty option objects", () => {
    expect(() => format(testDate, {} as never)).toThrow(
      "format() expects `mode` or `pattern`"
    );
  });

  it("supports bangla mode", () => {
    expect(format(testDate, { mode: "bangla" })).toBe("17 Chaitra 1432");
    expect(format(testDate, { mode: "bangla", locale: "bn-BD" })).toBe(
      "১৭ই চৈত্র ১৪৩২"
    );
  });

  it("supports hybrid mode", () => {
    expect(format(testDate, { mode: "hybrid" })).toBe("31 মার্চ 2026");
    expect(
      format(testDate, {
        mode: "hybrid",
        digits: "bn",
        month: "bn",
        year: "en"
      })
    ).toBe("৩১ মার্চ 2026");
  });
});

describe("format (bangla mode)", () => {
  it("defaults to English digits and Latin month names", () => {
    expect(format("2026-03-31", { mode: "bangla" })).toBe("17 Chaitra 1432");
  });

  it("formats Pohela Baishakh in English by default", () => {
    expect(format("2026-04-14", { mode: "bangla" })).toBe("1 Baishakh 1433");
  });

  it("uses Bangla digits and month names when locale is bn-BD", () => {
    expect(format("2026-03-31", { mode: "bangla", locale: "bn-BD" })).toBe(
      "১৭ই চৈত্র ১৪৩২"
    );
    expect(format("2026-04-14", { mode: "bangla", locale: "bn-BD" })).toBe(
      "১লা বৈশাখ ১৪৩৩"
    );
    expect(format("2026-05-04", { mode: "bangla", locale: "bn-BD" })).toBe(
      "২১শে বৈশাখ ১৪৩৩"
    );
  });

  it("supports spoken Bangla day words in the calendar formatter", () => {
    expect(
      format("2026-04-14", {
        mode: "bangla",
        locale: "bn-BD",
        format: "spoken"
      })
    ).toBe("পহেলা বৈশাখ ১৪৩৩");
    expect(
      format("2026-04-14", {
        mode: "bangla",
        locale: "bn-BD",
        format: "spoken",
        variant: "poyla"
      })
    ).toBe("পয়লা বৈশাখ ১৪৩৩");
  });

  it("accepts Date object", () => {
    expect(format(testDate, { mode: "bangla" })).toBe("17 Chaitra 1432");
  });
});

describe("formatBanglaCalendarDay", () => {
  it("formats the Bangla date-word suffixes", () => {
    expect(formatBanglaCalendarDay(1)).toBe("১লা");
    expect(formatBanglaCalendarDay(1, { format: "spoken" })).toBe("পহেলা");
    expect(
      formatBanglaCalendarDay(1, { format: "spoken", variant: "pohela" })
    ).toBe("পহেলা");
    expect(
      formatBanglaCalendarDay(1, { format: "spoken", variant: "poyla" })
    ).toBe("পয়লা");
    expect(formatBanglaCalendarDay(2)).toBe("২রা");
    expect(formatBanglaCalendarDay(3)).toBe("৩রা");
    expect(formatBanglaCalendarDay(4)).toBe("৪ঠা");
    expect(formatBanglaCalendarDay(5)).toBe("৫ই");
    expect(formatBanglaCalendarDay(18)).toBe("১৮ই");
    expect(formatBanglaCalendarDay(19)).toBe("১৯শে");
    expect(formatBanglaCalendarDay(31)).toBe("৩১শে");
    expect(formatBanglaCalendarDay(21, { format: "spoken" })).toBe("২১শে");
  });
});

describe("format input validation", () => {
  it("rejects legacy positional mode strings", () => {
    expect(() => format(testDate, "bangla" as never)).toThrow(
      "format() expects an options object"
    );
  });

  it("rejects null options", () => {
    expect(() => format(testDate, null as never)).toThrow(
      "format() expects an options object"
    );
  });

  it("rejects array options", () => {
    expect(() => format(testDate, [] as never)).toThrow(
      "format() expects an options object"
    );
  });

  it("rejects hybrid language options in standard mode", () => {
    expect(() =>
      format(testDate, { mode: "standard", month: "bn" as never })
    ).toThrow("Invalid month format for standard mode");
  });

  it("rejects invalid hybrid month formats", () => {
    expect(() =>
      format(testDate, {
        mode: "hybrid",
        month: "bn",
        monthFormat: "wide" as never
      })
    ).toThrow("Invalid month format for hybrid mode");
  });

  it("rejects invalid mode values", () => {
    expect(() => format(testDate, { mode: "legacy" as never })).toThrow(
      "Invalid format mode: legacy"
    );
  });

  it("rejects invalid weekday format in standard mode", () => {
    expect(() =>
      format(testDate, { mode: "standard", weekday: "wide" as never })
    ).toThrow("Invalid weekday format for standard mode");
  });

  it("rejects invalid time token formats in standard mode", () => {
    expect(() =>
      format(testDate, { mode: "standard", hour: "wide" as never })
    ).toThrow("Invalid hour format for standard mode");
    expect(() =>
      format(testDate, { mode: "standard", minute: "wide" as never })
    ).toThrow("Invalid minute format for standard mode");
    expect(() =>
      format(testDate, { mode: "standard", second: "wide" as never })
    ).toThrow("Invalid second format for standard mode");
  });
});

describe("format (hybrid mode)", () => {
  it("defaults to English digits + Bangla month + English year", () => {
    expect(format(testDate, { mode: "hybrid" })).toBe("31 মার্চ 2026");
  });

  it("supports Bangla digits with English year", () => {
    expect(
      format(testDate, {
        mode: "hybrid",
        digits: "bn",
        month: "bn",
        year: "en"
      })
    ).toBe("৩১ মার্চ 2026");
  });

  it("supports all Bangla", () => {
    expect(
      format(testDate, {
        mode: "hybrid",
        digits: "bn",
        month: "bn",
        year: "bn"
      })
    ).toBe("৩১ মার্চ ২০২৬");
  });

  it("supports all English", () => {
    expect(
      format(testDate, {
        mode: "hybrid",
        digits: "en",
        month: "en",
        year: "en"
      })
    ).toBe("31 March 2026");
  });

  it("supports short month format", () => {
    expect(
      format(testDate, {
        mode: "hybrid",
        month: "en",
        monthFormat: "short"
      })
    ).toBe("31 Mar 2026");
  });

  it("supports independent day language", () => {
    expect(
      format(testDate, {
        mode: "hybrid",
        day: "bn",
        month: "bn",
        year: "en"
      })
    ).toBe("৩১ মার্চ 2026");
  });
});
