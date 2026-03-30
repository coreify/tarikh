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

export function fromNow(
  input: TarikhDateInput,
  options?: FromNowOptions
): string {
  const date = toDate(input);
  const locale = options?.locale ?? "en-BD";
  const isBn = locale === "bn-BD";
  const words = isBn ? RELATIVE_TIME_BN : RELATIVE_TIME_EN;

  const diff = Date.now() - date.getTime();
  const absDiff = Math.abs(diff);
  const isPast = diff > 0;
  const now = new Date();
  const later = isPast ? now : date;
  const earlier = isPast ? date : now;

  if (absDiff < SECOND) {
    return words.justNow;
  }

  const years = diffInCalendarYears(later, earlier);
  if (years >= 1) {
    const countStr = isBn ? toBanglaDigits(years) : String(years);
    const label = years === 1 ? words.year : words.years;
    if (isBn) {
      return isPast
        ? `${countStr} ${label} ${words.ago}`
        : `${countStr} ${label} পরে`;
    }
    return isPast
      ? `${countStr} ${label} ${words.ago}`
      : `${words.in} ${countStr} ${label}`;
  }

  const months = diffInCalendarMonths(later, earlier);
  if (months >= 1) {
    const countStr = isBn ? toBanglaDigits(months) : String(months);
    const label = months === 1 ? words.month : words.months;
    if (isBn) {
      return isPast
        ? `${countStr} ${label} ${words.ago}`
        : `${countStr} ${label} পরে`;
    }
    return isPast
      ? `${countStr} ${label} ${words.ago}`
      : `${words.in} ${countStr} ${label}`;
  }

  for (const unit of UNITS) {
    if (absDiff >= unit.threshold) {
      const count = Math.floor(absDiff / unit.threshold);
      const label = count === 1 ? words[unit.singular] : words[unit.plural];
      const countStr = isBn ? toBanglaDigits(count) : String(count);

      if (isBn) {
        return isPast
          ? `${countStr} ${label} ${words.ago}`
          : `${countStr} ${label} পরে`;
      }
      return isPast
        ? `${countStr} ${label} ${words.ago}`
        : `${words.in} ${countStr} ${label}`;
    }
  }

  return words.justNow;
}
