import type { ReactElement } from "react";
import { createElement, forwardRef } from "react";
import { formatBanglaCalendar, formatDate } from "../core/format";
import { parseDate } from "../core/parse";
import { fromNow } from "../core/relative";
import { toDate } from "../core/utils";
import type {
  TarikhCalendarProps,
  TarikhDateProps,
  TarikhRelativeProps
} from "../types/react";

function toLocalDateOnlyString(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hasExplicitTimeComponent(input: string): boolean {
  return /(?:T|\s)\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})?$/i.test(
    input.trim()
  );
}

function isDateOnlyInput(value: unknown): value is string {
  return (
    typeof value === "string" &&
    !hasExplicitTimeComponent(value) &&
    parseDate(value) !== null
  );
}

function toDateTimeAttribute(value: unknown, date: Date): string {
  if (isDateOnlyInput(value)) {
    return toLocalDateOnlyString(date);
  }
  return date.toISOString();
}

export type {
  TarikhCalendarProps,
  TarikhDateProps,
  TarikhRelativeProps
} from "../types/react";

export const TarikhDate = forwardRef<HTMLTimeElement, TarikhDateProps>(
  function TarikhDate(
    {
      value,
      locale,
      month,
      year,
      day,
      srLabel,
      "aria-label": ariaLabelProp,
      ...props
    },
    ref
  ): ReactElement {
    const date = toDate(value);
    const opts = {
      ...(locale !== undefined && { locale }),
      ...(month !== undefined && { month }),
      ...(year !== undefined && { year }),
      ...(day !== undefined && { day })
    };
    const formatted = formatDate(date, opts);
    const iso = toDateTimeAttribute(value, date);
    const ariaLabel = srLabel ?? ariaLabelProp ?? formatted;

    return createElement(
      "time",
      { ...props, ref, dateTime: iso, "aria-label": ariaLabel },
      formatted
    );
  }
);

TarikhDate.displayName = "TarikhDate";

export const TarikhRelative = forwardRef<HTMLTimeElement, TarikhRelativeProps>(
  function TarikhRelative(
    { value, locale, srLabel, "aria-label": ariaLabelProp, ...props },
    ref
  ): ReactElement {
    const date = toDate(value);
    const formatted = fromNow(date, locale !== undefined ? { locale } : undefined);
    const iso = toDateTimeAttribute(value, date);
    const ariaLabel = srLabel ?? ariaLabelProp ?? formatted;

    return createElement(
      "time",
      { ...props, ref, dateTime: iso, "aria-label": ariaLabel },
      formatted
    );
  }
);

TarikhRelative.displayName = "TarikhRelative";

export const TarikhCalendar = forwardRef<HTMLTimeElement, TarikhCalendarProps>(
  function TarikhCalendar(
    { value, locale, srLabel, "aria-label": ariaLabelProp, ...props },
    ref
  ): ReactElement {
    const date = toDate(value);
    const formatted = formatBanglaCalendar(
      date,
      locale !== undefined ? { locale } : undefined
    );
    const iso = toDateTimeAttribute(value, date);
    const ariaLabel = srLabel ?? ariaLabelProp ?? formatted;

    return createElement(
      "time",
      { ...props, ref, dateTime: iso, "aria-label": ariaLabel },
      formatted
    );
  }
);

TarikhCalendar.displayName = "TarikhCalendar";
