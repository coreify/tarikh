import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getDefaults, setDefaults, toHijriCalendar } from "../src";
import { format, formatBanglaCalendarDay } from "../src/core/format";

const testDate = new Date(2026, 2, 31); // March 31, 2026
const initialDefaults = getDefaults();

function resetDefaults(): void {
  setDefaults({
    locale: initialDefaults.locale,
    mode: initialDefaults.mode,
    month: initialDefaults.month ?? null,
    timeZone: initialDefaults.timeZone,
    hijriSystem: initialDefaults.hijriSystem
  });
}

beforeEach(() => {
  resetDefaults();
});

afterEach(() => {
  resetDefaults();
});

describe("format (standard mode)", () => {
  it("formats in en-BD by default", () => {
    expect(format(testDate, { mode: "standard" })).toBe("31st Mar 2026");
  });

  it("formats in bn-BD with Bangla digits and months", () => {
    expect(format(testDate, { mode: "standard", locale: "bn-BD" })).toBe(
      "৩১শে মার্চ ২০২৬ খ্রিস্টাব্দ"
    );
  });

  it("respects long month format", () => {
    expect(format(testDate, { mode: "standard", month: "long" })).toBe(
      "31st March 2026"
    );
  });

  it("respects long month format in bn-BD", () => {
    expect(
      format(testDate, { mode: "standard", locale: "bn-BD", month: "long" })
    ).toBe("৩১শে মার্চ ২০২৬ খ্রিস্টাব্দ");
  });

  it("respects 2-digit year", () => {
    expect(format(testDate, { mode: "standard", year: "2-digit" })).toBe(
      "31st Mar 26"
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
      "Tue, 31st Mar 2026"
    );
    expect(format(testDate, { mode: "standard", weekday: "long" })).toBe(
      "Tuesday, 31st Mar 2026"
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
    ).toBe("31st Mar 2026, 15:04");
    expect(
      format(date, {
        mode: "standard",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      })
    ).toBe("31st Mar 2026, 03:04:09 PM");
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
    ).toBe("মঙ্গল, ৩১শে মার্চ ২০২৬ খ্রিস্টাব্দ, ৯:০৫:০৭ পূর্বাহ্ণ");
  });

  it("accepts string input", () => {
    expect(format("2026-03-31", { mode: "standard" })).toBe("31st Mar 2026");
  });

  it("accepts timestamp input", () => {
    expect(format(testDate.getTime(), { mode: "standard" })).toBe(
      "31st Mar 2026"
    );
  });

  it("uses the default mode when options are omitted or empty", () => {
    expect(format(testDate)).toBe("31st Mar 2026");
    expect(format(testDate, {})).toBe("31st Mar 2026");
  });

  it("supports standard formatting presets", () => {
    const date = new Date(2026, 2, 31, 15, 4, 9);

    expect(format(date, { mode: "standard", preset: "date" })).toBe(
      "31st Mar 2026"
    );
    expect(format(date, { mode: "standard", preset: "dateTime" })).toBe(
      "31st Mar 2026, 15:04"
    );
    expect(format(date, { mode: "standard", preset: "isoLike" })).toBe(
      "2026-03-31 15:04:09"
    );
    expect(
      format(date, { mode: "standard", preset: "isoLike", locale: "bn-BD" })
    ).toBe("২০২৬-০৩-৩১ ১৫:০৪:০৯");
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

  it("throws a range error across all formatter modes", () => {
    const overflow = 8_640_000_000_000_001;
    const message = "Date input is outside the supported range";

    expect(() => format(overflow, { mode: "standard" })).toThrow(message);
    expect(() => format(overflow, { mode: "bangla" })).toThrow(message);
    expect(() => format(overflow, { mode: "hijri" })).toThrow(message);
    expect(() => format(overflow, { mode: "hybrid" })).toThrow(message);
    expect(() => format(overflow, { pattern: "DD MMM YYYY" })).toThrow(message);
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
    expect(format(testDate, { pattern: "DD MMMM YYYY", locale: "bn-BD" })).toBe(
      "৩১ মার্চ ২০২৬"
    );
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
    expect(format(date, { pattern: "[Version] DD [of] MMM YYYY" })).toBe(
      "Version 31 of Mar 2026"
    );
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
    expect(format(testDate, { pattern: "[Today h:mm a" })).toBe(
      "[Today h:mm a"
    );
  });

  it("treats empty bracket literals as empty text", () => {
    expect(format(testDate, { pattern: "[] DD MMM YYYY" })).toBe(
      " 31 Mar 2026"
    );
    expect(
      format(testDate, { pattern: "[] DD MMM YYYY", locale: "bn-BD" })
    ).toBe(" ৩১ মার্চ ২০২৬");
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
    expect(format(testDate, { mode: "standard" })).toBe("31st Mar 2026");
    expect(format(testDate, { mode: "standard", locale: "bn-BD" })).toBe(
      "৩১শে মার্চ ২০২৬ খ্রিস্টাব্দ"
    );
  });

  it("rejects passing mode when pattern is also present", () => {
    expect(() =>
      format(testDate, {
        mode: "bangla",
        pattern: "DD MMM YYYY"
      } as never)
    ).toThrow(
      "Do not pass `mode` when `pattern` is provided. `pattern` formatting does not use mode."
    );
  });

  it("resolves mode from defaults when only generic options are passed", () => {
    setDefaults({ mode: "bangla", locale: "bn-BD" });

    expect(format("2026-04-14", { locale: "bn-BD" })).toBe(
      "১লা বৈশাখ ১৪৩৩ বঙ্গাব্দ"
    );
  });

  it("supports bangla mode", () => {
    expect(format(testDate, { mode: "bangla" })).toBe("17th Chaitra 1432");
    expect(format(testDate, { mode: "bangla", locale: "bn-BD" })).toBe(
      "১৭ই চৈত্র ১৪৩২ বঙ্গাব্দ"
    );
  });

  it("supports hijri mode", () => {
    const hijriInstant = new Date("2026-03-30T18:00:00.000Z");

    expect(format(hijriInstant, { mode: "hijri" })).toBe(
      "12th Shawwal 1447 AH"
    );
    expect(format(hijriInstant, { mode: "hijri", locale: "bn-BD" })).toBe(
      "১২ই শাওয়াল ১৪৪৭ হিজরি"
    );
    expect(format(hijriInstant, { mode: "hijri", timeZone: "UTC" })).toBe(
      "11th Shawwal 1447 AH"
    );
    expect(
      format(hijriInstant, { mode: "hijri", locale: "bn-BD", timeZone: "UTC" })
    ).toBe("১১ই শাওয়াল ১৪৪৭ হিজরি");
  });

  it("accepts configurable Hijri calendar systems", () => {
    const hijriInstant = new Date("2026-03-30T18:00:00.000Z");
    const umalqura = format(hijriInstant, {
      mode: "hijri",
      hijriSystem: "islamic-umalqura"
    });
    const civil = format(hijriInstant, {
      mode: "hijri",
      hijriSystem: "islamic-civil"
    });

    expect(format(hijriInstant, { mode: "hijri" })).toBe(umalqura);
    expect(umalqura).toMatch(/AH$/);
    expect(civil).toMatch(/AH$/);
  });

  it("keeps structured Hijri conversion shape stable when only defaults.locale changes", () => {
    setDefaults({ locale: "bn-BD" });

    const result = toHijriCalendar("2026-03-31");
    expect(typeof result.day).toBe("number");
    expect(typeof result.year).toBe("number");
    expect(result).toEqual({
      day: 12,
      month: "Shawwal",
      monthIndex: 10,
      year: 1447
    });
  });

  it("rejects unsupported Hijri time zones at runtime", () => {
    expect(() =>
      format(testDate, {
        mode: "hijri",
        timeZone: "America/New_York" as never
      })
    ).toThrow(
      "Unsupported Hijri time zone: America/New_York. Supported values: Asia/Dhaka, UTC"
    );
  });

  it("uses ই for Hijri bn-BD days beyond 2", () => {
    expect(
      format(new Date(2026, 0, 22), { mode: "hijri", locale: "bn-BD" })
    ).toMatch(/^৩ই /);
    expect(
      format(new Date(2026, 0, 23), { mode: "hijri", locale: "bn-BD" })
    ).toMatch(/^৪ই /);
    expect(
      format(new Date(2026, 0, 24), { mode: "hijri", locale: "bn-BD" })
    ).toMatch(/^৫ই /);
  });

  it("keeps Hijri output stable on Gregorian boundary dates", () => {
    const april14Utc = new Date(Date.UTC(2026, 3, 14));
    const dec31Utc = new Date(Date.UTC(2026, 11, 31));

    expect(format(april14Utc, { mode: "hijri" })).toBe("26th Shawwal 1447 AH");
    expect(format(april14Utc, { mode: "hijri", locale: "bn-BD" })).toBe(
      "২৬ই শাওয়াল ১৪৪৭ হিজরি"
    );

    expect(format(dec31Utc, { mode: "hijri" })).toBe("22nd Rajab 1448 AH");
    expect(format(dec31Utc, { mode: "hijri", locale: "bn-BD" })).toBe(
      "২২ই রজব ১৪৪৮ হিজরি"
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
    expect(format("2026-03-31", { mode: "bangla" })).toBe("17th Chaitra 1432");
  });

  it("formats Pohela Baishakh in English by default", () => {
    expect(format("2026-04-14", { mode: "bangla" })).toBe("1st Baishakh 1433");
  });

  it("uses Bangla digits and month names when locale is bn-BD", () => {
    expect(format("2026-03-31", { mode: "bangla", locale: "bn-BD" })).toBe(
      "১৭ই চৈত্র ১৪৩২ বঙ্গাব্দ"
    );
    expect(format("2026-04-14", { mode: "bangla", locale: "bn-BD" })).toBe(
      "১লা বৈশাখ ১৪৩৩ বঙ্গাব্দ"
    );
    expect(format("2026-05-04", { mode: "bangla", locale: "bn-BD" })).toBe(
      "২১শে বৈশাখ ১৪৩৩ বঙ্গাব্দ"
    );
  });

  it("supports spoken Bangla day words in the calendar formatter", () => {
    expect(
      format("2026-04-14", {
        mode: "bangla",
        locale: "bn-BD",
        format: "spoken"
      })
    ).toBe("পহেলা বৈশাখ ১৪৩৩ বঙ্গাব্দ");
    expect(
      format("2026-04-14", {
        mode: "bangla",
        locale: "bn-BD",
        format: "spoken",
        variant: "poyla"
      })
    ).toBe("পয়লা বৈশাখ ১৪৩৩ বঙ্গাব্দ");
  });

  it("accepts Date object", () => {
    expect(format(testDate, { mode: "bangla" })).toBe("17th Chaitra 1432");
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

  it("respects configured global defaults", () => {
    setDefaults({
      locale: "bn-BD",
      mode: "standard",
      month: "long"
    });

    expect(getDefaults()).toMatchObject({
      locale: "bn-BD",
      mode: "standard",
      month: "long"
    });
    expect(format(testDate)).toBe("৩১শে মার্চ ২০২৬ খ্রিস্টাব্দ");
  });
});
