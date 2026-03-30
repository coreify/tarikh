# @coreify/tarikh

The Bangladeshi date toolkit for modern apps.

Format dates, render Bangla calendar, and handle localization correctly.

## Why this exists

JavaScript's `Intl.DateTimeFormat` and libraries like Day.js / date-fns don't solve these problems:

- **Bangla calendar** — Convert Gregorian dates to Bengali calendar (বৈশাখ, চৈত্র, etc.)
- **Bangla digits** — Render `৩১ মার্চ ২০২৬` instead of `31 March 2026`
- **Hybrid formatting** — Mix English and Bangla in a single date string
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

fromNow(new Date(Date.now() - 86400000));
// → "1 day ago"
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
```

**Options:** `locale` (`"en-BD"` | `"bn-BD"`), `month` (`"short"` | `"long"`), `year` (`"numeric"` | `"2-digit"`), `day` (`"numeric"` | `"2-digit"`)

### Token-based Formatting

```ts
import { format } from "@coreify/tarikh";

format(new Date(), "DD MMM YYYY");
// → "31 Mar 2026"

format(new Date(), "DD MMMM YYYY", { locale: "bn-BD" });
// → "৩১ মার্চ ২০২৬"

format(new Date(), "DD/MM/YYYY");
// → "31/03/2026"
```

**Tokens:** `DD`, `D`, `MMMM`, `MMM`, `MM`, `M`, `YYYY`, `YY`

### Bangla Calendar

Convert Gregorian dates to the Bengali calendar (Bangladesh Revised Calendar, 1987).

- `toBanglaCalendar()` returns a structured object.
- Default output: English digits + Latin month names (`en-BD`).
- Locale-aware output: Bangla date words like `১লা`, `২রা`, `৩রা`, `৪ঠা`, `৫ই`, `১৯শে` plus Bangla month names (`bn-BD`).
- `monthIndex` remains numeric in both cases.
- `formatBanglaCalendar(..., { locale: "bn-BD", style: "spoken" })` returns spoken day words like `পহেলা`, `দোসরা`, `তেসরা`, `চৌঠা`.
- `formatBanglaCalendarDay(day, { style: "spoken" })` returns colloquial spoken forms for the first four days: `পহেলা`, `দোসরা`, `তেসরা`, `চৌঠা`.
- Pass `{ variant: "pohela" }` to keep the standard `পহেলা` spelling explicitly, or `{ variant: "poyla" }` to get `পয়লা` for day 1. The parser also accepts the common `পয়লা` spelling.

```ts
import { toBanglaCalendar, formatBanglaCalendar } from "@coreify/tarikh";

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

formatBanglaCalendar("2026-04-14", { locale: "bn-BD", style: "spoken" });
// → "পহেলা বৈশাখ ১৪৩৩"

formatBanglaCalendar("2026-04-14", {
  locale: "bn-BD",
  style: "spoken",
  variant: "poyla"
});
// → "পয়লা বৈশাখ ১৪৩৩"

// Reusable helper for just the Bangla day word
import { formatBanglaCalendarDay } from "@coreify/tarikh";

formatBanglaCalendarDay(21);
// → "২১শে"

formatBanglaCalendarDay(1, { style: "spoken" });
// → "পহেলা"

formatBanglaCalendarDay(1, { style: "spoken", variant: "poyla" });
// → "পয়লা"

formatBanglaCalendarDay(1, { style: "spoken", variant: "pohela" });
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

parseDate("2026-03-31T15:30:00Z");
// → Date object (March 31, 2026, 3:30 PM UTC)

// `toDate()` accepts the same Gregorian string forms as `parseDate()`,
// plus `Date` objects and timestamps.
// Supported string shapes:
// - `YYYY-MM-DD`
// - `YYYY-MM-DDTHH:mm[:ss[.sss]][Z|±HH:mm]`
// - `DD Month YYYY`
// - Bangla calendar strings like `১৭ চৈত্র ১৪৩২`
```

### Utilities

```ts
import {
  isToday, isYesterday, isTomorrow,
  startOfDay, endOfDay,
  addDays, subDays,
  getBanglaMonth
} from "@coreify/tarikh";

isToday(new Date());        // → true
isYesterday(subDays(new Date(), 1)); // → true
isTomorrow(addDays(new Date(), 1));  // → true

getBanglaMonth(3);          // → "মার্চ"
getBanglaMonth(3, "short"); // → "মার্চ"
```

### Constants

```ts
import {
  BANGLA_MONTHS_FULL,
  BANGLA_MONTHS_SHORT,
  BANGLA_CALENDAR_MONTHS,
  BANGLA_CALENDAR_MONTHS_EN,
  BANGLA_DIGITS,
  ENGLISH_DIGITS
} from "@coreify/tarikh";
```

## React Components

Optional entry point — only included if you import from `@coreify/tarikh/react`.

```bash
npm install @coreify/tarikh react
```

### TarikhDate

```tsx
import { TarikhDate } from "@coreify/tarikh/react";

<TarikhDate value={new Date()} />
// → <time>31 Mar 2026</time>

<TarikhDate value={new Date()} locale="bn-BD" />
// → <time>৩১ মার্চ ২০২৬</time>

<TarikhDate value={new Date()} month="long" />
// → <time>31 March 2026</time>

<TarikhDate value="31 March 2026" />
// → <time dateTime="2026-03-31">31 Mar 2026</time>
```

### TarikhRelative

```tsx
import { TarikhRelative } from "@coreify/tarikh/react";

<TarikhRelative value={someDate} />
// → <time>2 days ago</time>

<TarikhRelative value={someDate} locale="bn-BD" />
// → <time>২ দিন আগে</time>
```

### TarikhCalendar

```tsx
import { TarikhCalendar } from "@coreify/tarikh/react";

<TarikhCalendar value={new Date()} />
// → <time>17 Chaitra 1432</time> (example; depends on date)

<TarikhCalendar value={new Date()} locale="bn-BD" />
// → <time>১৭ই চৈত্র ১৪৩২</time> (example; depends on date)

<TarikhCalendar value="31 March 2026" />
// → <time dateTime="2026-03-31">17 Chaitra 1432</time> (example; depends on date)
```

All components render semantic `<time>` elements with `dateTime` and `aria-label` attributes. They are SSR-safe, tree-shakeable, and have zero runtime dependencies beyond React.

## What `Intl.DateTimeFormat` cannot do

| Feature | Intl | @coreify/tarikh |
|---|---|---|
| Bangla calendar (বৈশাখ → চৈত্র) | No | Yes |
| Bangla digits in dates | Partial | Yes |
| Hybrid formatting (mixed en/bn) | No | Yes |
| Bangla calendar date parsing | No | Yes |
| Relative time in Bangla | No | Yes |
| SSR-safe React components | N/A | Yes |

## TypeScript

Fully typed with strict mode. All public option interfaces and types are exported.

```ts
import type {
  TarikhLocale,
  TarikhLanguage,
  ToBanglaCalendarOptions,
  FormatBanglaCalendarOptions,
  BanglaCalendarDayStyle,
  BanglaCalendarDaySpokenVariant,
  FormatBanglaCalendarDayOptions,
  FormatDateOptions,
  BanglaCalendarDate,
  HybridFormatOptions
} from "@coreify/tarikh";
```

## License

MIT
