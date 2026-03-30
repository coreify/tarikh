import { describe, expect, it } from "vitest";
import {
  format,
  formatBanglaCalendar,
  formatBanglaCalendarDay,
  formatDate,
  formatHybridDate
} from "../src/core/format";

const testDate = new Date(2026, 2, 31); // March 31, 2026

describe("formatDate", () => {
  it("formats in en-BD by default", () => {
    expect(formatDate(testDate)).toBe("31 Mar 2026");
  });

  it("formats in bn-BD with Bangla digits and months", () => {
    expect(formatDate(testDate, { locale: "bn-BD" })).toBe("৩১ মার্চ ২০২৬");
  });

  it("respects long month format", () => {
    expect(formatDate(testDate, { month: "long" })).toBe("31 March 2026");
  });

  it("respects long month format in bn-BD", () => {
    expect(formatDate(testDate, { locale: "bn-BD", month: "long" })).toBe(
      "৩১ মার্চ ২০২৬"
    );
  });

  it("respects 2-digit year", () => {
    expect(formatDate(testDate, { year: "2-digit" })).toBe("31 Mar 26");
  });

  it("respects 2-digit day", () => {
    const jan1 = new Date(2026, 0, 5);
    expect(formatDate(jan1, { day: "2-digit" })).toBe("05 Jan 2026");
  });

  it("supports weekday output", () => {
    expect(formatDate(testDate, { weekday: "short" })).toBe("Tue, 31 Mar 2026");
    expect(formatDate(testDate, { weekday: "long" })).toBe(
      "Tuesday, 31 Mar 2026"
    );
  });

  it("supports time output", () => {
    const date = new Date(2026, 2, 31, 15, 4, 9);
    expect(formatDate(date, { hour: "numeric", minute: "2-digit" })).toBe(
      "31 Mar 2026, 15:04"
    );
    expect(
      formatDate(date, {
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
      formatDate(date, {
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
    expect(formatDate("2026-03-31")).toBe("31 Mar 2026");
  });

  it("accepts timestamp input", () => {
    expect(formatDate(testDate.getTime())).toBe("31 Mar 2026");
  });

  it("throws on invalid Date objects", () => {
    expect(() => formatDate(new Date("invalid"))).toThrow("Invalid date input");
  });

  it("throws on invalid numeric timestamps", () => {
    expect(() => formatDate(NaN)).toThrow("Invalid date input");
  });
});

describe("format (token-based)", () => {
  it("replaces DD MMM YYYY", () => {
    expect(format(testDate, "DD MMM YYYY")).toBe("31 Mar 2026");
  });

  it("replaces D MMMM YYYY", () => {
    expect(format(testDate, "D MMMM YYYY")).toBe("31 March 2026");
  });

  it("replaces DD/MM/YYYY", () => {
    expect(format(testDate, "DD/MM/YYYY")).toBe("31/03/2026");
  });

  it("replaces YY", () => {
    expect(format(testDate, "DD MMM YY")).toBe("31 Mar 26");
  });

  it("handles bn-BD locale", () => {
    expect(format(testDate, "DD MMMM YYYY", { locale: "bn-BD" })).toBe(
      "৩১ মার্চ ২০২৬"
    );
  });

  it("handles single digit day with D token", () => {
    const jan5 = new Date(2026, 0, 5);
    expect(format(jan5, "D MMM YYYY")).toBe("5 Jan 2026");
  });

  it("pads day with DD token", () => {
    const jan5 = new Date(2026, 0, 5);
    expect(format(jan5, "DD MMM YYYY")).toBe("05 Jan 2026");
  });

  it("supports weekday and time tokens", () => {
    const date = new Date(2026, 2, 31, 15, 4, 9);
    expect(format(date, "ddd, D MMM YYYY HH:mm:ss")).toBe(
      "Tue, 31 Mar 2026 15:04:09"
    );
    expect(format(date, "dddd h:mm A")).toBe("Tuesday 3:04 PM");
  });

  it("supports localized weekday and meridiem tokens", () => {
    const date = new Date(2026, 2, 31, 9, 4, 9);
    expect(format(date, "ddd, D MMM YYYY h:mm a", { locale: "bn-BD" })).toBe(
      "মঙ্গল, ৩১ মার্চ ২০২৬ ৯:০৪ পূর্বাহ্ণ"
    );
  });
});

describe("formatBanglaCalendar", () => {
  it("defaults to English digits and Latin month names", () => {
    expect(formatBanglaCalendar("2026-03-31")).toBe("17 Chaitra 1432");
  });

  it("formats Pohela Baishakh in English by default", () => {
    expect(formatBanglaCalendar("2026-04-14")).toBe("1 Baishakh 1433");
  });

  it("uses Bangla digits and month names when locale is bn-BD", () => {
    expect(formatBanglaCalendar("2026-03-31", { locale: "bn-BD" })).toBe(
      "১৭ই চৈত্র ১৪৩২"
    );
    expect(formatBanglaCalendar("2026-04-14", { locale: "bn-BD" })).toBe(
      "১লা বৈশাখ ১৪৩৩"
    );
    expect(formatBanglaCalendar("2026-05-04", { locale: "bn-BD" })).toBe(
      "২১শে বৈশাখ ১৪৩৩"
    );
  });

  it("supports spoken Bangla day words in the calendar formatter", () => {
    expect(
      formatBanglaCalendar("2026-04-14", {
        locale: "bn-BD",
        format: "spoken"
      })
    ).toBe("পহেলা বৈশাখ ১৪৩৩");
    expect(
      formatBanglaCalendar("2026-04-14", {
        locale: "bn-BD",
        format: "spoken",
        variant: "poyla"
      })
    ).toBe("পয়লা বৈশাখ ১৪৩৩");
  });

  it("accepts Date object", () => {
    expect(formatBanglaCalendar(testDate)).toBe("17 Chaitra 1432");
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

describe("formatHybridDate", () => {
  it("defaults to English digits + Bangla month + English year", () => {
    expect(formatHybridDate(testDate)).toBe("31 মার্চ 2026");
  });

  it("supports Bangla digits with English year", () => {
    expect(
      formatHybridDate(testDate, { digits: "bn", month: "bn", year: "en" })
    ).toBe("৩১ মার্চ 2026");
  });

  it("supports all Bangla", () => {
    expect(
      formatHybridDate(testDate, {
        digits: "bn",
        month: "bn",
        year: "bn"
      })
    ).toBe("৩১ মার্চ ২০২৬");
  });

  it("supports all English", () => {
    expect(
      formatHybridDate(testDate, {
        digits: "en",
        month: "en",
        year: "en"
      })
    ).toBe("31 March 2026");
  });

  it("supports short month format", () => {
    expect(
      formatHybridDate(testDate, {
        month: "en",
        monthFormat: "short"
      })
    ).toBe("31 Mar 2026");
  });

  it("supports independent day language", () => {
    expect(
      formatHybridDate(testDate, {
        day: "bn",
        month: "bn",
        year: "en"
      })
    ).toBe("৩১ মার্চ 2026");
  });
});
