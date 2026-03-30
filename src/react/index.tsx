import type { ReactElement } from "react";
import { createElement, forwardRef } from "react";
import { formatBanglaCalendar, formatDate } from "../core/format";
import { parseDate } from "../core/parse";
import { fromNow } from "../core/relative";
import { toDate } from "../core/utils";
import type {
  BanglaDateProps,
  RelativeTimeProps,
  TarikhProps
} from "../types/react";

function localDateOnlyString(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hasTimeComponent(input: string): boolean {
  return /(?:T|\s)\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})?$/i.test(
    input.trim()
  );
}

function isDateOnlyInput(value: unknown): value is string {
  return (
    typeof value === "string" &&
    !hasTimeComponent(value) &&
    parseDate(value) !== null
  );
}

function dateTimeAttribute(value: unknown, date: Date): string {
  if (isDateOnlyInput(value)) {
    return localDateOnlyString(date);
  }
  return date.toISOString();
}

export type {
  BanglaDateProps,
  RelativeTimeProps,
  TarikhProps
} from "../types/react";

export const Tarikh = forwardRef<HTMLTimeElement, TarikhProps>(function Tarikh(
  {
    value,
    locale,
    month,
    year,
    day,
    weekday,
    hour,
    minute,
    second,
    hour12,
    srLabel,
    "aria-label": ariaLabelProp,
    ...props
  },
  ref
): ReactElement {
  const date = toDate(value);
  const formatOptions = {
    ...(locale !== undefined && { locale }),
    ...(month !== undefined && { month }),
    ...(year !== undefined && { year }),
    ...(day !== undefined && { day }),
    ...(weekday !== undefined && { weekday }),
    ...(hour !== undefined && { hour }),
    ...(minute !== undefined && { minute }),
    ...(second !== undefined && { second }),
    ...(hour12 !== undefined && { hour12 })
  };
  const formatted = formatDate(date, formatOptions);
  const dateTime = dateTimeAttribute(value, date);
  const ariaLabel = srLabel ?? ariaLabelProp ?? formatted;

  return createElement(
    "time",
    { ...props, ref, dateTime, "aria-label": ariaLabel },
    formatted
  );
});

Tarikh.displayName = "Tarikh";

export const RelativeTime = forwardRef<HTMLTimeElement, RelativeTimeProps>(
  function RelativeTime(
    { value, locale, numeric, srLabel, "aria-label": ariaLabelProp, ...props },
    ref
  ): ReactElement {
    const date = toDate(value);
    const relativeTimeOptions = {
      ...(locale !== undefined && { locale }),
      ...(numeric !== undefined && { numeric })
    };
    const formatted = fromNow(
      date,
      Object.keys(relativeTimeOptions).length > 0
        ? relativeTimeOptions
        : undefined
    );
    const dateTime = dateTimeAttribute(value, date);
    const ariaLabel = srLabel ?? ariaLabelProp ?? formatted;

    return createElement(
      "time",
      { ...props, ref, dateTime, "aria-label": ariaLabel },
      formatted
    );
  }
);

RelativeTime.displayName = "RelativeTime";

export const BanglaDate = forwardRef<HTMLTimeElement, BanglaDateProps>(
  function BanglaDate(
    {
      value,
      locale,
      format,
      variant,
      srLabel,
      "aria-label": ariaLabelProp,
      ...props
    },
    ref
  ): ReactElement {
    const date = toDate(value);
    const calendarFormatOptions = {
      ...(locale !== undefined && { locale }),
      ...(format !== undefined && { format }),
      ...(variant !== undefined && { variant })
    };
    const formatted = formatBanglaCalendar(
      date,
      Object.keys(calendarFormatOptions).length > 0
        ? calendarFormatOptions
        : undefined
    );
    const dateTime = dateTimeAttribute(value, date);
    const ariaLabel = srLabel ?? ariaLabelProp ?? formatted;

    return createElement(
      "time",
      { ...props, ref, dateTime, "aria-label": ariaLabel },
      formatted
    );
  }
);

BanglaDate.displayName = "BanglaDate";
