export type TarikhLocale = "en-BD" | "bn-BD";
export type TarikhLanguage = "en" | "bn";
export type TarikhMonthFormat = "short" | "long";
export type TarikhYearFormat = "numeric" | "2-digit";
export type TarikhDayFormat = "numeric" | "2-digit";

export type TarikhDateInput = Date | string | number;

export interface FormatDateOptions {
  locale?: TarikhLocale;
  month?: TarikhMonthFormat;
  year?: TarikhYearFormat;
  day?: TarikhDayFormat;
}

export interface FormatOptions {
  locale?: TarikhLocale;
}

export interface HybridFormatOptions {
  digits?: TarikhLanguage;
  month?: TarikhLanguage;
  year?: TarikhLanguage;
  day?: TarikhLanguage;
  monthFormat?: TarikhMonthFormat;
}

export interface FromNowOptions {
  locale?: TarikhLocale;
}

export interface ParseDateOptions {
  calendar?: "gregorian" | "bangla";
}

export interface ToBanglaCalendarOptions {
  locale?: TarikhLocale;
}

export interface BanglaCalendarDate {
  day: number;
  month: string;
  monthIndex: number;
  year: number;
}

export interface BanglaCalendarDateLocalized {
  day: string;
  month: string;
  monthIndex: number;
  year: string;
}

export interface FormatBanglaCalendarOptions {
  locale?: TarikhLocale;
  format?: BanglaCalendarDayFormat;
  variant?: BanglaCalendarDaySpokenVariant;
}

export type BanglaCalendarDayFormat = "ordinal" | "spoken";

/**
 * @deprecated Use `BanglaCalendarDayFormat`.
 *
 * Kept as an alias for compatibility.
 */
export type BanglaCalendarDayStyle = BanglaCalendarDayFormat;
export type BanglaCalendarDaySpokenVariant = "pohela" | "poyla";

export interface FormatBanglaCalendarDayOptions {
  format?: BanglaCalendarDayFormat;
  variant?: BanglaCalendarDaySpokenVariant;
}
