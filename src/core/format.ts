import type {
  BanglaCalendarDaySpokenVariant,
  BanglaCalendarDayFormat,
  FormatBanglaCalendarDayOptions,
  FormatBanglaCalendarOptions,
  FormatDateOptions,
  FormatOptions,
  HybridFormatOptions,
  TarikhDateInput
} from "../types";
import { toBanglaCalendar } from "./calendar";
import {
  BANGLA_CALENDAR_MONTHS,
  BANGLA_MONTHS_FULL,
  BANGLA_MONTHS_SHORT,
  BANGLA_WEEKDAYS_FULL,
  BANGLA_WEEKDAYS_SHORT,
  ENGLISH_MONTHS_FULL,
  ENGLISH_MONTHS_SHORT,
  ENGLISH_WEEKDAYS_FULL,
  ENGLISH_WEEKDAYS_SHORT
} from "./constants";
import { toBanglaDigits } from "./digits";
import { toDate } from "./utils";

function formatBanglaCalendarDayOrdinal(day: number): string {
  const digits = toBanglaDigits(day);

  if (day === 1) return `${digits}লা`;
  if (day === 2 || day === 3) return `${digits}রা`;
  if (day === 4) return `${digits}ঠা`;
  if (day >= 19) return `${digits}শে`;
  return `${digits}ই`;
}

function formatBanglaCalendarDaySpokenRaw(
  day: number,
  variant: "pohela" | "poyla" = "pohela"
): string {
  switch (day) {
    case 1:
      return variant === "poyla" ? "পয়লা" : "পহেলা";
    case 2:
      return "দোসরা";
    case 3:
      return "তেসরা";
    case 4:
      return "চৌঠা";
    default:
      return formatBanglaCalendarDayOrdinal(day);
  }
}

export function formatBanglaCalendarDay(
  day: number,
  options?: FormatBanglaCalendarDayOptions
): string {
  const dayStyle: BanglaCalendarDayFormat =
    options?.format ?? "ordinal";

  if (dayStyle === "spoken") {
    return formatBanglaCalendarDaySpokenRaw(day, options?.variant);
  }

  return formatBanglaCalendarDayOrdinal(day);
}

function formatNumericValue(value: number, format: "numeric" | "2-digit"): string {
  return format === "2-digit" ? String(value).padStart(2, "0") : String(value);
}

function getMeridiem(hours24: number, locale: "en-BD" | "bn-BD", lowercase: boolean): string {
  if (locale === "bn-BD") {
    return hours24 < 12 ? "পূর্বাহ্ণ" : "অপরাহ্ণ";
  }

  const meridiem = hours24 < 12 ? "AM" : "PM";
  return lowercase ? meridiem.toLowerCase() : meridiem;
}

export function formatDate(
  input: TarikhDateInput,
  options?: FormatDateOptions
): string {
  const date = toDate(input);
  const locale = options?.locale ?? "en-BD";
  const monthFmt = options?.month ?? "short";
  const yearFmt = options?.year ?? "numeric";
  const dayFmt = options?.day ?? "numeric";
  const weekdayFmt = options?.weekday;
  const hourFmt = options?.hour;
  const minuteFmt = options?.minute;
  const secondFmt = options?.second;
  const includeTime =
    hourFmt !== undefined || minuteFmt !== undefined || secondFmt !== undefined;
  const isBn = locale === "bn-BD";

  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();

  const dayStr = dayFmt === "2-digit" ? String(d).padStart(2, "0") : String(d);

  const monthNames = isBn
    ? monthFmt === "short"
      ? BANGLA_MONTHS_SHORT
      : BANGLA_MONTHS_FULL
    : monthFmt === "short"
      ? ENGLISH_MONTHS_SHORT
      : ENGLISH_MONTHS_FULL;
  const monthStr = monthNames[m]!;

  const yearStr =
    yearFmt === "2-digit" ? String(y).slice(-2) : String(y);

  const datePart = `${dayStr} ${monthStr} ${yearStr}`;
  const weekdayNames = isBn
    ? weekdayFmt === "short"
      ? BANGLA_WEEKDAYS_SHORT
      : BANGLA_WEEKDAYS_FULL
    : weekdayFmt === "short"
      ? ENGLISH_WEEKDAYS_SHORT
      : ENGLISH_WEEKDAYS_FULL;
  const weekdayPart =
    weekdayFmt !== undefined ? `${weekdayNames[date.getDay()]!}, ` : "";

  let timePart = "";
  if (includeTime) {
    const useHour12 = options?.hour12 ?? false;
    const hours24 = date.getHours();
    const hours = useHour12 ? ((hours24 % 12) || 12) : hours24;
    const resolvedHourFmt = hourFmt ?? "numeric";
    const resolvedMinuteFmt =
      minuteFmt ?? (secondFmt !== undefined ? "2-digit" : undefined);
    const hourStr = formatNumericValue(hours, resolvedHourFmt);
    const minuteStr =
      resolvedMinuteFmt !== undefined
        ? `:${formatNumericValue(date.getMinutes(), resolvedMinuteFmt)}`
        : "";
    const secondStr =
      secondFmt !== undefined
        ? `:${formatNumericValue(date.getSeconds(), secondFmt)}`
        : "";
    const meridiem = useHour12
      ? ` ${getMeridiem(hours24, locale, false)}`
      : "";

    timePart = `${hourStr}${minuteStr}${secondStr}${meridiem}`;
  }

  const result = `${weekdayPart}${datePart}${timePart ? `, ${timePart}` : ""}`;
  return isBn ? toBanglaDigits(result) : result;
}

export function format(
  input: TarikhDateInput,
  template: string,
  options?: FormatOptions
): string {
  const date = toDate(input);
  const locale = options?.locale ?? "en-BD";
  const isBn = locale === "bn-BD";

  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();

  const monthsLong = isBn ? BANGLA_MONTHS_FULL : ENGLISH_MONTHS_FULL;
  const monthsShort = isBn ? BANGLA_MONTHS_SHORT : ENGLISH_MONTHS_SHORT;
  const weekdaysLong = isBn ? BANGLA_WEEKDAYS_FULL : ENGLISH_WEEKDAYS_FULL;
  const weekdaysShort = isBn ? BANGLA_WEEKDAYS_SHORT : ENGLISH_WEEKDAYS_SHORT;
  const hours24 = date.getHours();
  const hours12 = (hours24 % 12) || 12;

  const tokens: Record<string, string> = {
    dddd: weekdaysLong[date.getDay()]!,
    ddd: weekdaysShort[date.getDay()]!,
    MMMM: monthsLong[m]!,
    MMM: monthsShort[m]!,
    MM: String(m + 1).padStart(2, "0"),
    M: String(m + 1),
    DD: String(d).padStart(2, "0"),
    D: String(d),
    HH: String(hours24).padStart(2, "0"),
    H: String(hours24),
    hh: String(hours12).padStart(2, "0"),
    h: String(hours12),
    mm: String(date.getMinutes()).padStart(2, "0"),
    m: String(date.getMinutes()),
    ss: String(date.getSeconds()).padStart(2, "0"),
    s: String(date.getSeconds()),
    A: getMeridiem(hours24, locale, false),
    a: getMeridiem(hours24, locale, true),
    YYYY: String(y),
    YY: String(y).slice(-2)
  };

  const pattern = /dddd|ddd|MMMM|MMM|MM|M|DD|D|YYYY|YY|HH|H|hh|h|mm|m|ss|s|A|a/g;
  const result = template.replace(pattern, (match) => tokens[match]!);

  return isBn ? toBanglaDigits(result) : result;
}

export function formatBanglaCalendar(
  input: TarikhDateInput,
  options?: FormatBanglaCalendarOptions
): string {
  const locale = options?.locale ?? "en-BD";
  const dayStyle: BanglaCalendarDayFormat =
    options?.format ?? "ordinal";
  const variant: BanglaCalendarDaySpokenVariant | undefined = options?.variant;
  const cal = toBanglaCalendar(input, { locale: "en-BD" });

  if (locale === "bn-BD") {
    const month = cal.monthIndex - 1;
    const dayOptions: FormatBanglaCalendarDayOptions = { format: dayStyle };
    if (variant !== undefined) {
      dayOptions.variant = variant;
    }
    return `${formatBanglaCalendarDay(cal.day, dayOptions)} ${BANGLA_CALENDAR_MONTHS[month]!} ${toBanglaDigits(cal.year)}`;
  }

  return `${cal.day} ${cal.month} ${cal.year}`;
}

export function formatHybridDate(
  input: TarikhDateInput,
  options?: HybridFormatOptions
): string {
  const date = toDate(input);
  const digitLang = options?.digits ?? "en";
  const monthLang = options?.month ?? "bn";
  const yearLang = options?.year ?? "en";
  const dayLang = options?.day ?? digitLang;
  const monthFmt = options?.monthFormat ?? "long";

  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();

  const monthNames =
    monthLang === "bn"
      ? monthFmt === "short"
        ? BANGLA_MONTHS_SHORT
        : BANGLA_MONTHS_FULL
      : monthFmt === "short"
        ? ENGLISH_MONTHS_SHORT
        : ENGLISH_MONTHS_FULL;

  const dayStr = dayLang === "bn" ? toBanglaDigits(d) : String(d);
  const monthStr = monthNames[m]!;
  const yearStr = yearLang === "bn" ? toBanglaDigits(y) : String(y);

  return `${dayStr} ${monthStr} ${yearStr}`;
}
