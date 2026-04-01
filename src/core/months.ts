import {
  BANGLA_MONTHS_FULL,
  BANGLA_MONTHS_SHORT,
  ENGLISH_MONTHS_FULL,
  ENGLISH_MONTHS_SHORT
} from "./constants";

const GREGORIAN_MONTH_ALIASES: Readonly<Record<string, number>> = {
  jan: 0,
  "jan.": 0,
  january: 0,
  "january,": 0,
  feb: 1,
  "feb.": 1,
  february: 1,
  "february,": 1,
  mar: 2,
  "mar.": 2,
  march: 2,
  "march,": 2,
  apr: 3,
  "apr.": 3,
  april: 3,
  "april,": 3,
  may: 4,
  "may,": 4,
  jun: 5,
  "jun.": 5,
  june: 5,
  "june,": 5,
  jul: 6,
  "jul.": 6,
  july: 6,
  "july,": 6,
  aug: 7,
  "aug.": 7,
  august: 7,
  "august,": 7,
  sep: 8,
  sept: 8,
  "sep.": 8,
  "sept.": 8,
  september: 8,
  "september,": 8,
  oct: 9,
  "oct.": 9,
  october: 9,
  "october,": 9,
  nov: 10,
  "nov.": 10,
  november: 10,
  "november,": 10,
  dec: 11,
  "dec.": 11,
  december: 11,
  "december,": 11,
  জানুয়ারি: 0,
  জানুয়ারি: 0,
  ফেব্রুয়ারি: 1,
  ফেব্রুয়ারি: 1,
  মার্চ: 2,
  এপ্রিল: 3,
  মে: 4,
  জুন: 5,
  জুলাই: 6,
  আগস্ট: 7,
  অগাস্ট: 7,
  সেপ্টেম্বর: 8,
  সেপ্টেম্বার: 8,
  অক্টোবর: 9,
  নভেম্বর: 10,
  নভেম্বার: 10,
  ডিসেম্বর: 11,
  ডিসেম্বার: 11
};

export function gregorianMonthIndex(name: string): number {
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();
  const alias = GREGORIAN_MONTH_ALIASES[lower];

  if (alias !== undefined) return alias;

  for (let i = 0; i < ENGLISH_MONTHS_FULL.length; i++) {
    if (ENGLISH_MONTHS_FULL[i]!.toLowerCase() === lower) return i;
  }

  for (let i = 0; i < ENGLISH_MONTHS_SHORT.length; i++) {
    if (ENGLISH_MONTHS_SHORT[i]!.toLowerCase() === lower) return i;
  }

  for (let i = 0; i < BANGLA_MONTHS_FULL.length; i++) {
    if (BANGLA_MONTHS_FULL[i] === trimmed) return i;
  }

  for (let i = 0; i < BANGLA_MONTHS_SHORT.length; i++) {
    if (BANGLA_MONTHS_SHORT[i] === trimmed) return i;
  }

  return -1;
}
