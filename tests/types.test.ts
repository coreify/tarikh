import { describe, expect, it } from "vitest";
import type { FormatOptions } from "../src";
import { format } from "../src";

describe("type-level format contract", () => {
  it("treats pattern and mode as mutually exclusive", () => {
    const patternOnly: FormatOptions = { pattern: "DD MMM YYYY" };
    const standardOnly: FormatOptions = { mode: "standard" };
    const banglaOnly: FormatOptions = { mode: "bangla" };
    const hybridOnly: FormatOptions = { mode: "hybrid" };

    expectType(patternOnly);
    expectType(standardOnly);
    expectType(banglaOnly);
    expectType(hybridOnly);

    // @ts-expect-error - format requires mode or pattern
    acceptsFormatOptions({});

    // @ts-expect-error - pattern formatting does not accept mode
    acceptsFormatOptions({ pattern: "DD MMM YYYY", mode: "bangla" });

    // @ts-expect-error - mode-based formatting does not accept pattern
    acceptsFormatOptions({ mode: "bangla", pattern: "DD MMM YYYY" });

    expect(format("2026-03-31", patternOnly)).toBe("31 Mar 2026");
    expect(format("2026-03-31", standardOnly)).toBe("31 Mar 2026");
    expect(format("2026-03-31", banglaOnly)).toBe("17 Chaitra 1432");
    expect(format("2026-03-31", hybridOnly)).toBe("31 মার্চ 2026");
  });
});

function acceptsFormatOptions(_value: FormatOptions): void {
  void _value;
}

function expectType(_value: unknown): void {
  void _value;
}
