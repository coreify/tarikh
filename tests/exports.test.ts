import { describe, expect, it } from "vitest";
import * as tarikh from "../src";
import * as react from "../src/react";

describe("package exports", () => {
  it("keeps the root export list stable", () => {
    expect(Object.keys(tarikh).sort()).toEqual([
      "BANGLA_CALENDAR_MONTHS",
      "BANGLA_CALENDAR_MONTHS_EN",
      "BANGLA_CALENDAR_MONTH_DAYS",
      "BANGLA_DIGITS",
      "BANGLA_MONTHS_FULL",
      "BANGLA_MONTHS_SHORT",
      "BANGLA_WEEKDAYS_FULL",
      "BANGLA_WEEKDAYS_SHORT",
      "BOISHAKH_START_DAY",
      "BOISHAKH_START_MONTH",
      "ENGLISH_DIGITS",
      "ENGLISH_MONTHS_FULL",
      "ENGLISH_MONTHS_SHORT",
      "ENGLISH_WEEKDAYS_FULL",
      "ENGLISH_WEEKDAYS_SHORT",
      "RELATIVE_TIME_BN",
      "RELATIVE_TIME_EN",
      "addDays",
      "addMonths",
      "addYears",
      "endOfDay",
      "endOfMonth",
      "endOfYear",
      "format",
      "formatBanglaCalendarDay",
      "fromBanglaCalendar",
      "fromNow",
      "getBanglaMonth",
      "isToday",
      "isTomorrow",
      "isYesterday",
      "parseDate",
      "startOfDay",
      "startOfMonth",
      "startOfYear",
      "subDays",
      "subMonths",
      "subYears",
      "toBanglaCalendar",
      "toBanglaDigits",
      "toDate",
      "toEnglishDigits",
      "toHijriCalendar"
    ]);
  });

  it("keeps the React export list stable", () => {
    expect(Object.keys(react).sort()).toEqual(["Tarikh"]);
  });
});
