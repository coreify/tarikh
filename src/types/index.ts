export type Locale = "en-BD" | "bn-BD";
export type Language = "en" | "bn";
export type MonthFormat = "short" | "long";
export type YearFormat = "numeric" | "2-digit";
export type DayFormat = "numeric" | "2-digit";
export type WeekdayFormat = "short" | "long";
export type TimeFormat = "numeric" | "2-digit";
export type StandardFormatPreset = "date" | "dateTime" | "isoLike";
export type FormatMode = "standard" | "bangla" | "hijri" | "hybrid";
export type HijriCalendarSystem = "islamic-umalqura" | "islamic-civil";

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
  preset?: StandardFormatPreset;
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

export type ResolvableFormatOptions =
  | FormatOptions
  | Omit<StandardFormatOptions, "mode">
  | Omit<BanglaFormatOptions, "mode">
  | Omit<HijriFormatOptions, "mode">
  | Omit<HybridFormatOptions, "mode">;

export interface HybridDateFormatOptions {
  digits?: Language;
  month?: Language;
  year?: Language;
  day?: Language;
  monthFormat?: MonthFormat;
}

export type RelativeTimeStyle = "long" | "short";

export interface RelativeTimeThresholdOptions {
  justNow?: number;
  minute?: number;
  hour?: number;
  day?: number;
  week?: number;
  month?: number;
  year?: number;
}

export interface RelativeTimeOptions {
  locale?: Locale;
  numeric?: "always" | "auto";
  baseDate?: DateInput;
  style?: RelativeTimeStyle;
  threshold?: RelativeTimeThresholdOptions;
}

export interface DateParseOptions {
  calendar?: "gregorian" | "bangla";
  strict?: boolean;
}

export type DateParseFormat =
  | "date_object"
  | "timestamp"
  | "ymd"
  | "iso_datetime"
  | "day_month_year"
  | "month_day_year"
  | "bangla_calendar";

export type DateParseFailureReason =
  | "invalid_date_object"
  | "invalid_timestamp"
  | "out_of_range"
  | "invalid_string"
  | "strict_mismatch"
  | "invalid_bangla_calendar_date";

export interface DateParseSuccessResult {
  success: true;
  date: Date;
  input: DateInput;
  normalizedInput: string | number | null;
  calendar: "gregorian" | "bangla";
  strict: boolean;
  format: DateParseFormat;
}

export interface DateParseFailureResult {
  success: false;
  date: null;
  input: DateInput;
  normalizedInput: string | number | null;
  calendar: "gregorian" | "bangla";
  strict: boolean;
  reason: DateParseFailureReason;
  message: string;
}

export type DateParseDetailedResult =
  | DateParseSuccessResult
  | DateParseFailureResult;

export interface GlobalDefaults {
  locale: Locale;
  mode: FormatMode;
  month?: MonthFormat | undefined;
  timeZone: HijriTimeZone;
  hijriSystem: HijriCalendarSystem;
}

export interface GlobalDefaultsInput {
  locale?: Locale | null;
  mode?: FormatMode | null;
  month?: MonthFormat | null;
  timeZone?: HijriTimeZone | null;
  hijriSystem?: HijriCalendarSystem | null;
}

export type BanglaCalendarOptions<
  TLocale extends Locale | undefined = Locale | undefined
> = {
  locale?: TLocale;
};

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

export type BanglaCalendarResult<
  TLocale extends Locale | undefined = undefined
> = TLocale extends "bn-BD"
  ? BanglaCalendarDateLocalized
  : TLocale extends "en-BD" | undefined
    ? BanglaCalendarDate
    : BanglaCalendarDate | BanglaCalendarDateLocalized;

export interface BanglaCalendarFormatOptions {
  locale?: Locale;
  format?: BanglaCalendarDayFormat;
  variant?: BanglaCalendarDaySpokenVariant;
}

export type HijriCalendarOptions<
  TLocale extends Locale | undefined = Locale | undefined
> = {
  locale?: TLocale;
  timeZone?: HijriTimeZone;
  hijriSystem?: HijriCalendarSystem;
};

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

export type HijriCalendarResult<
  TLocale extends Locale | undefined = undefined
> = TLocale extends "bn-BD"
  ? HijriCalendarDateLocalized
  : TLocale extends "en-BD" | undefined
    ? HijriCalendarDate
    : HijriCalendarDate | HijriCalendarDateLocalized;

export interface HijriCalendarFormatOptions {
  locale?: Locale;
  timeZone?: HijriTimeZone;
  hijriSystem?: HijriCalendarSystem;
}

export type BanglaCalendarDayFormat = "ordinal" | "spoken";
export type BanglaCalendarDaySpokenVariant = "pohela" | "poyla";

export interface BanglaDayFormatOptions {
  format?: BanglaCalendarDayFormat;
  variant?: BanglaCalendarDaySpokenVariant;
}
