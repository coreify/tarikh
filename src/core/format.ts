import type {
  BanglaCalendarDaySpokenVariant,
  BanglaCalendarDayFormat,
  BanglaDayFormatOptions,
  BanglaCalendarFormatOptions,
  FormatOptions,
  DateFormatOptions,
  HybridDateFormatOptions,
  DateInput
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

function banglaDayOrdinal(day: number): string {
  const digits = toBanglaDigits(day);

  if (day === 1) return `${digits}লা`;
  if (day === 2 || day === 3) return `${digits}রা`;
  if (day === 4) return `${digits}ঠা`;
  if (day >= 19) return `${digits}শে`;
  return `${digits}ই`;
}

function banglaDaySpoken(
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
      return banglaDayOrdinal(day);
  }
}

export function formatBanglaCalendarDay(
  day: number,
  options?: BanglaDayFormatOptions
): string {
  const dayFormat: BanglaCalendarDayFormat = options?.format ?? "ordinal";

  if (dayFormat === "spoken") {
    return banglaDaySpoken(day, options?.variant);
  }

  return banglaDayOrdinal(day);
}

function formatNumericValue(
  value: number,
  format: "numeric" | "2-digit"
): string {
  return format === "2-digit" ? String(value).padStart(2, "0") : String(value);
}

function getMeridiem(
  hours24: number,
  locale: "en-BD" | "bn-BD",
  lowercase: boolean
): string {
  if (locale === "bn-BD") {
    return hours24 < 12 ? "পূর্বাহ্ণ" : "অপরাহ্ণ";
  }

  const meridiem = hours24 < 12 ? "AM" : "PM";
  return lowercase ? meridiem.toLowerCase() : meridiem;
}

function formatDateCore(
  input: DateInput,
  options?: DateFormatOptions
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

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const dayStr =
    dayFmt === "2-digit" ? String(day).padStart(2, "0") : String(day);

  const monthNames = isBn
    ? monthFmt === "short"
      ? BANGLA_MONTHS_SHORT
      : BANGLA_MONTHS_FULL
    : monthFmt === "short"
      ? ENGLISH_MONTHS_SHORT
      : ENGLISH_MONTHS_FULL;
  const monthStr = monthNames[monthIndex]!;

  const yearStr = yearFmt === "2-digit" ? String(year).slice(-2) : String(year);

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
    const hours = useHour12 ? hours24 % 12 || 12 : hours24;
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
    const meridiem = useHour12 ? ` ${getMeridiem(hours24, locale, false)}` : "";

    timePart = `${hourStr}${minuteStr}${secondStr}${meridiem}`;
  }

  const formatted = `${weekdayPart}${datePart}${timePart ? `, ${timePart}` : ""}`;
  return isBn ? toBanglaDigits(formatted) : formatted;
}

function formatPatternCore(
  input: DateInput,
  template: string,
  locale: "en-BD" | "bn-BD" = "en-BD"
): string {
  const date = toDate(input);
  const isBn = locale === "bn-BD";

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const monthsLong = isBn ? BANGLA_MONTHS_FULL : ENGLISH_MONTHS_FULL;
  const monthsShort = isBn ? BANGLA_MONTHS_SHORT : ENGLISH_MONTHS_SHORT;
  const weekdaysLong = isBn ? BANGLA_WEEKDAYS_FULL : ENGLISH_WEEKDAYS_FULL;
  const weekdaysShort = isBn ? BANGLA_WEEKDAYS_SHORT : ENGLISH_WEEKDAYS_SHORT;
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;

  const tokens: Record<string, string> = {
    dddd: weekdaysLong[date.getDay()]!,
    ddd: weekdaysShort[date.getDay()]!,
    MMMM: monthsLong[monthIndex]!,
    MMM: monthsShort[monthIndex]!,
    MM: String(monthIndex + 1).padStart(2, "0"),
    M: String(monthIndex + 1),
    DD: String(day).padStart(2, "0"),
    D: String(day),
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
    YYYY: String(year),
    YY: String(year).slice(-2)
  };

  const pattern =
    /dddd|ddd|MMMM|MMM|MM|M|DD|D|YYYY|YY|HH|H|hh|h|mm|m|ss|s|A|a/g;
  const formatted = template.replace(pattern, (match) => tokens[match]!);

  return isBn ? toBanglaDigits(formatted) : formatted;
}

export function format(input: DateInput, options: FormatOptions): string {
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("format() expects an options object");
  }

  if (options.pattern !== undefined) {
    return formatPatternCore(input, options.pattern, options.locale ?? "en-BD");
  }

  const mode = options.mode ?? "standard";
  switch (mode) {
    case "standard":
      return formatDateCore(input, options as DateFormatOptions | undefined);
    case "bangla":
      return formatBanglaCalendarCore(
        input,
        options as BanglaCalendarFormatOptions | undefined
      );
    case "hybrid":
      return formatHybridDateCore(
        input,
        options as HybridDateFormatOptions | undefined
      );
  }
}

function formatBanglaCalendarCore(
  input: DateInput,
  options?: BanglaCalendarFormatOptions
): string {
  const locale = options?.locale ?? "en-BD";
  const dayFormat: BanglaCalendarDayFormat = options?.format ?? "ordinal";
  const variant: BanglaCalendarDaySpokenVariant | undefined = options?.variant;
  const calendar = toBanglaCalendar(input, { locale: "en-BD" });

  if (locale === "bn-BD") {
    const monthIndex = calendar.monthIndex - 1;
    const dayOptions: BanglaDayFormatOptions = { format: dayFormat };
    if (variant !== undefined) {
      dayOptions.variant = variant;
    }
    return `${formatBanglaCalendarDay(calendar.day, dayOptions)} ${BANGLA_CALENDAR_MONTHS[monthIndex]!} ${toBanglaDigits(calendar.year)}`;
  }

  return `${calendar.day} ${calendar.month} ${calendar.year}`;
}

function formatHybridDateCore(
  input: DateInput,
  options?: HybridDateFormatOptions
): string {
  const date = toDate(input);
  const digitLang = options?.digits ?? "en";
  const monthLang = options?.month ?? "bn";
  const yearLang = options?.year ?? "en";
  const dayLang = options?.day ?? digitLang;
  const monthFmt = options?.monthFormat ?? "long";

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const monthNames =
    monthLang === "bn"
      ? monthFmt === "short"
        ? BANGLA_MONTHS_SHORT
        : BANGLA_MONTHS_FULL
      : monthFmt === "short"
        ? ENGLISH_MONTHS_SHORT
        : ENGLISH_MONTHS_FULL;

  const dayStr = dayLang === "bn" ? toBanglaDigits(day) : String(day);
  const monthStr = monthNames[monthIndex]!;
  const yearStr = yearLang === "bn" ? toBanglaDigits(year) : String(year);

  return `${dayStr} ${monthStr} ${yearStr}`;
}
