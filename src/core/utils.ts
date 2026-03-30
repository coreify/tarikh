import type { TarikhDateInput, TarikhMonthFormat } from "../types";
import {
  BANGLA_MONTHS_FULL,
  BANGLA_MONTHS_SHORT,
  ENGLISH_MONTHS_FULL,
  ENGLISH_MONTHS_SHORT
} from "./constants";
import { toEnglishDigits } from "./digits";

function parseDateOnlyString(input: string): Date | null {
  const match = input.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function parseIsoLikeDateTimeString(input: string): Date | null {
  const match = input
    .trim()
    .match(
      /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:?\d{2})?)$/
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
    const local = new Date(year, month - 1, day, hour, minute, second, millisecond);
    if (
      local.getFullYear() !== year ||
      local.getMonth() !== month - 1 ||
      local.getDate() !== day ||
      local.getHours() !== hour ||
      local.getMinutes() !== minute ||
      local.getSeconds() !== second ||
      local.getMilliseconds() !== millisecond
    ) {
      return null;
    }
    return local;
  }

  const offsetMatch = timezone.match(/^([+-])(\d{2}):?(\d{2})$/);
  const offsetMinutes = timezone === "Z"
    ? 0
    : offsetMatch
      ? (offsetMatch[1] === "+" ? 1 : -1) *
        (Number(offsetMatch[2]) * 60 + Number(offsetMatch[3]))
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

function findMonthIndex(name: string): number {
  const lower = name.toLowerCase();

  for (let i = 0; i < ENGLISH_MONTHS_FULL.length; i++) {
    if (ENGLISH_MONTHS_FULL[i]!.toLowerCase() === lower) return i;
  }

  for (let i = 0; i < ENGLISH_MONTHS_SHORT.length; i++) {
    if (ENGLISH_MONTHS_SHORT[i]!.toLowerCase() === lower) return i;
  }

  for (let i = 0; i < BANGLA_MONTHS_FULL.length; i++) {
    if (BANGLA_MONTHS_FULL[i] === name) return i;
  }

  for (let i = 0; i < BANGLA_MONTHS_SHORT.length; i++) {
    if (BANGLA_MONTHS_SHORT[i] === name) return i;
  }

  return -1;
}

function parseDMY(input: string): Date | null {
  const match = input.match(/^(\d{1,2})\s+(\S+)\s+(\d{2,4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const monthName = match[2]!;
  const yearRaw = match[3]!;

  const monthIndex = findMonthIndex(monthName);
  if (monthIndex === -1) return null;

  let year = Number(yearRaw);
  if (yearRaw.length === 2) {
    year += year >= 50 ? 1900 : 2000;
  }

  const date = new Date(year, monthIndex, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function parseDateString(input: string): Date | null {
  return parseDateOnlyString(input) ?? parseIsoLikeDateTimeString(input);
}

export function toDate(input: TarikhDateInput): Date {
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
  const parsed = parseDateString(normalized) ?? parseDMY(normalized);
  if (!parsed) {
    throw new Error(`Invalid date input: ${String(input)}`);
  }
  return parsed;
}

export function isToday(input: TarikhDateInput): boolean {
  const date = toDate(input);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function isYesterday(input: TarikhDateInput): boolean {
  const date = toDate(input);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

export function isTomorrow(input: TarikhDateInput): boolean {
  const date = toDate(input);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  );
}

export function startOfDay(input: TarikhDateInput): Date {
  const date = toDate(input);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function endOfDay(input: TarikhDateInput): Date {
  const date = toDate(input);
  date.setHours(23, 59, 59, 999);
  return date;
}

export function addDays(input: TarikhDateInput, days: number): Date {
  const date = toDate(input);
  date.setDate(date.getDate() + days);
  return date;
}

export function subDays(input: TarikhDateInput, days: number): Date {
  return addDays(input, -days);
}

export function getBanglaMonth(
  month: number,
  format: TarikhMonthFormat = "long"
): string {
  const index = month - 1;
  if (index < 0 || index > 11) {
    throw new Error(`Invalid month number: ${month}. Must be 1-12.`);
  }
  return format === "short"
    ? BANGLA_MONTHS_SHORT[index]!
    : BANGLA_MONTHS_FULL[index]!;
}
