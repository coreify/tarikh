import type { DateInput, DateParseOptions } from "../types";
import { fromBanglaCalendar } from "./calendar";
import { BANGLA_CALENDAR_MONTHS, BANGLA_CALENDAR_MONTHS_EN } from "./constants";
import { toEnglishDigits } from "./digits";
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
  জৈষ্ঠ: 2,
  জ্যৈষ্ঠ: 2,
  আষাঢ়: 3,
  আষাঢ়: 3,
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

function banglaMonthIndex(name: string): number {
  const lower = name.toLowerCase();

  for (let i = 0; i < BANGLA_CALENDAR_MONTHS.length; i++) {
    if (BANGLA_CALENDAR_MONTHS[i] === name) return i + 1;
  }
  const banglaAlias = BANGLA_CALENDAR_BN_ALIASES[name];
  if (banglaAlias !== undefined) return banglaAlias;
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

export function parseDate(
  input: DateInput,
  options?: DateParseOptions
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

  return parseDateString(normalized);
}

function parseBanglaCalendar(normalized: string): Date | null {
  const match = normalized.match(/^(\S+),?\s+(\S+),?\s+(\d+)$/);
  if (!match) return null;

  const day = parseBanglaCalendarDayToken(match[1]!.replace(/,$/, ""));
  if (day === null) return null;

  const monthIndex = banglaMonthIndex(match[2]!.replace(/,$/, ""));
  if (monthIndex === -1) return null;

  const year = Number(match[3]);
  try {
    return fromBanglaCalendar(day, monthIndex, year);
  } catch {
    return null;
  }
}
