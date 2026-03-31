# @coreify/tarikh

[![npm version](https://img.shields.io/npm/v/@coreify/tarikh)](https://www.npmjs.com/package/@coreify/tarikh)
[![downloads](https://img.shields.io/npm/dm/@coreify/tarikh)](https://www.npmjs.com/package/@coreify/tarikh)
[![license](https://img.shields.io/npm/l/@coreify/tarikh)](https://github.com/coreify/tarikh/blob/main/package/LICENSE)

The first JavaScript date library with Bangla and Hijri calendar support.

Built for Bangla dates, Bengali calendar conversion, and culturally correct formatting.

## At a Glance

```ts
format("2026-04-14", {
  mode: "bangla",
  locale: "bn-BD",
  format: "spoken"
});
// → "পহেলা বৈশাখ ১৪৩৩"
```

## Demo

External demo: [tarikh.js.org](https://tarikh.js.org)

## Why this exists

JavaScript's `Intl.DateTimeFormat` and libraries like Day.js / date-fns don't solve these problems:

- **Bangla calendar** — Convert Gregorian dates to Bengali calendar (বৈশাখ, চৈত্র, etc.)
- **Hijri calendar** — Render Islamic calendar dates alongside Bangla and Gregorian output
- **Bangla digits** — Render `৩১শে মার্চ ২০২৬` instead of `31st March 2026`
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
  format,
  fromNow,
  toBanglaCalendar,
  toHijriCalendar
} from "@coreify/tarikh";

// Preferred entry points:
format(new Date(), { mode: "standard" });
format(new Date(), { mode: "bangla" });
format(new Date(), { mode: "hijri" });
format(new Date(), { mode: "hybrid" });

// Token-based output still works.
format(new Date(), { pattern: "DD MMM YYYY" });
// → "31 Mar 2026"

// Structured Bangla calendar conversion
// `monthIndex` stays numeric; `bn-BD` localizes `day`, `month`, and `year`.
toBanglaCalendar("2026-03-31");
// → { day: 17, month: "Chaitra", monthIndex: 12, year: 1432 }

toBanglaCalendar("2026-03-31", { locale: "bn-BD" });
// → { day: "১৭", month: "চৈত্র", monthIndex: 12, year: "১৪৩২" }

format("2026-03-31", { mode: "bangla" });
// → "17th Chaitra 1432"

format("2026-03-31", { mode: "bangla", locale: "bn-BD" });
// → "১৭ই চৈত্র ১৪৩২"

format("2026-04-14", { mode: "bangla", locale: "bn-BD" });
// → "১লা বৈশাখ ১৪৩৩"

toHijriCalendar("2026-03-31");
// → { day: 11, month: "Shawwal", monthIndex: 10, year: 1447 }

toHijriCalendar("2026-03-31", { locale: "bn-BD" });
// → { day: "১১", month: "শাওয়াল", monthIndex: 10, year: "১৪৪৭" }

format("2026-03-31", { mode: "hijri" });
// → "11th Shawwal 1447 AH"

format("2026-03-31", { mode: "hijri", locale: "bn-BD" });
// → "১১ই শাওয়াল ১৪৪৭ হিজরি"

format(new Date(2026, 2, 31, 15, 4), {
  mode: "standard",
  weekday: "short",
  hour: "numeric",
  minute: "2-digit"
});
// → "Tue, 31st Mar 2026, 15:04"

format(new Date(2026, 2, 31, 21, 4, 9), {
  mode: "standard",
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true
});
// → "Tuesday, 31st Mar 2026, 09:04:09 PM"

fromNow(new Date(Date.now() - 86400000), { numeric: "auto" });
// → "yesterday"

fromNow(new Date(), { numeric: "auto" });
// → "today"
```

Use `format()` for everything. Choose a mode (`standard`, `bangla`, `hijri`, `hybrid`) or pass a token pattern.

```ts
// Show today's Bangla date in your app header
format(new Date(), { mode: "bangla", locale: "bn-BD" });
// → "১৭ চৈত্র ১৪৩২"
```

## Features

### Standard Formatting

```ts
import { format } from "@coreify/tarikh";

format(new Date(), { mode: "standard" });
// → "31st Mar 2026"

format(new Date(), { mode: "standard", locale: "bn-BD" });
// → "৩১শে মার্চ ২০২৬"

format(new Date(), { mode: "standard", month: "long", year: "2-digit" });
// → "31st March 26"

format(new Date(2026, 2, 31, 15, 4, 9), {
  mode: "standard",
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true
});
// → "Tuesday, 31st Mar 2026, 03:04:09 PM"
```

**Options:** `locale` (`"en-BD"` | `"bn-BD"`), `month` (`"short"` | `"long"`), `year` (`"numeric"` | `"2-digit"`), `day` (`"numeric"` | `"2-digit"`), `weekday` (`"short"` | `"long"`), `hour` / `minute` / `second` (`"numeric"` | `"2-digit"`), `hour12` (`boolean`)

### Pattern Formatting

```ts
import { format } from "@coreify/tarikh";

format(new Date(), { pattern: "DD MMM YYYY" });
// → "31 Mar 2026"

format(new Date(), { pattern: "DD MMMM YYYY", locale: "bn-BD" });
// → "৩১ মার্চ ২০২৬"

format(new Date(), { pattern: "DD/MM/YYYY" });
// → "31/03/2026"

format(new Date(2026, 2, 31, 15, 4, 9), {
  pattern: "ddd, D MMM YYYY HH:mm:ss"
});
// → "Tue, 31 Mar 2026 15:04:09"

format(new Date(2026, 2, 31, 9, 4), {
  pattern: "ddd, D MMM YYYY h:mm a",
  locale: "bn-BD"
});
// → "মঙ্গল, ৩১ মার্চ ২০২৬ ৯:০৪ পূর্বাহ্ণ"

format(new Date(2026, 2, 31, 21, 4, 9), {
  pattern: "dddd, D MMM YYYY hh:mm:ss A"
});
// → "Tuesday, 31 Mar 2026 09:04:09 PM"
```

`format()` is the primary API. Use `{ mode }` for date behavior or `{ pattern }` for token formatting. `mode` and `pattern` are mutually exclusive.

**Tokens:** `dddd`, `ddd`, `DD`, `D`, `MMMM`, `MMM`, `MM`, `M`, `YYYY`, `YY`, `HH`, `H`, `hh`, `h`, `mm`, `m`, `ss`, `s`, `A`, `a`

Use square brackets to keep literal text untouched by token replacement:

```ts
format(new Date(2026, 2, 31, 15, 4), { pattern: "[Today at] h:mm a" });
// → "Today at 3:04 pm"
```

Bracket literals are not nestable; the first `]` closes the literal block.

## 🇧🇩 Bangla Calendar (Core Feature)

This is the reason `@coreify/tarikh` exists.

Convert Gregorian dates to the Bengali calendar (Bangladesh Revised Calendar, 1987).

- **Top feature:** `format("2026-04-14", { mode: "bangla", locale: "bn-BD", format: "spoken" })` returns `পহেলা বৈশাখ ১৪৩৩`.
- `toBanglaCalendar()` returns a structured object.
- Default output: English digits + Latin month names (`en-BD`).
- Locale-aware output: Bangla date words like `১লা`, `২রা`, `৩রা`, `৪ঠা`, `৫ই`, `১৯শে` plus Bangla month names (`bn-BD`).
- `monthIndex` remains numeric in both cases.
- `format(..., { mode: "bangla", locale: "bn-BD", format: "spoken" })` returns spoken day words like `পহেলা`, `দোসরা`, `তেসরা`, `চৌঠা`.
- `formatBanglaCalendarDay(day, { format: "spoken" })` returns colloquial spoken forms for the first four days: `পহেলা`, `দোসরা`, `তেসরা`, `চৌঠা`.
- Pass `{ variant: "pohela" }` to keep the standard `পহেলা` spelling explicitly, or `{ variant: "poyla" }` to get `পয়লা` for day 1. The parser also accepts the common `পয়লা` spelling.

```ts
import {
  format,
  formatBanglaCalendarDay,
  toBanglaCalendar
} from "@coreify/tarikh";

toBanglaCalendar("2026-03-31");
// → { day: 17, month: "Chaitra", monthIndex: 12, year: 1432 }

toBanglaCalendar("2026-03-31", { locale: "bn-BD" });
// → { day: "১৭", month: "চৈত্র", monthIndex: 12, year: "১৪৩২" }

format("2026-03-31", { mode: "bangla" });
// → "17th Chaitra 1432"

format("2026-03-31", { mode: "bangla", locale: "bn-BD" });
// → "১৭ই চৈত্র ১৪৩২"

format("2026-04-14", { mode: "bangla" });
// → "1st Baishakh 1433"

format("2026-04-14", { mode: "bangla", locale: "bn-BD", format: "spoken" });
// → "পহেলা বৈশাখ ১৪৩৩"

format("2026-04-14", {
  mode: "bangla",
  locale: "bn-BD",
  format: "spoken",
  variant: "poyla"
});
// → "পয়লা বৈশাখ ১৪৩৩"

// Show today's Bangla date in your app header
format(new Date(), { mode: "bangla", locale: "bn-BD" });
// → "১৭ চৈত্র ১৪৩২" (example; depends on the current date)

formatBanglaCalendarDay(21);
// → "২১শে"

formatBanglaCalendarDay(1, { format: "spoken" });
// → "পহেলা"

formatBanglaCalendarDay(1, { format: "spoken", variant: "poyla" });
// → "পয়লা"

formatBanglaCalendarDay(1, { format: "spoken", variant: "pohela" });
// → "পহেলা"
```

### Hijri Calendar

Render Islamic calendar dates in the same object-first style as Bangla dates.
Hijri dates can vary by moon sighting, so exact values may differ by locale.

```ts
import { format, toHijriCalendar } from "@coreify/tarikh";

toHijriCalendar("2026-03-31");
// → { day: 11, month: "Shawwal", monthIndex: 10, year: 1447 }

toHijriCalendar("2026-03-31", { locale: "bn-BD" });
// → { day: "১১", month: "শাওয়াল", monthIndex: 10, year: "১৪৪৭" }

format("2026-03-31", { mode: "hijri" });
// → "11th Shawwal 1447 AH"

format("2026-03-31", { mode: "hijri", locale: "bn-BD" });
// → "১১ই শাওয়াল ১৪৪৭ হিজরি"
```

### Hybrid Formatting

Mix English and Bangla independently for day, month, and year.

```ts
import { format } from "@coreify/tarikh";

format(new Date(), { mode: "hybrid" });
// → "31 মার্চ 2026"

format(new Date(), {
  mode: "hybrid",
  digits: "bn",
  month: "bn",
  year: "en"
});
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

Primary React API:

Use `Tarikh` for the default formatter, then reach for the nested variants when you want relative time, Bangla calendar rendering, or Hijri calendar rendering.

```tsx
import { Tarikh } from "@coreify/tarikh/react";

<Tarikh value={new Date()} />
<Tarikh.Relative value={new Date()} />
<Tarikh.Bangla value={new Date()} locale="bn-BD" />
<Tarikh.Hijri value={new Date()} locale="bn-BD" />
```

```bash
npm install @coreify/tarikh react
```

All components render semantic `<time>` elements with `dateTime` and `aria-label` attributes. They are SSR-safe, tree-shakeable, and have zero runtime dependencies beyond React.

`Tarikh` handles standard date formatting, `Tarikh.Relative` handles relative time, `Tarikh.Bangla` handles Bangla calendar output, and `Tarikh.Hijri` handles Hijri calendar output.

## What `Intl.DateTimeFormat` cannot do

If you're building for Bangladesh, existing libraries are not enough.

| Feature                         | Intl    | @coreify/tarikh |
| ------------------------------- | ------- | --------------- |
| Bangla calendar (বৈশাখ → চৈত্র) | No      | Yes             |
| Hijri calendar                  | Partial | Yes             |
| Bangla digits in dates          | Partial | Yes             |
| Hybrid formatting (mixed en/bn) | No      | Yes             |
| Bangla calendar date parsing    | No      | Yes             |
| Relative time in Bangla         | No      | Yes             |
| SSR-safe React components       | N/A     | Yes             |

## TypeScript

Fully typed with strict mode. Start with the primary types below; the package also exports the lower-level calendar and helper types for advanced use.

Type-level contract note: when using `pattern`, `mode` is intentionally disallowed in TypeScript.

```ts
import type {
  Locale,
  FormatMode,
  FormatOptions,
  DateInput,
  RelativeTimeOptions
} from "@coreify/tarikh";

import type { TarikhProps } from "@coreify/tarikh/react";
```

## License

MIT
