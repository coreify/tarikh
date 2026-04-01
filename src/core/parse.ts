import type {
  DateInput,
  DateParseDetailedResult,
  DateParseFailureReason,
  DateParseFormat,
  DateParseOptions
} from "../types";
import { fromBanglaCalendar } from "./calendar";
import {
  BANGLA_CALENDAR_MONTHS,
  BANGLA_CALENDAR_MONTHS_EN,
  BANGLA_MONTHS_FULL,
  BANGLA_MONTHS_SHORT,
  ENGLISH_MONTHS_FULL,
  ENGLISH_MONTHS_SHORT
} from "./constants";
import { toEnglishDigits } from "./digits";
import { gregorianMonthIndex } from "./months";
import { parseDateString } from "./utils";

const BANGLA_CALENDAR_EN_ALIASES: Readonly<Record<string, number>> = {
  baishakh: 1,
  boishakh: 1,
  boishak: 1,
  boisakh: 1,
  jaishtho: 2,
  jaishtha: 2,
  jaistha: 2,
  joishtho: 2,
  jyoishtho: 2,
  jyoistho: 2,
  jyeshtho: 2,
  ashar: 3,
  asadh: 3,
  asharh: 3,
  srabon: 4,
  shraban: 4,
  shrabon: 4,
  sraban: 4,
  bhadro: 5,
  ashin: 6,
  ashwin: 6,
  ashshin: 6,
  kartik: 7,
  ograyon: 8,
  ograyan: 8,
  ogrohayon: 8,
  ograhayon: 8,
  agrahayan: 8,
  aghrayan: 8,
  pous: 9,
  poush: 9,
  mag: 10,
  magh: 10,
  falgoon: 11,
  falgun: 11,
  choitra: 12,
  chaitra: 12,
  choitro: 12
};

const BANGLA_CALENDAR_BN_ALIASES: Readonly<Record<string, number>> = {
  বৈশাখ: 1,
  জ্যৈষ্ঠ: 2,
  জৈষ্ঠ: 2,
  আষাঢ়: 3,
  আষাঢ: 3,
  শ্রাবণ: 4,
  ভাদ্র: 5,
  আশ্বিন: 6,
  কার্তিক: 7,
  অগ্রহায়ণ: 8,
  অগ্রহায়ণ: 8,
  অঘ্রাণ: 8,
  অগ্রায়ণ: 8,
  অগ্রায়ণ: 8,
  পৌষ: 9,
  পৌস: 9,
  মাঘ: 10,
  ফাল্গুন: 11,
  চৈত্র: 12
};

const GREGORIAN_YMD_PATTERN = /^([+-]\d{6}|\d{4})([-/.])(\d{1,2})\2(\d{1,2})$/;
const STRICT_GREGORIAN_YMD_PATTERN =
  /^([+-]\d{6}|\d{4})([-/.])(\d{2})\2(\d{2})$/;
const GREGORIAN_ISO_PATTERN =
  /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?(Z|[+-]\d{2}:?\d{2})?)$/;
const GREGORIAN_DMY_PATTERN =
  /^(\d{1,2})(?:st|nd|rd|th|লা|রা|ঠা|ই|শে)?(?:\s+|-)(\S+)(?:\s+|-)([+-]\d{6}|\d{4}|\d{2})$/i;
const STRICT_GREGORIAN_DMY_PATTERN =
  /^(\d{1,2})(?:st|nd|rd|th|লা|রা|ঠা|ই|শে)?(?:\s+|-)(\S+)(?:\s+|-)([+-]\d{6}|\d{4})$/i;
const GREGORIAN_MONTH_FIRST_PATTERN =
  /^(\S+)\s+(\d{1,2})(?:st|nd|rd|th|লা|রা|ঠা|ই|শে)?(?:,)?\s+([+-]\d{6}|\d{4}|\d{2})$/i;
const STRICT_GREGORIAN_MONTH_FIRST_PATTERN =
  /^(\S+)\s+(\d{1,2})(?:st|nd|rd|th|লা|রা|ঠা|ই|শে)?(?:,)?\s+([+-]\d{6}|\d{4})$/i;

function banglaMonthIndexLoose(name: string): number {
  const lower = name.toLowerCase();

  for (let i = 0; i < BANGLA_CALENDAR_MONTHS.length; i += 1) {
    if (BANGLA_CALENDAR_MONTHS[i] === name) return i + 1;
  }

  const banglaAlias = BANGLA_CALENDAR_BN_ALIASES[name];
  if (banglaAlias !== undefined) return banglaAlias;

  for (let i = 0; i < BANGLA_CALENDAR_MONTHS_EN.length; i += 1) {
    if (BANGLA_CALENDAR_MONTHS_EN[i]!.toLowerCase() === lower) return i + 1;
  }

  const alias = BANGLA_CALENDAR_EN_ALIASES[lower];
  if (alias !== undefined) return alias;

  return -1;
}

function banglaMonthIndexStrict(name: string): number {
  for (let i = 0; i < BANGLA_CALENDAR_MONTHS.length; i += 1) {
    if (BANGLA_CALENDAR_MONTHS[i] === name) return i + 1;
  }

  const lower = name.toLowerCase();
  for (let i = 0; i < BANGLA_CALENDAR_MONTHS_EN.length; i += 1) {
    if (BANGLA_CALENDAR_MONTHS_EN[i]!.toLowerCase() === lower) return i + 1;
  }

  return -1;
}

function gregorianMonthIndexStrict(name: string): number {
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  for (let i = 0; i < ENGLISH_MONTHS_FULL.length; i += 1) {
    if (ENGLISH_MONTHS_FULL[i]!.toLowerCase() === lower) return i;
  }

  for (let i = 0; i < ENGLISH_MONTHS_SHORT.length; i += 1) {
    if (ENGLISH_MONTHS_SHORT[i]!.toLowerCase() === lower) return i;
  }

  for (let i = 0; i < BANGLA_MONTHS_FULL.length; i += 1) {
    if (BANGLA_MONTHS_FULL[i] === trimmed) return i;
  }

  for (let i = 0; i < BANGLA_MONTHS_SHORT.length; i += 1) {
    if (BANGLA_MONTHS_SHORT[i] === trimmed) return i;
  }

  return -1;
}

function parseBanglaCalendarDayToken(token: string): number | null {
  const spoken = {
    পহেলা: 1,
    পয়লা: 1,
    পয়লা: 1,
    দোসরা: 2,
    তেসরা: 3,
    চৌঠা: 4
  } as const;

  const spokenDay = spoken[token as keyof typeof spoken];
  if (spokenDay !== undefined) return spokenDay;

  const ordinalMatch = token.match(/^(\d{1,2})(?:লা|রা|ঠা|ই|শে)$/);
  if (ordinalMatch) return Number(ordinalMatch[1]);

  const englishOrdinalMatch = token.match(/^(\d{1,2})(?:st|nd|rd|th)$/i);
  if (englishOrdinalMatch) return Number(englishOrdinalMatch[1]);

  const plain = Number(token);
  if (Number.isInteger(plain) && plain >= 1 && plain <= 31) return plain;

  return null;
}

function success(
  input: DateInput,
  normalizedInput: string | number | null,
  calendar: "gregorian" | "bangla",
  strict: boolean,
  format: DateParseFormat,
  date: Date
): DateParseDetailedResult {
  return {
    success: true,
    input,
    normalizedInput,
    calendar,
    strict,
    format,
    date
  };
}

function failure(
  input: DateInput,
  normalizedInput: string | number | null,
  calendar: "gregorian" | "bangla",
  strict: boolean,
  reason: DateParseFailureReason,
  message: string
): DateParseDetailedResult {
  return {
    success: false,
    input,
    normalizedInput,
    calendar,
    strict,
    reason,
    message,
    date: null
  };
}

function inferGregorianFormatLoose(input: string): DateParseFormat | null {
  if (GREGORIAN_YMD_PATTERN.test(input)) {
    return "ymd";
  }

  if (GREGORIAN_ISO_PATTERN.test(input)) {
    return "iso_datetime";
  }

  const dmy = input.match(GREGORIAN_DMY_PATTERN);
  if (dmy && gregorianMonthIndex(dmy[2]!.replace(/,$/, "")) !== -1) {
    return "day_month_year";
  }

  const monthFirst = input.match(GREGORIAN_MONTH_FIRST_PATTERN);
  if (
    monthFirst &&
    gregorianMonthIndex(monthFirst[1]!.replace(/,$/, "")) !== -1
  ) {
    return "month_day_year";
  }

  return null;
}

function inferGregorianFormatStrict(input: string): DateParseFormat | null {
  if (STRICT_GREGORIAN_YMD_PATTERN.test(input)) {
    return "ymd";
  }

  if (GREGORIAN_ISO_PATTERN.test(input)) {
    return "iso_datetime";
  }

  const dmy = input.match(STRICT_GREGORIAN_DMY_PATTERN);
  if (dmy && gregorianMonthIndexStrict(dmy[2]!.replace(/,$/, "")) !== -1) {
    return "day_month_year";
  }

  const monthFirst = input.match(STRICT_GREGORIAN_MONTH_FIRST_PATTERN);
  if (
    monthFirst &&
    gregorianMonthIndexStrict(monthFirst[1]!.replace(/,$/, "")) !== -1
  ) {
    return "month_day_year";
  }

  return null;
}

function parseGregorianDetailed(
  input: DateInput,
  normalized: string,
  strict: boolean
): DateParseDetailedResult {
  const format = strict
    ? inferGregorianFormatStrict(normalized)
    : inferGregorianFormatLoose(normalized);

  if (format === null) {
    if (strict) {
      const looseFormat = inferGregorianFormatLoose(normalized);
      if (looseFormat !== null && parseDateString(normalized) !== null) {
        return failure(
          input,
          normalized,
          "gregorian",
          true,
          "strict_mismatch",
          "Input matches a supported loose Gregorian format but fails strict parsing."
        );
      }
    }

    return failure(
      input,
      normalized,
      "gregorian",
      strict,
      "invalid_string",
      "Input does not match a supported Gregorian date format."
    );
  }

  const date = parseDateString(normalized);
  if (date === null) {
    return failure(
      input,
      normalized,
      "gregorian",
      strict,
      "invalid_string",
      "Input matches a Gregorian date shape but is not a valid calendar date."
    );
  }

  return success(input, normalized, "gregorian", strict, format, date);
}

function parseBanglaCalendarDetailed(
  input: DateInput,
  normalized: string,
  strict: boolean
): DateParseDetailedResult {
  const match = normalized.match(/^(\S+),?\s+(\S+),?\s+(\d+)$/);
  if (!match) {
    return failure(
      input,
      normalized,
      "bangla",
      strict,
      "invalid_string",
      "Input does not match a supported Bangla calendar date format."
    );
  }

  const day = parseBanglaCalendarDayToken(match[1]!.replace(/,$/, ""));
  if (day === null) {
    return failure(
      input,
      normalized,
      "bangla",
      strict,
      "invalid_string",
      "Bangla calendar day is invalid."
    );
  }

  const monthName = match[2]!.replace(/,$/, "");
  const monthIndex = strict
    ? banglaMonthIndexStrict(monthName)
    : banglaMonthIndexLoose(monthName);

  if (monthIndex === -1) {
    if (!strict) {
      return failure(
        input,
        normalized,
        "bangla",
        false,
        "invalid_string",
        "Bangla calendar month is invalid."
      );
    }

    if (banglaMonthIndexLoose(monthName) !== -1) {
      return failure(
        input,
        normalized,
        "bangla",
        true,
        "strict_mismatch",
        "Input uses a legacy Bangla month alias that is rejected in strict mode."
      );
    }

    return failure(
      input,
      normalized,
      "bangla",
      true,
      "invalid_string",
      "Bangla calendar month is invalid."
    );
  }

  const year = Number(match[3]);
  try {
    return success(
      input,
      normalized,
      "bangla",
      strict,
      "bangla_calendar",
      fromBanglaCalendar(day, monthIndex, year)
    );
  } catch (error) {
    return failure(
      input,
      normalized,
      "bangla",
      strict,
      "invalid_bangla_calendar_date",
      error instanceof Error
        ? error.message
        : "Bangla calendar date is invalid."
    );
  }
}

export function parseDateDetailed(
  input: DateInput,
  options?: DateParseOptions
): DateParseDetailedResult {
  const calendar = options?.calendar ?? "gregorian";
  const strict = options?.strict ?? false;

  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) {
      return failure(
        input,
        null,
        calendar,
        strict,
        "invalid_date_object",
        "Date object is invalid."
      );
    }

    return success(
      input,
      null,
      calendar,
      strict,
      "date_object",
      new Date(input.getTime())
    );
  }

  if (typeof input === "number") {
    if (!Number.isFinite(input)) {
      return failure(
        input,
        input,
        calendar,
        strict,
        "invalid_timestamp",
        "Timestamp is invalid."
      );
    }

    const date = new Date(input);
    if (Number.isNaN(date.getTime())) {
      const isOutOfRange = Math.abs(input) > 8_640_000_000_000_000;
      return failure(
        input,
        input,
        calendar,
        strict,
        isOutOfRange ? "out_of_range" : "invalid_timestamp",
        isOutOfRange
          ? "Timestamp is outside the supported Date range."
          : "Timestamp is invalid."
      );
    }

    return success(input, input, calendar, strict, "timestamp", date);
  }

  const normalized = toEnglishDigits(input).trim();
  if (normalized.length === 0) {
    return failure(
      input,
      normalized,
      calendar,
      strict,
      "invalid_string",
      "Input is empty."
    );
  }

  if (calendar === "bangla") {
    return parseBanglaCalendarDetailed(input, normalized, strict);
  }

  return parseGregorianDetailed(input, normalized, strict);
}

export function parseDate(
  input: DateInput,
  options?: DateParseOptions
): Date | null {
  const result = parseDateDetailed(input, options);
  return result.success ? result.date : null;
}
