import type { DateInput, MonthFormat } from "../types";
import { BANGLA_MONTHS_FULL, BANGLA_MONTHS_SHORT } from "./constants";
import { toEnglishDigits } from "./digits";
import { gregorianMonthIndex } from "./months";

function makeValidDate(
  year: number,
  monthIndex: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0
): Date | null {
  const date = new Date(
    year,
    monthIndex,
    day,
    hour,
    minute,
    second,
    millisecond
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute ||
    date.getSeconds() !== second ||
    date.getMilliseconds() !== millisecond
  ) {
    return null;
  }

  return date;
}

function parseYmd(input: string): Date | null {
  const match = input.trim().match(/^(\d{4})([-/.])(\d{1,2})\2(\d{1,2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[3]);
  const day = Number(match[4]);
  return makeValidDate(year, month - 1, day);
}

function parseIsoDateTime(input: string): Date | null {
  const match = input
    .trim()
    .match(
      /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?(Z|[+-]\d{2}:?\d{2})?)$/
    );
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4] ?? 0);
  const minute = Number(match[5] ?? 0);
  const second = Number(match[6] ?? 0);
  const millisecond = Number((match[7] ?? "0").padEnd(3, "0").slice(0, 3));
  const timezone = match[8];

  if (timezone === undefined) {
    return makeValidDate(
      year,
      month - 1,
      day,
      hour,
      minute,
      second,
      millisecond
    );
  }

  const offsetMatch = timezone.match(/^([+-])(\d{2}):?(\d{2})$/);
  const offsetHours = offsetMatch ? Number(offsetMatch[2]) : null;
  const offsetMins = offsetMatch ? Number(offsetMatch[3]) : null;
  const isValidOffset =
    offsetHours !== null &&
    offsetMins !== null &&
    offsetHours <= 23 &&
    offsetMins <= 59;
  const offsetMinutes =
    timezone === "Z"
      ? 0
      : offsetMatch && isValidOffset
        ? (offsetMatch[1] === "+" ? 1 : -1) * (offsetHours * 60 + offsetMins)
        : null;

  if (offsetMinutes === null) return null;

  const utcMs =
    Date.UTC(year, month - 1, day, hour, minute, second, millisecond) -
    offsetMinutes * 60_000;
  const date = new Date(utcMs);
  const normalized = new Date(utcMs + offsetMinutes * 60_000);

  if (
    normalized.getUTCFullYear() !== year ||
    normalized.getUTCMonth() !== month - 1 ||
    normalized.getUTCDate() !== day ||
    normalized.getUTCHours() !== hour ||
    normalized.getUTCMinutes() !== minute ||
    normalized.getUTCSeconds() !== second ||
    normalized.getUTCMilliseconds() !== millisecond
  ) {
    return null;
  }

  return date;
}

function parseDmy(input: string): Date | null {
  const match = input.match(
    /^(\d{1,2})(?:st|nd|rd|th)?(?:\s+|-)(\S+)(?:\s+|-)(\d{2,4})$/
  );
  if (!match) return null;

  const day = Number(match[1]);
  const monthName = match[2]!.replace(/,$/, "");
  const yearRaw = match[3]!;

  const monthIndex = gregorianMonthIndex(monthName);
  if (monthIndex === -1) return null;

  let year = Number(yearRaw);
  if (yearRaw.length === 2) {
    year += year >= 50 ? 1900 : 2000;
  }

  return makeValidDate(year, monthIndex, day);
}

function parseMonthDate(input: string): Date | null {
  const match = input.match(
    /^(\S+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,)?\s+(\d{2,4})$/
  );
  if (!match) return null;

  const monthName = match[1]!.replace(/,$/, "");
  const day = Number(match[2]);
  const yearRaw = match[3]!;
  const monthIndex = gregorianMonthIndex(monthName);

  if (monthIndex === -1) return null;

  let year = Number(yearRaw);
  if (yearRaw.length === 2) {
    year += year >= 50 ? 1900 : 2000;
  }

  return makeValidDate(year, monthIndex, day);
}

export function parseDateString(input: string): Date | null {
  return (
    parseYmd(input) ??
    parseIsoDateTime(input) ??
    parseDmy(input) ??
    parseMonthDate(input)
  );
}

export function toDate(input: DateInput): Date {
  if (input instanceof Date) {
    const time = input.getTime();
    if (Number.isNaN(time)) {
      throw new Error(`Invalid date input: ${String(input)}`);
    }
    return new Date(time);
  }

  if (typeof input === "number") {
    if (!Number.isFinite(input)) {
      throw new Error(`Invalid date input: ${String(input)}`);
    }

    const date = new Date(input);
    if (Number.isNaN(date.getTime())) {
      throw new Error(`Invalid date input: ${String(input)}`);
    }
    return date;
  }

  const normalized = toEnglishDigits(input).trim();
  const parsed = parseDateString(normalized);
  if (!parsed) {
    throw new Error(`Invalid date input: ${String(input)}`);
  }
  return parsed;
}

export function isToday(input: DateInput): boolean {
  const date = toDate(input);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function isYesterday(input: DateInput): boolean {
  const date = toDate(input);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

export function isTomorrow(input: DateInput): boolean {
  const date = toDate(input);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  );
}

export function startOfDay(input: DateInput): Date {
  const date = toDate(input);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function endOfDay(input: DateInput): Date {
  const date = toDate(input);
  date.setHours(23, 59, 59, 999);
  return date;
}

export function addDays(input: DateInput, days: number): Date {
  const date = toDate(input);
  date.setDate(date.getDate() + days);
  return date;
}

export function subDays(input: DateInput, days: number): Date {
  return addDays(input, -days);
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function addMonths(input: DateInput, months: number): Date {
  const date = toDate(input);
  const year = date.getFullYear();
  const monthIndex = date.getMonth() + months;
  const targetYear = year + Math.floor(monthIndex / 12);
  const targetMonth = ((monthIndex % 12) + 12) % 12;
  const targetDay = Math.min(
    date.getDate(),
    daysInMonth(targetYear, targetMonth)
  );

  date.setFullYear(targetYear, targetMonth, targetDay);
  return date;
}

export function subMonths(input: DateInput, months: number): Date {
  return addMonths(input, -months);
}

export function addYears(input: DateInput, years: number): Date {
  const date = toDate(input);
  const targetYear = date.getFullYear() + years;
  const targetDay = Math.min(
    date.getDate(),
    daysInMonth(targetYear, date.getMonth())
  );

  date.setFullYear(targetYear, date.getMonth(), targetDay);
  return date;
}

export function subYears(input: DateInput, years: number): Date {
  return addYears(input, -years);
}

export function startOfMonth(input: DateInput): Date {
  const date = toDate(input);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function endOfMonth(input: DateInput): Date {
  const date = toDate(input);
  date.setMonth(date.getMonth() + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

export function startOfYear(input: DateInput): Date {
  const date = toDate(input);
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function endOfYear(input: DateInput): Date {
  const date = toDate(input);
  date.setMonth(11, 31);
  date.setHours(23, 59, 59, 999);
  return date;
}

export function getBanglaMonth(
  month: number,
  format: MonthFormat = "long"
): string {
  const index = month - 1;
  if (index < 0 || index > 11) {
    throw new Error(`Invalid month number: ${month}. Must be 1-12.`);
  }
  return format === "short"
    ? BANGLA_MONTHS_SHORT[index]!
    : BANGLA_MONTHS_FULL[index]!;
}
