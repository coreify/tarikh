import type { FromNowOptions, TarikhDateInput } from "../types";
import { RELATIVE_TIME_BN, RELATIVE_TIME_EN } from "./constants";
import { toBanglaDigits } from "./digits";
import { toDate } from "./utils";

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

interface TimeUnit {
  threshold: number;
  singular: "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
  plural: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
}

const UNITS: TimeUnit[] = [
  { threshold: WEEK, singular: "week", plural: "weeks" },
  { threshold: DAY, singular: "day", plural: "days" },
  { threshold: HOUR, singular: "hour", plural: "hours" },
  { threshold: MINUTE, singular: "minute", plural: "minutes" },
  { threshold: SECOND, singular: "second", plural: "seconds" }
];

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function addCalendarMonths(date: Date, months: number): Date {
  const year = date.getFullYear();
  const month = date.getMonth() + months;
  const targetYear = year + Math.floor(month / 12);
  const targetMonth = ((month % 12) + 12) % 12;
  const targetDay = Math.min(
    date.getDate(),
    daysInMonth(targetYear, targetMonth)
  );

  return new Date(
    targetYear,
    targetMonth,
    targetDay,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
}

function addCalendarYears(date: Date, years: number): Date {
  const targetYear = date.getFullYear() + years;
  const targetMonth = date.getMonth();
  const targetDay = Math.min(
    date.getDate(),
    daysInMonth(targetYear, targetMonth)
  );

  return new Date(
    targetYear,
    targetMonth,
    targetDay,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
}

function diffInCalendarYears(later: Date, earlier: Date): number {
  let years = later.getFullYear() - earlier.getFullYear();
  const anchor = addCalendarYears(earlier, years);
  if (anchor > later) {
    years -= 1;
  }
  return years;
}

function diffInCalendarMonths(later: Date, earlier: Date): number {
  let months =
    (later.getFullYear() - earlier.getFullYear()) * 12 +
    (later.getMonth() - earlier.getMonth());
  const anchor = addCalendarMonths(earlier, months);
  if (anchor > later) {
    months -= 1;
  }
  return months;
}

function formatRelativeValue(
  count: number,
  singular: string,
  plural: string,
  isPast: boolean,
  locale: "en-BD" | "bn-BD"
): string {
  const isBn = locale === "bn-BD";
  const countStr = isBn ? toBanglaDigits(count) : String(count);
  const label = count === 1 ? singular : plural;

  if (isBn) {
    return isPast ? `${countStr} ${label} আগে` : `${countStr} ${label} পরে`;
  }

  return isPast ? `${countStr} ${label} ago` : `in ${countStr} ${label}`;
}

function formatNaturalRelative(
  unit: "day" | "week" | "month" | "year",
  isPast: boolean,
  locale: "en-BD" | "bn-BD"
): string | null {
  if (locale === "bn-BD") {
    if (unit === "day") return isPast ? "গতকাল" : "আগামীকাল";
    if (unit === "week") return isPast ? "গত সপ্তাহে" : "আগামী সপ্তাহে";
    if (unit === "month") return isPast ? "গত মাসে" : "আগামী মাসে";
    return isPast ? "গত বছর" : "আগামী বছর";
  }

  if (unit === "day") return isPast ? "yesterday" : "tomorrow";
  if (unit === "week") return isPast ? "last week" : "next week";
  if (unit === "month") return isPast ? "last month" : "next month";
  return isPast ? "last year" : "next year";
}

function formatTodayWord(locale: "en-BD" | "bn-BD"): string {
  return locale === "bn-BD" ? "আজ" : "today";
}

export function fromNow(
  input: TarikhDateInput,
  options?: FromNowOptions
): string {
  const date = toDate(input);
  const locale = options?.locale ?? "en-BD";
  const numeric = options?.numeric ?? "always";
  const isBn = locale === "bn-BD";
  const words = isBn ? RELATIVE_TIME_BN : RELATIVE_TIME_EN;

  const diff = Date.now() - date.getTime();
  const absDiff = Math.abs(diff);
  const isPast = diff > 0;
  const now = new Date();
  const isSameCalendarDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const later = isPast ? now : date;
  const earlier = isPast ? date : now;

  if (absDiff < SECOND) {
    return words.justNow;
  }

  if (numeric === "auto" && isSameCalendarDay) {
    return formatTodayWord(locale);
  }

  const years = diffInCalendarYears(later, earlier);
  if (years >= 1) {
    if (numeric === "auto" && years === 1) {
      const natural = formatNaturalRelative("year", isPast, locale);
      if (natural !== null) return natural;
    }
    return formatRelativeValue(years, words.year, words.years, isPast, locale);
  }

  const months = diffInCalendarMonths(later, earlier);
  if (months >= 1) {
    if (numeric === "auto" && months === 1) {
      const natural = formatNaturalRelative("month", isPast, locale);
      if (natural !== null) return natural;
    }
    return formatRelativeValue(
      months,
      words.month,
      words.months,
      isPast,
      locale
    );
  }

  for (const unit of UNITS) {
    if (absDiff >= unit.threshold) {
      const count = Math.floor(absDiff / unit.threshold);
      if (numeric === "auto" && count === 1) {
        if (
          unit.singular === "day" ||
          unit.singular === "week"
        ) {
          const natural = formatNaturalRelative(unit.singular, isPast, locale);
          if (natural !== null) return natural;
        }
      }

      return formatRelativeValue(
        count,
        words[unit.singular],
        words[unit.plural],
        isPast,
        locale
      );
    }
  }

  return words.justNow;
}
