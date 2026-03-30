# @coreify/tarikh

The Bangladeshi date toolkit for modern apps.

Format dates, render Bangla calendar, and handle localization correctly.

## Why this exists

JavaScript's `Intl.DateTimeFormat` and libraries like Day.js / date-fns don't solve these problems:

- **Bangla calendar** — Convert Gregorian dates to Bengali calendar (বৈশাখ, চৈত্র, etc.)
- **Bangla digits** — Render `৩১ মার্চ ২০২৬` instead of `31 March 2026`
- **Hybrid formatting** — Mix English and Bangla in a single date string
- **Weekday and time formatting** — Render weekday, hour, minute, and second output
- **Natural relative time** — Use `yesterday`, `tomorrow`, `গতকাল`, `আগামীকাল`, etc.
- **Cultural correctness** — Bangladeshi locale-aware formatting out of the box

`@coreify/tarikh` is a zero-dependency, tree-shakeable, SSR-safe toolkit purpose-built for Bangladesh.

## Installation

```bash
npm install @coreify/tarikh
```

## Quick Start

```ts
import {
  formatDate,
  formatBanglaCalendar,
  fromNow,
  toBanglaCalendar
} from "@coreify/tarikh";

formatDate(new Date(), { locale: "bn-BD" });
// → "৩১ মার্চ ২০২৬"

// Structured Bangla calendar conversion
// `monthIndex` stays numeric; `bn-BD` localizes `day`, `month`, and `year`.
toBanglaCalendar("2026-03-31");
// → { day: 17, month: "Chaitra", monthIndex: 12, year: 1432 }

toBanglaCalendar("2026-03-31", { locale: "bn-BD" });
// → { day: "১৭", month: "চৈত্র", monthIndex: 12, year: "১৪৩২" }

formatBanglaCalendar("2026-03-31");
// → "17 Chaitra 1432"

formatBanglaCalendar("2026-03-31", { locale: "bn-BD" });
// → "১৭ই চৈত্র ১৪৩২"

formatBanglaCalendar("2026-04-14", { locale: "bn-BD" });
// → "১লা বৈশাখ ১৪৩৩"

formatDate(new Date(2026, 2, 31, 15, 4), {
  weekday: "short",
  hour: "numeric",
  minute: "2-digit"
});
// → "Tue, 31 Mar 2026, 15:04"

formatDate(new Date(2026, 2, 31, 21, 4, 9), {
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true
});
// → "Tuesday, 31 Mar 2026, 09:04:09 PM"

fromNow(new Date(Date.now() - 86400000), { numeric: "auto" });
// → "yesterday"

fromNow(new Date(), { numeric: "auto" });
// → "today"
```

## Features

### Date Formatting

```ts
import { formatDate } from "@coreify/tarikh";

formatDate(new Date());
// → "31 Mar 2026"

formatDate(new Date(), { locale: "bn-BD" });
// → "৩১ মার্চ ২০২৬"

formatDate(new Date(), { month: "long", year: "2-digit" });
// → "31 March 26"

formatDate(new Date(2026, 2, 31, 15, 4, 9), {
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true
});
// → "Tuesday, 31 Mar 2026, 03:04:09 PM"
```

**Options:** `locale` (`"en-BD"` | `"bn-BD"`), `month` (`"short"` | `"long"`), `year` (`"numeric"` | `"2-digit"`), `day` (`"numeric"` | `"2-digit"`), `weekday` (`"short"` | `"long"`), `hour` / `minute` / `second` (`"numeric"` | `"2-digit"`), `hour12` (`boolean`)

### Token-based Formatting

```ts
import { format } from "@coreify/tarikh";

format(new Date(), "DD MMM YYYY");
// → "31 Mar 2026"

format(new Date(), "DD MMMM YYYY", { locale: "bn-BD" });
// → "৩১ মার্চ ২০২৬"

format(new Date(), "DD/MM/YYYY");
// → "31/03/2026"

format(new Date(2026, 2, 31, 15, 4, 9), "ddd, D MMM YYYY HH:mm:ss");
// → "Tue, 31 Mar 2026 15:04:09"

format(new Date(2026, 2, 31, 9, 4), "ddd, D MMM YYYY h:mm a", {
  locale: "bn-BD"
});
// → "মঙ্গল, ৩১ মার্চ ২০২৬ ৯:০৪ পূর্বাহ্ণ"

format(new Date(2026, 2, 31, 21, 4, 9), "dddd, D MMM YYYY hh:mm:ss A");
// → "Tuesday, 31 Mar 2026 09:04:09 PM"
```

**Tokens:** `dddd`, `ddd`, `DD`, `D`, `MMMM`, `MMM`, `MM`, `M`, `YYYY`, `YY`, `HH`, `H`, `hh`, `h`, `mm`, `m`, `ss`, `s`, `A`, `a`

### Bangla Calendar

Convert Gregorian dates to the Bengali calendar (Bangladesh Revised Calendar, 1987).

- `toBanglaCalendar()` returns a structured object.
- Default output: English digits + Latin month names (`en-BD`).
- Locale-aware output: Bangla date words like `১লা`, `২রা`, `৩রা`, `৪ঠা`, `৫ই`, `১৯শে` plus Bangla month names (`bn-BD`).
- `monthIndex` remains numeric in both cases.
- `formatBanglaCalendar(..., { locale: "bn-BD", format: "spoken" })` returns spoken day words like `পহেলা`, `দোসরা`, `তেসরা`, `চৌঠা`.
- `formatBanglaCalendarDay(day, { format: "spoken" })` returns colloquial spoken forms for the first four days: `পহেলা`, `দোসরা`, `তেসরা`, `চৌঠা`.
- Pass `{ variant: "pohela" }` to keep the standard `পহেলা` spelling explicitly, or `{ variant: "poyla" }` to get `পয়লা` for day 1. The parser also accepts the common `পয়লা` spelling.

```ts
import {
  formatBanglaCalendar,
  formatBanglaCalendarDay,
  toBanglaCalendar
} from "@coreify/tarikh";

toBanglaCalendar("2026-03-31");
// → { day: 17, month: "Chaitra", monthIndex: 12, year: 1432 }

toBanglaCalendar("2026-03-31", { locale: "bn-BD" });
// → { day: "১৭", month: "চৈত্র", monthIndex: 12, year: "১৪৩২" }

formatBanglaCalendar("2026-03-31");
// → "17 Chaitra 1432"

formatBanglaCalendar("2026-03-31", { locale: "bn-BD" });
// → "১৭ই চৈত্র ১৪৩২"

formatBanglaCalendar("2026-04-14");
// → "1 Baishakh 1433"

formatBanglaCalendar("2026-04-14", { locale: "bn-BD", format: "spoken" });
// → "পহেলা বৈশাখ ১৪৩৩"

formatBanglaCalendar("2026-04-14", {
  locale: "bn-BD",
  format: "spoken",
  variant: "poyla"
});
// → "পয়লা বৈশাখ ১৪৩৩"

formatBanglaCalendarDay(21);
// → "২১শে"

formatBanglaCalendarDay(1, { format: "spoken" });
// → "পহেলা"

formatBanglaCalendarDay(1, { format: "spoken", variant: "poyla" });
// → "পয়লা"

formatBanglaCalendarDay(1, { format: "spoken", variant: "pohela" });
// → "পহেলা"
```

### Hybrid Formatting

Mix English and Bangla independently for day, month, and year.

```ts
import { formatHybridDate } from "@coreify/tarikh";

formatHybridDate(new Date());
// → "31 মার্চ 2026"

formatHybridDate(new Date(), { digits: "bn", month: "bn", year: "en" });
// → "৩১ মার্চ 2026"
```

### Bangla Digits

```ts
import { toBanglaDigits, toEnglishDigits } from "@coreify/tarikh";

toBanglaDigits("31 March 2026");
// → "৩১ March ২০২৬"

toEnglishDigits("৩১ মার্চ ২০২৬");
// → "31 মার্চ 2026"
```

### Relative Time

```ts
import { fromNow } from "@coreify/tarikh";

fromNow(new Date(Date.now() - 86400000));
// → "1 day ago"

fromNow(new Date(Date.now() - 86400000), { locale: "bn-BD" });
// → "১ দিন আগে"

fromNow(new Date(Date.now() + 3600000));
// → "in 1 hour"

fromNow(new Date(Date.now() - 86400000), { numeric: "auto" });
// → "yesterday"

fromNow(new Date(Date.now() + 86400000), {
  locale: "bn-BD",
  numeric: "auto"
});
// → "আগামীকাল"
```

### Parsing

```ts
import { parseDate } from "@coreify/tarikh";

parseDate("৩১ মার্চ ২০২৬");
// → Date object (March 31, 2026)

parseDate("17 Chaitra 1432", { calendar: "bangla" });
// → Date object (March 31, 2026)

// Legacy spellings (Boishakh, Joishtho, Choitro, etc.) are still accepted.

parseDate("১৭ চৈত্র ১৪৩২", { calendar: "bangla" });
// → Date object (March 31, 2026)

parseDate("31 March 2026");
// → Date object (March 31, 2026)

parseDate("March 31, 2026");
// → Date object (March 31, 2026)

parseDate("31-Mar-2026");
// → Date object (March 31, 2026)

parseDate("2026/03/31");
// → Date object (March 31, 2026)

parseDate("2026.03.31");
// → Date object (March 31, 2026)

parseDate("2026-03-31T15:30:00Z");
// → Date object (March 31, 2026, 3:30 PM UTC)

// `toDate()` accepts the same Gregorian string forms as `parseDate()`,
// plus `Date` objects and timestamps.
// Supported string shapes:
// - `YYYY-MM-DD`
// - `YYYY/MM/DD`
// - `YYYY.MM.DD`
// - `YYYY-M-D`, `YYYY/M/D`, `YYYY.M.D`
// - `YYYY-MM-DDTHH:mm[:ss[.fraction]][Z|±HH:mm]`
// - `DD Month YYYY`
// - `Month DD, YYYY`
// - `DD-Month-YYYY`
// - Bangla calendar strings like `১৭ চৈত্র ১৪৩২`
// - Common Bangla month aliases like `Boishakh`, `Poush`, `Falgun`, `Asharh`
```

### Utilities

```ts
import {
  isToday,
  isYesterday,
  isTomorrow,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
  getBanglaMonth
} from "@coreify/tarikh";

isToday(new Date()); // → true
isYesterday(subDays(new Date(), 1)); // → true
isTomorrow(addDays(new Date(), 1)); // → true
startOfMonth(new Date()); // → Date at the start of this month
endOfMonth(new Date()); // → Date at the end of this month
addMonths("2026-01-31", 1); // → 2026-02-28
addYears(new Date(2024, 1, 29), 1); // → 2025-02-28

getBanglaMonth(3); // → "মার্চ"
getBanglaMonth(3, "short"); // → "মার্চ"
getBanglaMonth(12); // → "ডিসেম্বর"
```

### Constants

```ts
import {
  BANGLA_MONTHS_FULL,
  BANGLA_MONTHS_SHORT,
  BANGLA_CALENDAR_MONTHS,
  BANGLA_CALENDAR_MONTHS_EN,
  BANGLA_WEEKDAYS_FULL,
  BANGLA_WEEKDAYS_SHORT,
  ENGLISH_WEEKDAYS_FULL,
  ENGLISH_WEEKDAYS_SHORT,
  BANGLA_DIGITS,
  ENGLISH_DIGITS
} from "@coreify/tarikh";
```

## React Components

Optional entry point — only included if you import from `@coreify/tarikh/react`.

```bash
npm install @coreify/tarikh react
```

### Tarikh

```tsx
import { Tarikh } from "@coreify/tarikh/react";

<Tarikh value={new Date()} />
// → <time>31 Mar 2026</time>

<Tarikh value={new Date()} locale="bn-BD" />
// → <time>৩১ মার্চ ২০২৬</time>

<Tarikh value={new Date()} month="long" />
// → <time>31 March 2026</time>

<Tarikh
  value={new Date(2026, 2, 31, 15, 4)}
  weekday="short"
  hour="numeric"
  minute="2-digit"
/>
// → <time>Tue, 31 Mar 2026, 15:04</time>

<Tarikh
  value={new Date(2026, 2, 31, 15, 4, 9)}
  weekday="long"
  hour="2-digit"
  minute="2-digit"
  second="2-digit"
  hour12
  locale="bn-BD"
/>
// → <time>মঙ্গলবার, ৩১ মার্চ ২০২৬, ০৩:০৪:০৯ অপরাহ্ণ</time>

<Tarikh value="31 March 2026" />
// → <time dateTime="2026-03-31">31 Mar 2026</time>
```

### RelativeTime

```tsx
import { RelativeTime } from "@coreify/tarikh/react";

<RelativeTime value={someDate} />
// → <time>2 days ago</time>

<RelativeTime value={someDate} locale="bn-BD" />
// → <time>২ দিন আগে</time>

<RelativeTime value={someDate} numeric="auto" />
// → <time>yesterday</time> (for a 1-day past date)

<RelativeTime value={someDate} locale="bn-BD" numeric="auto" />
// → <time>আগামীকাল</time> (for a 1-day future date)
```

### BanglaDate

```tsx
import { BanglaDate } from "@coreify/tarikh/react";

<BanglaDate value={new Date()} />
// → <time>17 Chaitra 1432</time> (example; depends on date)

<BanglaDate value={new Date()} locale="bn-BD" />
// → <time>১৭ই চৈত্র ১৪৩২</time> (example; depends on date)

<BanglaDate
  value={new Date()}
  locale="bn-BD"
  format="spoken"
  variant="poyla"
/>
// → spoken day + Bangla month (e.g. পয়লা বৈশাখ … on Pohela Baishakh)

<BanglaDate value="31 March 2026" />
// → <time dateTime="2026-03-31">17 Chaitra 1432</time> (example; depends on date)
```

All components render semantic `<time>` elements with `dateTime` and `aria-label` attributes. They are SSR-safe, tree-shakeable, and have zero runtime dependencies beyond React.

## What `Intl.DateTimeFormat` cannot do

| Feature                         | Intl    | @coreify/tarikh |
| ------------------------------- | ------- | --------------- |
| Bangla calendar (বৈশাখ → চৈত্র) | No      | Yes             |
| Bangla digits in dates          | Partial | Yes             |
| Hybrid formatting (mixed en/bn) | No      | Yes             |
| Bangla calendar date parsing    | No      | Yes             |
| Relative time in Bangla         | No      | Yes             |
| SSR-safe React components       | N/A     | Yes             |

## TypeScript

Fully typed with strict mode. Core option interfaces and value types are exported from `@coreify/tarikh`.

```ts
import type {
  DateInput,
  DayFormat,
  MonthFormat,
  Locale,
  Language,
  YearFormat,
  WeekdayFormat,
  TimeFormat,
  BanglaCalendarOptions,
  RelativeTimeOptions,
  BanglaCalendarFormatOptions,
  BanglaCalendarDayFormat,
  BanglaCalendarDaySpokenVariant,
  BanglaDayFormatOptions,
  DateFormatOptions,
  BanglaCalendarDate,
  HybridDateFormatOptions
} from "@coreify/tarikh";
```

```ts
import type {
  BanglaDateProps,
  RelativeTimeProps,
  TarikhProps
} from "@coreify/tarikh/react";
```

## License

MIT
