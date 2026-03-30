export const ENGLISH_DIGITS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9"
] as const;

export const BANGLA_DIGITS = [
  "০",
  "১",
  "২",
  "৩",
  "৪",
  "৫",
  "৬",
  "৭",
  "৮",
  "৯"
] as const;

export const ENGLISH_MONTHS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
] as const;

export const ENGLISH_MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
] as const;

export const BANGLA_MONTHS_FULL = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর"
] as const;

export const BANGLA_MONTHS_SHORT = [
  "জানু",
  "ফেব্রু",
  "মার্চ",
  "এপ্রি",
  "মে",
  "জুন",
  "জুলা",
  "আগ",
  "সেপ্টে",
  "অক্টো",
  "নভে",
  "ডিসে"
] as const;

export const BANGLA_CALENDAR_MONTHS = [
  "বৈশাখ",
  "জ্যৈষ্ঠ",
  "আষাঢ়",
  "শ্রাবণ",
  "ভাদ্র",
  "আশ্বিন",
  "কার্তিক",
  "অগ্রহায়ণ",
  "পৌষ",
  "মাঘ",
  "ফাল্গুন",
  "চৈত্র"
] as const;

/** Latin-script month names (Bangladesh revised calendar), default for `toBanglaCalendar`. */
export const BANGLA_CALENDAR_MONTHS_EN = [
  "Baishakh",
  "Jaishtho",
  "Asharh",
  "Shrabon",
  "Bhadro",
  "Ashshin",
  "Kartik",
  "Agrahayan",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra"
] as const;

/** Day counts per Bengali calendar month (non-leap year). Falgun (index 10) becomes 31 in leap years. */
export const BANGLA_CALENDAR_MONTH_DAYS = [
  31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30
] as const;

/** Pohela Boishakh falls on April 14 every year (Bangladesh revised calendar). */
export const BOISHAKH_START_MONTH = 3; // April (0-indexed)
export const BOISHAKH_START_DAY = 14;

export const RELATIVE_TIME_EN = {
  second: "second",
  seconds: "seconds",
  minute: "minute",
  minutes: "minutes",
  hour: "hour",
  hours: "hours",
  day: "day",
  days: "days",
  week: "week",
  weeks: "weeks",
  month: "month",
  months: "months",
  year: "year",
  years: "years",
  ago: "ago",
  in: "in",
  justNow: "just now"
} as const;

export const RELATIVE_TIME_BN = {
  second: "সেকেন্ড",
  seconds: "সেকেন্ড",
  minute: "মিনিট",
  minutes: "মিনিট",
  hour: "ঘণ্টা",
  hours: "ঘণ্টা",
  day: "দিন",
  days: "দিন",
  week: "সপ্তাহ",
  weeks: "সপ্তাহ",
  month: "মাস",
  months: "মাস",
  year: "বছর",
  years: "বছর",
  ago: "আগে",
  in: "",
  justNow: "এইমাত্র"
} as const;
