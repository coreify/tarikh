import type { ParseDateOptions, TarikhDateInput } from "../types";
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
import { parseDateString } from "./utils";

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

/** Alternate Latin transliterations still accepted by `parseDate`. */
const BANGLA_CALENDAR_EN_ALIASES: Readonly<Record<string, number>> = {
  baishakh: 1,
  boishakh: 1,
  jaishtho: 2,
  joishtho: 2,
  jyoishtho: 2,
  ashar: 3,
  asadh: 3,
  asharh: 3,
  srabon: 4,
  shraban: 4,
  shrabon: 4,
  bhadro: 5,
  ashin: 6,
  ashwin: 6,
  ashshin: 6,
  kartik: 7,
  ograyon: 8,
  ogrohayon: 8,
  ograhayon: 8,
  agrahayan: 8,
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

function findBanglaCalendarMonthIndex(name: string): number {
  const lower = name.toLowerCase();

  for (let i = 0; i < BANGLA_CALENDAR_MONTHS.length; i++) {
    if (BANGLA_CALENDAR_MONTHS[i] === name) return i + 1;
  }
  for (let i = 0; i < BANGLA_CALENDAR_MONTHS_EN.length; i++) {
    if (BANGLA_CALENDAR_MONTHS_EN[i]!.toLowerCase() === lower) return i + 1;
  }
  const alias = BANGLA_CALENDAR_EN_ALIASES[lower];
  if (alias !== undefined) return alias;
  return -1;
}

function parseBanglaCalendarDayToken(token: string): number | null {
  const spoken = {
    পহেলা: 1,
    পয়লা: 1,
    দোসরা: 2,
    তেসরা: 3,
    চৌঠা: 4
  } as const;

  const spokenDay = spoken[token as keyof typeof spoken];
  if (spokenDay !== undefined) return spokenDay;

  const ordinalMatch = token.match(/^(\d{1,2})(?:লা|রা|ঠা|ই|শে)$/);
  if (ordinalMatch) return Number(ordinalMatch[1]);

  const plain = Number(token);
  if (Number.isInteger(plain) && plain >= 1 && plain <= 31) return plain;

  return null;
}

function parseDateOnlyString(input: string): Date | null {
  const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
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

export function parseDate(
  input: TarikhDateInput,
  options?: ParseDateOptions
): Date | null {
  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : new Date(input.getTime());
  }

  if (typeof input === "number") {
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const normalized = toEnglishDigits(input).trim();

  if (options?.calendar === "bangla") {
    return parseBanglaCalendar(normalized);
  }

  const parsed = parseDateString(normalized);
  if (parsed) return parsed;

  // Try "DD Month YYYY" pattern
  return parseDMY(normalized);
}

function parseBanglaCalendar(normalized: string): Date | null {
  const match = normalized.match(/^(\S+)\s+(\S+)\s+(\d{4})$/);
  if (!match) return null;

  const day = parseBanglaCalendarDayToken(match[1]!);
  if (day === null) return null;

  const monthIndex = findBanglaCalendarMonthIndex(match[2]!);
  if (monthIndex === -1) return null;

  const year = Number(match[3]);
  try {
    return fromBanglaCalendar(day, monthIndex, year);
  } catch {
    return null;
  }
}

function parseDMY(normalized: string): Date | null {
  const match = normalized.match(/^(\d{1,2})\s+(\S+)\s+(\d{2,4})$/);
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
