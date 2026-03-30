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
  ENGLISH_MONTHS_FULL,
  ENGLISH_MONTHS_SHORT
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
  const formatStyle: BanglaCalendarDayFormat =
    options?.format ?? "ordinal";

  if (formatStyle === "spoken") {
    return formatBanglaCalendarDaySpokenRaw(day, options?.variant);
  }

  return formatBanglaCalendarDayOrdinal(day);
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

  const result = `${dayStr} ${monthStr} ${yearStr}`;
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

  const tokens: Record<string, string> = {
    MMMM: monthsLong[m]!,
    MMM: monthsShort[m]!,
    MM: String(m + 1).padStart(2, "0"),
    M: String(m + 1),
    DD: String(d).padStart(2, "0"),
    D: String(d),
    YYYY: String(y),
    YY: String(y).slice(-2)
  };

  const pattern = /MMMM|MMM|MM|M|DD|D|YYYY|YY/g;
  const result = template.replace(pattern, (match) => tokens[match]!);

  return isBn ? toBanglaDigits(result) : result;
}

export function formatBanglaCalendar(
  input: TarikhDateInput,
  options?: FormatBanglaCalendarOptions
): string {
  const locale = options?.locale ?? "en-BD";
  const formatStyle: BanglaCalendarDayFormat =
    options?.format ?? "ordinal";
  const variant: BanglaCalendarDaySpokenVariant | undefined = options?.variant;
  const cal = toBanglaCalendar(input, { locale: "en-BD" });

  if (locale === "bn-BD") {
    const month = cal.monthIndex - 1;
    const dayOptions: FormatBanglaCalendarDayOptions = { format: formatStyle };
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
