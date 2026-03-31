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

function englishDayOrdinal(day: number): string {
  const mod100 = day % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${day}th`;

  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
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

function formatPatternNumericValue(
  value: number,
  locale: "en-BD" | "bn-BD",
  format: "numeric" | "2-digit"
): string {
  const formatted = formatNumericValue(value, format);
  return locale === "bn-BD" ? toBanglaDigits(formatted) : formatted;
}

function assertAllowedValue<T extends string>(
  value: string,
  allowedValues: readonly T[],
  optionLabel: string
): asserts value is T {
  if (!allowedValues.includes(value as T)) {
    throw new TypeError(`Invalid ${optionLabel}: ${value}`);
  }
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
  const monthFormat = options?.month ?? "short";
  const yearFormat = options?.year ?? "numeric";
  const dayFormat = options?.day ?? "numeric";
  const weekdayFormat = options?.weekday;
  const hourFormat = options?.hour;
  const minuteFormat = options?.minute;
  const secondFormat = options?.second;
  const shouldIncludeTime =
    hourFormat !== undefined ||
    minuteFormat !== undefined ||
    secondFormat !== undefined;
  const isBn = locale === "bn-BD";

  assertAllowedValue(
    monthFormat,
    ["short", "long"],
    "month format for standard mode"
  );
  assertAllowedValue(
    yearFormat,
    ["numeric", "2-digit"],
    "year format for standard mode"
  );
  assertAllowedValue(
    dayFormat,
    ["numeric", "2-digit"],
    "day format for standard mode"
  );
  if (weekdayFormat !== undefined) {
    assertAllowedValue(
      weekdayFormat,
      ["short", "long"],
      "weekday format for standard mode"
    );
  }
  if (hourFormat !== undefined) {
    assertAllowedValue(
      hourFormat,
      ["numeric", "2-digit"],
      "hour format for standard mode"
    );
  }
  if (minuteFormat !== undefined) {
    assertAllowedValue(
      minuteFormat,
      ["numeric", "2-digit"],
      "minute format for standard mode"
    );
  }
  if (secondFormat !== undefined) {
    assertAllowedValue(
      secondFormat,
      ["numeric", "2-digit"],
      "second format for standard mode"
    );
  }

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const dayStr =
    dayFormat === "2-digit"
      ? String(day).padStart(2, "0")
      : isBn
        ? banglaDayOrdinal(day)
        : englishDayOrdinal(day);

  const monthNames = isBn
    ? monthFormat === "short"
      ? BANGLA_MONTHS_SHORT
      : BANGLA_MONTHS_FULL
    : monthFormat === "short"
      ? ENGLISH_MONTHS_SHORT
      : ENGLISH_MONTHS_FULL;
  const monthStr = monthNames[monthIndex]!;

  const yearStr =
    yearFormat === "2-digit" ? String(year).slice(-2) : String(year);

  const datePart = `${dayStr} ${monthStr} ${yearStr}`;
  const weekdayNames = isBn
    ? weekdayFormat === "short"
      ? BANGLA_WEEKDAYS_SHORT
      : BANGLA_WEEKDAYS_FULL
    : weekdayFormat === "short"
      ? ENGLISH_WEEKDAYS_SHORT
      : ENGLISH_WEEKDAYS_FULL;
  const weekdayPart =
    weekdayFormat !== undefined ? `${weekdayNames[date.getDay()]!}, ` : "";

  let timePart = "";
  if (shouldIncludeTime) {
    const useHour12 = options?.hour12 ?? false;
    const hours24 = date.getHours();
    const hours = useHour12 ? hours24 % 12 || 12 : hours24;
    const resolvedHourFormat = hourFormat ?? "numeric";
    const resolvedMinuteFormat =
      minuteFormat ?? (secondFormat !== undefined ? "2-digit" : undefined);
    const hourStr = formatNumericValue(hours, resolvedHourFormat);
    const minuteStr =
      resolvedMinuteFormat !== undefined
        ? `:${formatNumericValue(date.getMinutes(), resolvedMinuteFormat)}`
        : "";
    const secondStr =
      secondFormat !== undefined
        ? `:${formatNumericValue(date.getSeconds(), secondFormat)}`
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
    MM: formatPatternNumericValue(monthIndex + 1, locale, "2-digit"),
    M: formatPatternNumericValue(monthIndex + 1, locale, "numeric"),
    DD: formatPatternNumericValue(day, locale, "2-digit"),
    D: formatPatternNumericValue(day, locale, "numeric"),
    HH: formatPatternNumericValue(hours24, locale, "2-digit"),
    H: formatPatternNumericValue(hours24, locale, "numeric"),
    hh: formatPatternNumericValue(hours12, locale, "2-digit"),
    h: formatPatternNumericValue(hours12, locale, "numeric"),
    mm: formatPatternNumericValue(date.getMinutes(), locale, "2-digit"),
    m: formatPatternNumericValue(date.getMinutes(), locale, "numeric"),
    ss: formatPatternNumericValue(date.getSeconds(), locale, "2-digit"),
    s: formatPatternNumericValue(date.getSeconds(), locale, "numeric"),
    A: getMeridiem(hours24, locale, false),
    a: getMeridiem(hours24, locale, true),
    YYYY: formatPatternNumericValue(year, locale, "numeric"),
    YY: formatPatternNumericValue(Number(String(year).slice(-2)), locale, "2-digit")
  };

  const pattern =
    /dddd|ddd|MMMM|MMM|MM|M|DD|D|YYYY|YY|HH|H|hh|h|mm|m|ss|s|A|a/g;

  const replaceTokens = (segment: string): string =>
    segment.replace(pattern, (match) => tokens[match]!);

  let formatted = "";
  let cursor = 0;

  while (cursor < template.length) {
    const literalStart = template.indexOf("[", cursor);
    if (literalStart === -1) {
      formatted += replaceTokens(template.slice(cursor));
      break;
    }

    formatted += replaceTokens(template.slice(cursor, literalStart));
    const literalEnd = template.indexOf("]", literalStart + 1);
    if (literalEnd === -1) {
      formatted += template.slice(literalStart);
      break;
    }

    formatted += template.slice(literalStart + 1, literalEnd);
    cursor = literalEnd + 1;
  }

  return formatted;
}

export function format(input: DateInput, options: FormatOptions): string {
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("format() expects an options object");
  }

  if ("pattern" in options && options.pattern !== undefined) {
    if ("mode" in options && options.mode !== undefined) {
      throw new TypeError(
        "Do not pass `mode` when `pattern` is provided. `pattern` formatting does not use mode."
      );
    }
    const locale =
      "locale" in options && options.locale !== undefined ? options.locale : "en-BD";
    return formatPatternCore(input, options.pattern, locale);
  }

  if (!("mode" in options) || options.mode === undefined) {
    throw new TypeError("format() expects `mode` or `pattern`");
  }

  const mode = options.mode;
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
    default:
      throw new TypeError(`Invalid format mode: ${String(mode)}`);
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

  return `${englishDayOrdinal(calendar.day)} ${calendar.month} ${calendar.year}`;
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
  const monthFormat = options?.monthFormat ?? "long";

  assertAllowedValue(digitLang, ["en", "bn"], "digits language for hybrid mode");
  assertAllowedValue(monthLang, ["en", "bn"], "month language for hybrid mode");
  assertAllowedValue(yearLang, ["en", "bn"], "year language for hybrid mode");
  assertAllowedValue(dayLang, ["en", "bn"], "day language for hybrid mode");
  assertAllowedValue(
    monthFormat,
    ["short", "long"],
    "month format for hybrid mode"
  );

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const monthNames =
    monthLang === "bn"
      ? monthFormat === "short"
        ? BANGLA_MONTHS_SHORT
        : BANGLA_MONTHS_FULL
      : monthFormat === "short"
        ? ENGLISH_MONTHS_SHORT
        : ENGLISH_MONTHS_FULL;

  const dayStr = dayLang === "bn" ? toBanglaDigits(day) : String(day);
  const monthStr = monthNames[monthIndex]!;
  const yearStr = yearLang === "bn" ? toBanglaDigits(year) : String(year);

  return `${dayStr} ${monthStr} ${yearStr}`;
}
