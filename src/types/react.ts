import type { ComponentPropsWithoutRef } from "react";
import type {
  BanglaCalendarDaySpokenVariant,
  BanglaCalendarDayFormat,
  DateInput,
  DateFormatOptions,
  HijriCalendarSystem,
  HijriTimeZone,
  Locale,
  RelativeTimeOptions
} from "./index";

export interface TarikhProps
  extends
    Omit<ComponentPropsWithoutRef<"time">, "children">,
    Omit<DateFormatOptions, "locale"> {
  value: DateInput;
  locale?: Locale;
  srLabel?: string;
}

export interface RelativeTimeProps extends Omit<
  ComponentPropsWithoutRef<"time">,
  "children"
> {
  value: DateInput;
  locale?: Locale;
  numeric?: RelativeTimeOptions["numeric"];
  baseDate?: RelativeTimeOptions["baseDate"];
  relativeStyle?: RelativeTimeOptions["style"];
  threshold?: RelativeTimeOptions["threshold"];
  srLabel?: string;
}

export interface BanglaDateProps extends Omit<
  ComponentPropsWithoutRef<"time">,
  "children"
> {
  value: DateInput;
  locale?: Locale;
  format?: BanglaCalendarDayFormat;
  variant?: BanglaCalendarDaySpokenVariant;
  srLabel?: string;
}

export interface HijriDateProps extends Omit<
  ComponentPropsWithoutRef<"time">,
  "children"
> {
  value: DateInput;
  locale?: Locale;
  timeZone?: HijriTimeZone;
  hijriSystem?: HijriCalendarSystem;
  srLabel?: string;
}
