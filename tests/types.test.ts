import { describe, expect, it } from "vitest";
import { HIJRI_TIME_ZONES, toBanglaCalendar, toHijriCalendar } from "../src";
import type {
  BanglaCalendarDate,
  BanglaCalendarDateLocalized,
  BanglaCalendarOptions,
  BanglaCalendarResult,
  FormatOptions,
  HijriCalendarOptions,
  HijriCalendarDate,
  HijriCalendarDateLocalized,
  HijriCalendarResult,
  HijriTimeZone,
  Locale,
  ResolvableFormatOptions
} from "../src";
import { format } from "../src";

describe("type-level format contract", () => {
  it("treats pattern and mode as mutually exclusive", () => {
    const hijriInstant = new Date("2026-03-30T18:00:00.000Z");
    const patternOnly: FormatOptions = { pattern: "DD MMM YYYY" };
    const standardOnly: FormatOptions = { mode: "standard" };
    const banglaOnly: FormatOptions = { mode: "bangla" };
    const hijriOnly: FormatOptions = { mode: "hijri" };
    const hybridOnly: FormatOptions = { mode: "hybrid" };

    expectType(patternOnly);
    expectType(standardOnly);
    expectType(banglaOnly);
    expectType(hijriOnly);
    expectType(hybridOnly);
    const defaultedStandard: ResolvableFormatOptions = { locale: "bn-BD" };
    expectType(defaultedStandard);

    // @ts-expect-error - format requires mode or pattern
    acceptsFormatOptions({});

    // @ts-expect-error - pattern formatting does not accept mode
    acceptsFormatOptions({ pattern: "DD MMM YYYY", mode: "bangla" });

    // @ts-expect-error - mode-based formatting does not accept pattern
    acceptsFormatOptions({ mode: "bangla", pattern: "DD MMM YYYY" });

    expect(format("2026-03-31", patternOnly)).toBe("31 Mar 2026");
    expect(format("2026-03-31", standardOnly)).toBe("31st Mar 2026");
    expect(format("2026-03-31", defaultedStandard)).toBe(
      "৩১শে মার্চ ২০২৬ খ্রিস্টাব্দ"
    );
    expect(format("2026-03-31", banglaOnly)).toBe("17th Chaitra 1432");
    expect(format(hijriInstant, hijriOnly)).toBe("12th Shawwal 1447 AH");
    expect(format(hijriInstant, { mode: "hijri", timeZone: "UTC" })).toBe(
      "11th Shawwal 1447 AH"
    );
    expect(format("2026-03-31", hybridOnly)).toBe("31 মার্চ 2026");
  });

  it("limits Hijri time zone values to the documented set", () => {
    const [defaultZone, utcZone] = HIJRI_TIME_ZONES;

    expect(defaultZone).toBe("Asia/Dhaka");
    expect(utcZone).toBe("UTC");

    const typedDefault: HijriTimeZone = defaultZone;
    const typedUtc: HijriTimeZone = utcZone;
    expect(typedDefault).toBe("Asia/Dhaka");
    expect(typedUtc).toBe("UTC");

    // @ts-expect-error - unsupported Hijri time zones are rejected by the type contract
    const invalidZone: HijriTimeZone = "America/New_York";
    expectType(invalidZone);
  });

  it("returns unions when structured calendar locale is not statically fixed", () => {
    const locale: Locale = Math.random() > 0.5 ? "en-BD" : "bn-BD";

    const bangla = toBanglaCalendar("2026-03-31", { locale });
    const hijri = toHijriCalendar("2026-03-31", { locale });

    expectType<BanglaCalendarResult<Locale>>(bangla);
    expectType<HijriCalendarResult<Locale>>(hijri);

    // @ts-expect-error - locale can resolve to bn-BD, so numeric-only shape is unsafe
    const banglaNumericOnly: BanglaCalendarDate = bangla;
    expectType(banglaNumericOnly);

    // @ts-expect-error - locale can resolve to bn-BD, so numeric-only shape is unsafe
    const hijriNumericOnly: HijriCalendarDate = hijri;
    expectType(hijriNumericOnly);
  });

  it("preserves exact structured result types for literal locales", () => {
    const banglaEn = toBanglaCalendar("2026-03-31", { locale: "en-BD" });
    const banglaBn = toBanglaCalendar("2026-03-31", { locale: "bn-BD" });
    const hijriEn = toHijriCalendar("2026-03-31", { locale: "en-BD" });
    const hijriBn = toHijriCalendar("2026-03-31", { locale: "bn-BD" });
    const banglaDefault = toBanglaCalendar("2026-03-31");
    const hijriDefault = toHijriCalendar("2026-03-31");

    expectType<BanglaCalendarDate>(banglaEn);
    expectType<BanglaCalendarDateLocalized>(banglaBn);
    expectType<HijriCalendarDate>(hijriEn);
    expectType<HijriCalendarDateLocalized>(hijriBn);
    expectType<BanglaCalendarDate>(banglaDefault);
    expectType<HijriCalendarDate>(hijriDefault);
  });

  it("aligns generic structured options with the locale-specific result model", () => {
    const banglaOptionsBn: BanglaCalendarOptions<"bn-BD"> = { locale: "bn-BD" };
    const banglaOptionsEn: BanglaCalendarOptions<"en-BD"> = { locale: "en-BD" };
    const hijriOptionsBn: HijriCalendarOptions<"bn-BD"> = { locale: "bn-BD" };
    const hijriOptionsEn: HijriCalendarOptions<"en-BD"> = { locale: "en-BD" };

    expectType<BanglaCalendarDateLocalized>(
      toBanglaCalendar("2026-03-31", banglaOptionsBn)
    );
    expectType<BanglaCalendarDate>(
      toBanglaCalendar("2026-03-31", banglaOptionsEn)
    );
    expectType<HijriCalendarDateLocalized>(
      toHijriCalendar("2026-03-31", hijriOptionsBn)
    );
    expectType<HijriCalendarDate>(
      toHijriCalendar("2026-03-31", hijriOptionsEn)
    );
  });
});

function acceptsFormatOptions(_value: FormatOptions): void {
  void _value;
}

function expectType<T = unknown>(_value: T): void {
  void _value;
}
