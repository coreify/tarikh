export type Locale = "en-BD" | "bn-BD";
export type Language = "en" | "bn";
export type MonthFormat = "short" | "long";
export type YearFormat = "numeric" | "2-digit";
export type DayFormat = "numeric" | "2-digit";
export type WeekdayFormat = "short" | "long";
export type TimeFormat = "numeric" | "2-digit";
export type FormatMode = "standard" | "bangla" | "hijri" | "hybrid";
export const HIJRI_TIME_ZONES = ["Asia/Dhaka", "UTC"] as const;
export type HijriTimeZone = (typeof HIJRI_TIME_ZONES)[number];

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

export type PatternFormatOptions = {
  pattern: string;
  locale?: Locale;
  mode?: never;
};

export type StandardFormatOptions = DateFormatOptions & {
  mode: "standard";
  pattern?: never;
};

export type BanglaFormatOptions = BanglaCalendarFormatOptions & {
  mode: "bangla";
  pattern?: never;
};

export type HijriFormatOptions = HijriCalendarFormatOptions & {
  mode: "hijri";
  pattern?: never;
};

export type HybridFormatOptions = HybridDateFormatOptions & {
  mode: "hybrid";
  pattern?: never;
};

export type FormatOptions =
  | PatternFormatOptions
  | StandardFormatOptions
  | BanglaFormatOptions
  | HijriFormatOptions
  | HybridFormatOptions;

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

export interface HijriCalendarOptions {
  locale?: Locale;
  timeZone?: HijriTimeZone;
}

export interface HijriCalendarDate {
  day: number;
  month: string;
  monthIndex: number;
  year: number;
}

export interface HijriCalendarDateLocalized {
  day: string;
  month: string;
  monthIndex: number;
  year: string;
}

export interface HijriCalendarFormatOptions {
  locale?: Locale;
  timeZone?: HijriTimeZone;
}

export type BanglaCalendarDayFormat = "ordinal" | "spoken";
export type BanglaCalendarDaySpokenVariant = "pohela" | "poyla";

export interface BanglaDayFormatOptions {
  format?: BanglaCalendarDayFormat;
  variant?: BanglaCalendarDaySpokenVariant;
}
