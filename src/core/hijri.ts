import type {
  DateInput,
  HijriCalendarOptions,
  HijriCalendarResult,
  HijriCalendarSystem,
  Locale
} from "../types";
import { HIJRI_TIME_ZONES } from "../types";
import { getDefaults } from "./defaults";
import { toBanglaDigits, toEnglishDigits } from "./digits";
import { toDate } from "./utils";

function hijriLocale(
  locale: "en-BD" | "bn-BD",
  hijriSystem: HijriCalendarSystem
): string {
  return `${locale}-u-ca-${hijriSystem}`;
}

function assertHijriTimeZone(
  timeZone: string
): asserts timeZone is (typeof HIJRI_TIME_ZONES)[number] {
  if (
    !HIJRI_TIME_ZONES.includes(timeZone as (typeof HIJRI_TIME_ZONES)[number])
  ) {
    throw new RangeError(
      `Unsupported Hijri time zone: ${timeZone}. Supported values: ${HIJRI_TIME_ZONES.join(", ")}`
    );
  }
}

function assertHijriSystem(
  hijriSystem: string
): asserts hijriSystem is HijriCalendarSystem {
  if (!["islamic-umalqura", "islamic-civil"].includes(hijriSystem)) {
    throw new RangeError(
      `Unsupported Hijri calendar system: ${hijriSystem}. Supported values: islamic-umalqura, islamic-civil`
    );
  }
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
  locale: "en-BD" | "bn-BD",
  timeZone: string,
  hijriSystem: HijriCalendarSystem
): {
  day: string;
  month: string;
  monthIndex: number;
  year: string;
} {
  const intlLocale = hijriLocale(locale, hijriSystem);
  const numericParts = new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone
  }).formatToParts(date);
  const monthParts = new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone
  }).formatToParts(date);

  const day = getPart(numericParts, "day");
  const month = getPart(monthParts, "month");
  const monthIndex = Number(toEnglishDigits(getPart(numericParts, "month")));
  const year = getPart(numericParts, "year");

  return { day, month, monthIndex, year };
}

export function toHijriCalendar<TLocale extends Locale | undefined = undefined>(
  input: DateInput,
  options?: HijriCalendarOptions<TLocale>
): HijriCalendarResult<TLocale> {
  const defaults = getDefaults();
  const locale = options?.locale ?? "en-BD";
  const timeZone = options?.timeZone ?? defaults.timeZone;
  const hijriSystem = options?.hijriSystem ?? defaults.hijriSystem;
  assertHijriTimeZone(timeZone);
  assertHijriSystem(hijriSystem);
  const date = toDate(input);
  const parts = formatHijriParts(date, locale, timeZone, hijriSystem);

  if (locale === "bn-BD") {
    return {
      day: toBanglaDigits(parts.day),
      month: parts.month,
      monthIndex: parts.monthIndex,
      year: toBanglaDigits(parts.year)
    } as HijriCalendarResult<TLocale>;
  }

  return {
    day: Number(toEnglishDigits(parts.day)),
    month: parts.month,
    monthIndex: parts.monthIndex,
    year: Number(toEnglishDigits(parts.year))
  } as HijriCalendarResult<TLocale>;
}
