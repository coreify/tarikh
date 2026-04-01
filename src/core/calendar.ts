import type {
  BanglaCalendarOptions,
  BanglaCalendarResult,
  DateInput,
  Locale
} from "../types";
import {
  BANGLA_CALENDAR_MONTHS,
  BANGLA_CALENDAR_MONTHS_EN,
  BANGLA_CALENDAR_MONTH_DAYS,
  BOISHAKH_START_DAY,
  BOISHAKH_START_MONTH
} from "./constants";
import { toBanglaDigits } from "./digits";
import { assertDateRange, toDate } from "./utils";

function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function isBanglaLeapYear(banglaYear: number): boolean {
  return isGregorianLeapYear(banglaYear + 594);
}

function getMonthDays(banglaYear: number): number[] {
  const days = [...BANGLA_CALENDAR_MONTH_DAYS];
  if (isBanglaLeapYear(banglaYear)) {
    days[10] = 31;
  }
  return days;
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86_400_000;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utcB - utcA) / msPerDay);
}

function validateBanglaCalendarDate(
  day: number,
  monthIndex: number,
  year: number
): number[] {
  if (
    !Number.isInteger(day) ||
    !Number.isInteger(monthIndex) ||
    !Number.isInteger(year)
  ) {
    throw new Error("Invalid Bangla calendar date.");
  }

  if (monthIndex < 1 || monthIndex > 12) {
    throw new Error("Invalid Bangla calendar month index. Must be 1-12.");
  }

  const monthDays = getMonthDays(year);
  const maxDay = monthDays[monthIndex - 1]!;
  if (day < 1 || day > maxDay) {
    throw new Error(
      `Invalid Bangla calendar day. Month ${monthIndex} of year ${year} has ${maxDay} days.`
    );
  }

  return monthDays;
}

export function toBanglaCalendar<
  TLocale extends Locale | undefined = undefined
>(
  input: DateInput,
  options?: BanglaCalendarOptions<TLocale>
): BanglaCalendarResult<TLocale> {
  const locale = options?.locale ?? "en-BD";
  const date = toDate(input);
  const gYear = date.getFullYear();
  const gMonth = date.getMonth();
  const gDay = date.getDate();

  const boishakhThisYear = new Date(
    gYear,
    BOISHAKH_START_MONTH,
    BOISHAKH_START_DAY
  );
  const isBeforeBoishakh =
    gMonth < BOISHAKH_START_MONTH ||
    (gMonth === BOISHAKH_START_MONTH && gDay < BOISHAKH_START_DAY);

  const banglaYear = isBeforeBoishakh ? gYear - 594 : gYear - 593;
  const boishakhStart = isBeforeBoishakh
    ? new Date(gYear - 1, BOISHAKH_START_MONTH, BOISHAKH_START_DAY)
    : boishakhThisYear;

  const dayOfYear = daysBetween(boishakhStart, date) + 1;
  const monthDays = getMonthDays(banglaYear);

  let remaining = dayOfYear;
  let monthIndex = 0;
  for (let i = 0; i < monthDays.length; i++) {
    const mDays = monthDays[i]!;
    if (remaining <= mDays) {
      monthIndex = i;
      break;
    }
    remaining -= mDays;
  }

  const monthIndexValue = monthIndex + 1;

  if (locale === "bn-BD") {
    return {
      day: toBanglaDigits(remaining),
      month: BANGLA_CALENDAR_MONTHS[monthIndex]!,
      monthIndex: monthIndexValue,
      year: toBanglaDigits(banglaYear)
    } as BanglaCalendarResult<TLocale>;
  }

  return {
    day: remaining,
    month: BANGLA_CALENDAR_MONTHS_EN[monthIndex]!,
    monthIndex: monthIndexValue,
    year: banglaYear
  } as BanglaCalendarResult<TLocale>;
}

export function fromBanglaCalendar(
  day: number,
  monthIndex: number,
  year: number
): Date {
  const monthDays = validateBanglaCalendarDate(day, monthIndex, year);
  const gStartYear = year + 593;
  const boishakhStart = new Date(
    gStartYear,
    BOISHAKH_START_MONTH,
    BOISHAKH_START_DAY
  );

  let totalDays = day - 1;
  for (let i = 0; i < monthIndex - 1; i++) {
    totalDays += monthDays[i]!;
  }

  const result = new Date(boishakhStart);
  result.setDate(result.getDate() + totalDays);
  return assertDateRange(
    result,
    {
      day,
      monthIndex,
      year
    },
    "fromBanglaCalendar()"
  );
}
