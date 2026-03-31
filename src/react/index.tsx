import type { ForwardRefExoticComponent, ReactElement, RefAttributes } from "react";
import { createElement, forwardRef } from "react";
import { format as formatDate } from "../core/format";
import { parseDate } from "../core/parse";
import { fromNow } from "../core/relative";
import { toDate } from "../core/utils";
import type {
  BanglaDateProps,
  HijriDateProps,
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
  return /(?:T|\s)\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?$/i.test(
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
  HijriDateProps,
  RelativeTimeProps,
  TarikhProps
} from "../types/react";

type TarikhCompoundComponent = ForwardRefExoticComponent<
  TarikhProps & RefAttributes<HTMLTimeElement>
> & {
  Relative: typeof RelativeTimeComponent;
  Bangla: typeof BanglaDateComponent;
  Hijri: typeof HijriDateComponent;
};

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
  const formatted = formatDate(date, {
    mode: "standard",
    ...formatOptions
  });
  const dateTime = dateTimeAttribute(value, date);
  const ariaLabel = srLabel ?? ariaLabelProp ?? formatted;

  return createElement(
    "time",
    { ...props, ref, dateTime, "aria-label": ariaLabel },
    formatted
  );
}) as TarikhCompoundComponent;

Tarikh.displayName = "Tarikh";

const RelativeTimeComponent = forwardRef<HTMLTimeElement, RelativeTimeProps>(
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

RelativeTimeComponent.displayName = "RelativeTime";

const BanglaDateComponent = forwardRef<HTMLTimeElement, BanglaDateProps>(
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
    const formatted = formatDate(
      date,
      {
        mode: "bangla",
        ...calendarFormatOptions
      }
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

BanglaDateComponent.displayName = "BanglaDate";

const HijriDateComponent = forwardRef<HTMLTimeElement, HijriDateProps>(
  function HijriDate(
    { value, locale, srLabel, "aria-label": ariaLabelProp, ...props },
    ref
  ): ReactElement {
    const date = toDate(value);
    const calendarFormatOptions = {
      ...(locale !== undefined && { locale })
    };
    const formatted = formatDate(date, {
      mode: "hijri",
      ...calendarFormatOptions
    });
    const dateTime = dateTimeAttribute(value, date);
    const ariaLabel = srLabel ?? ariaLabelProp ?? formatted;

    return createElement(
      "time",
      { ...props, ref, dateTime, "aria-label": ariaLabel },
      formatted
    );
  }
);

HijriDateComponent.displayName = "HijriDate";

Tarikh.Relative = RelativeTimeComponent;
Tarikh.Bangla = BanglaDateComponent;
Tarikh.Hijri = HijriDateComponent;
