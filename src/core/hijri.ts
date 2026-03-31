import type {
  DateInput,
  HijriCalendarDate,
  HijriCalendarDateLocalized,
  HijriCalendarOptions
} from "../types";
import { toBanglaDigits, toEnglishDigits } from "./digits";
import { toDate } from "./utils";

const HIJRI_CALENDAR = "islamic-umalqura";

function hijriLocale(locale: "en-BD" | "bn-BD"): string {
  return `${locale}-u-ca-${HIJRI_CALENDAR}`;
}

type DateTimePartType = Intl.DateTimeFormatPart["type"];

function getPart(
  parts: Intl.DateTimeFormatPart[],
  type: DateTimePartType
): string {
  const part = parts.find((entry) => entry.type === type);
  if (part === undefined) {
    throw new Error(`Missing ${type} part while formatting Hijri date.`);
  }
  return part.value;
}

function formatHijriParts(
  date: Date,
  locale: "en-BD" | "bn-BD"
): {
  day: string;
  month: string;
  monthIndex: number;
  year: string;
} {
  const intlLocale = hijriLocale(locale);
  const numericParts = new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).formatToParts(date);
  const monthParts = new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).formatToParts(date);

  const day = getPart(numericParts, "day");
  const month = getPart(monthParts, "month");
  const monthIndex = Number(toEnglishDigits(getPart(numericParts, "month")));
  const year = getPart(numericParts, "year");

  return { day, month, monthIndex, year };
}

export function toHijriCalendar(
  input: DateInput,
  options: HijriCalendarOptions & { locale: "bn-BD" }
): HijriCalendarDateLocalized;
export function toHijriCalendar(
  input: DateInput,
  options?: HijriCalendarOptions
): HijriCalendarDate;
export function toHijriCalendar(
  input: DateInput,
  options?: HijriCalendarOptions
): HijriCalendarDate | HijriCalendarDateLocalized {
  const locale = options?.locale ?? "en-BD";
  const date = toDate(input);
  const parts = formatHijriParts(date, locale);

  if (locale === "bn-BD") {
    return {
      day: toBanglaDigits(parts.day),
      month: parts.month,
      monthIndex: parts.monthIndex,
      year: toBanglaDigits(parts.year)
    };
  }

  return {
    day: Number(toEnglishDigits(parts.day)),
    month: parts.month,
    monthIndex: parts.monthIndex,
    year: Number(toEnglishDigits(parts.year))
  };
}
