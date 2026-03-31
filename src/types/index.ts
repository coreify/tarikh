export type Locale = "en-BD" | "bn-BD";
export type Language = "en" | "bn";
export type MonthFormat = "short" | "long";
export type YearFormat = "numeric" | "2-digit";
export type DayFormat = "numeric" | "2-digit";
export type WeekdayFormat = "short" | "long";
export type TimeFormat = "numeric" | "2-digit";
export type FormatMode = "standard" | "bangla" | "hybrid";

export type DateInput = Date | string | number;

export interface DateFormatOptions {
  locale?: Locale;
  month?: MonthFormat;
  year?: YearFormat;
  day?: DayFormat;
  weekday?: WeekdayFormat;
  hour?: TimeFormat;
  minute?: TimeFormat;
  second?: TimeFormat;
  hour12?: boolean;
}

export interface FormatOptions {
  mode?: FormatMode;
  pattern?: string;
  locale?: Locale;
  month?: MonthFormat | Language;
  year?: YearFormat | Language;
  day?: DayFormat | Language;
  weekday?: WeekdayFormat;
  hour?: TimeFormat;
  minute?: TimeFormat;
  second?: TimeFormat;
  hour12?: boolean;
  digits?: Language;
  monthFormat?: MonthFormat;
  format?: BanglaCalendarDayFormat;
  variant?: BanglaCalendarDaySpokenVariant;
}

export interface HybridDateFormatOptions {
  digits?: Language;
  month?: Language;
  year?: Language;
  day?: Language;
  monthFormat?: MonthFormat;
}

export interface RelativeTimeOptions {
  locale?: Locale;
  numeric?: "always" | "auto";
}

export interface DateParseOptions {
  calendar?: "gregorian" | "bangla";
}

export interface BanglaCalendarOptions {
  locale?: Locale;
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

export interface BanglaCalendarFormatOptions {
  locale?: Locale;
  format?: BanglaCalendarDayFormat;
  variant?: BanglaCalendarDaySpokenVariant;
}

export type BanglaCalendarDayFormat = "ordinal" | "spoken";
export type BanglaCalendarDaySpokenVariant = "pohela" | "poyla";

export interface BanglaDayFormatOptions {
  format?: BanglaCalendarDayFormat;
  variant?: BanglaCalendarDaySpokenVariant;
}
