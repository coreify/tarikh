import {
  BANGLA_MONTHS_FULL,
  BANGLA_MONTHS_SHORT,
  ENGLISH_MONTHS_FULL,
  ENGLISH_MONTHS_SHORT
} from "./constants";

export function findGregorianMonthIndex(name: string): number {
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
