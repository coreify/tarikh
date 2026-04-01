import type {
  DateInput,
  RelativeTimeOptions,
  RelativeTimeThresholdOptions
} from "../types";
import { RELATIVE_TIME_BN, RELATIVE_TIME_EN } from "./constants";
import { toBanglaDigits } from "./digits";
import { getDefaults } from "./defaults";
import { toDate } from "./utils";

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

interface TimeUnit {
  threshold: number;
  singular: "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
  plural:
    | "seconds"
    | "minutes"
    | "hours"
    | "days"
    | "weeks"
    | "months"
    | "years";
}

const SHORT_LABELS_EN = {
  second: "s",
  seconds: "s",
  minute: "m",
  minutes: "m",
  hour: "h",
  hours: "h",
  day: "d",
  days: "d",
  week: "wk",
  weeks: "wk",
  month: "mo",
  months: "mo",
  year: "y",
  years: "y",
  ago: "ago",
  in: "in",
  justNow: "now"
} as const;

const SHORT_LABELS_BN = {
  second: "সে.",
  seconds: "সে.",
  minute: "মি.",
  minutes: "মি.",
  hour: "ঘ.",
  hours: "ঘ.",
  day: "দিন",
  days: "দিন",
  week: "সপ্তা.",
  weeks: "সপ্তা.",
  month: "মাস",
  months: "মাস",
  year: "বছ.",
  years: "বছ.",
  ago: "আগে",
  in: "",
  justNow: "এখন"
} as const;

const DEFAULT_THRESHOLDS: Required<RelativeTimeThresholdOptions> = {
  justNow: SECOND,
  minute: MINUTE,
  hour: HOUR,
  day: DAY,
  week: WEEK,
  month: MONTH,
  year: YEAR
};

function monthDays(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function shiftMonths(date: Date, months: number): Date {
  const year = date.getFullYear();
  const month = date.getMonth() + months;
  const targetYear = year + Math.floor(month / 12);
  const targetMonth = ((month % 12) + 12) % 12;
  const targetDay = Math.min(
    date.getDate(),
    monthDays(targetYear, targetMonth)
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

function shiftYears(date: Date, years: number): Date {
  const targetYear = date.getFullYear() + years;
  const targetMonth = date.getMonth();
  const targetDay = Math.min(
    date.getDate(),
    monthDays(targetYear, targetMonth)
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

function calendarYearsDiff(later: Date, earlier: Date): number {
  let years = later.getFullYear() - earlier.getFullYear();
  const anchor = shiftYears(earlier, years);
  if (anchor > later) {
    years -= 1;
  }
  return years;
}

function calendarMonthsDiff(later: Date, earlier: Date): number {
  let months =
    (later.getFullYear() - earlier.getFullYear()) * 12 +
    (later.getMonth() - earlier.getMonth());
  const anchor = shiftMonths(earlier, months);
  if (anchor > later) {
    months -= 1;
  }
  return months;
}

function assertFiniteThreshold(
  value: number,
  label: keyof RelativeTimeThresholdOptions
): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(
      `Invalid relative time threshold for ${label}: ${value}`
    );
  }
}

function resolveThresholds(
  input?: RelativeTimeThresholdOptions
): Required<RelativeTimeThresholdOptions> {
  const thresholds = {
    ...DEFAULT_THRESHOLDS,
    ...input
  };

  assertFiniteThreshold(thresholds.justNow, "justNow");
  assertFiniteThreshold(thresholds.minute, "minute");
  assertFiniteThreshold(thresholds.hour, "hour");
  assertFiniteThreshold(thresholds.day, "day");
  assertFiniteThreshold(thresholds.week, "week");
  assertFiniteThreshold(thresholds.month, "month");
  assertFiniteThreshold(thresholds.year, "year");

  const ordered: number[] = [
    thresholds.justNow,
    thresholds.minute,
    thresholds.hour,
    thresholds.day,
    thresholds.week,
    thresholds.month,
    thresholds.year
  ];

  for (let index = 1; index < ordered.length; index += 1) {
    if (ordered[index]! < ordered[index - 1]!) {
      throw new RangeError(
        "Relative time thresholds must be non-decreasing from justNow to year"
      );
    }
  }

  return thresholds;
}

function sameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function resolveLabels(locale: "en-BD" | "bn-BD", style: "long" | "short") {
  if (style === "short") {
    return locale === "bn-BD" ? SHORT_LABELS_BN : SHORT_LABELS_EN;
  }

  return locale === "bn-BD" ? RELATIVE_TIME_BN : RELATIVE_TIME_EN;
}

function relativeValue(
  count: number,
  singular: string,
  plural: string,
  isPast: boolean,
  locale: "en-BD" | "bn-BD",
  style: "long" | "short"
): string {
  const isBn = locale === "bn-BD";
  const countStr = isBn ? toBanglaDigits(count) : String(count);
  const label = count === 1 ? singular : plural;
  const countAndLabel =
    style === "short" && locale === "en-BD"
      ? `${countStr}${label}`
      : `${countStr} ${label}`;

  if (isBn) {
    return isPast ? `${countAndLabel} আগে` : `${countAndLabel} পরে`;
  }

  return isPast ? `${countAndLabel} ago` : `in ${countAndLabel}`;
}

function naturalRelative(
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

function todayWord(locale: "en-BD" | "bn-BD"): string {
  return locale === "bn-BD" ? "আজ" : "today";
}

export function fromNow(
  input: DateInput,
  options?: RelativeTimeOptions
): string {
  const defaults = getDefaults();
  const date = toDate(input);
  const locale = options?.locale ?? defaults.locale;
  const numeric = options?.numeric ?? "always";
  const style = options?.style ?? "long";
  const thresholds = resolveThresholds(options?.threshold);
  const baseDate =
    options?.baseDate === undefined ? new Date() : toDate(options.baseDate);
  const labels = resolveLabels(locale, style);

  const diff = baseDate.getTime() - date.getTime();
  const absDiff = Math.abs(diff);
  const isPast = diff > 0;
  const later = isPast ? baseDate : date;
  const earlier = isPast ? date : baseDate;

  if (absDiff < thresholds.justNow) {
    return labels.justNow;
  }

  if (numeric === "auto" && sameCalendarDay(date, baseDate)) {
    return todayWord(locale);
  }

  const years = calendarYearsDiff(later, earlier);
  if (years >= 1 && absDiff >= thresholds.year) {
    if (numeric === "auto" && years === 1) {
      const natural = naturalRelative("year", isPast, locale);
      if (natural !== null) return natural;
    }
    return relativeValue(
      years,
      labels.year,
      labels.years,
      isPast,
      locale,
      style
    );
  }

  const months = calendarMonthsDiff(later, earlier);
  if (months >= 1 && absDiff >= thresholds.month) {
    if (numeric === "auto" && months === 1) {
      const natural = naturalRelative("month", isPast, locale);
      if (natural !== null) return natural;
    }
    return relativeValue(
      months,
      labels.month,
      labels.months,
      isPast,
      locale,
      style
    );
  }

  const units: TimeUnit[] = [
    { threshold: thresholds.week, singular: "week", plural: "weeks" },
    { threshold: thresholds.day, singular: "day", plural: "days" },
    { threshold: thresholds.hour, singular: "hour", plural: "hours" },
    { threshold: thresholds.minute, singular: "minute", plural: "minutes" },
    { threshold: SECOND, singular: "second", plural: "seconds" }
  ];

  for (const unit of units) {
    if (absDiff >= unit.threshold) {
      const count = Math.floor(absDiff / unit.threshold);
      if (numeric === "auto" && count === 1) {
        if (unit.singular === "day" || unit.singular === "week") {
          const natural = naturalRelative(unit.singular, isPast, locale);
          if (natural !== null) return natural;
        }
      }

      return relativeValue(
        count,
        labels[unit.singular],
        labels[unit.plural],
        isPast,
        locale,
        style
      );
    }
  }

  return labels.justNow;
}
