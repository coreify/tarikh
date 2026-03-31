import { describe, expect, it } from "vitest";
import { HIJRI_TIME_ZONES } from "../src";
import type { FormatOptions, HijriTimeZone } from "../src";
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

    // @ts-expect-error - format requires mode or pattern
    acceptsFormatOptions({});

    // @ts-expect-error - pattern formatting does not accept mode
    acceptsFormatOptions({ pattern: "DD MMM YYYY", mode: "bangla" });

    // @ts-expect-error - mode-based formatting does not accept pattern
    acceptsFormatOptions({ mode: "bangla", pattern: "DD MMM YYYY" });

    expect(format("2026-03-31", patternOnly)).toBe("31 Mar 2026");
    expect(format("2026-03-31", standardOnly)).toBe("31st Mar 2026");
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
});

function acceptsFormatOptions(_value: FormatOptions): void {
  void _value;
}

function expectType(_value: unknown): void {
  void _value;
}
