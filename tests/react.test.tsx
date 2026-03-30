import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TarikhCalendar, TarikhDate, TarikhRelative } from "../src/react";

describe("TarikhDate", () => {
  it("renders a time element with formatted date", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhDate, { value: "2026-03-31" })
    );
    expect(html).toContain("31 Mar 2026");
    expect(html).toContain("<time");
    expect(html).toContain('dateTime="2026-03-31"');
  });

  it("preserves date-only semantics for human-readable strings", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhDate, { value: "31 March 2026" })
    );
    expect(html).toContain('dateTime="2026-03-31"');
  });

  it("preserves a full datetime in dateTime", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhDate, {
        value: new Date("2026-03-31T15:30:00.000Z")
      })
    );
    expect(html).toContain('dateTime="2026-03-31T15:30:00.000Z"');
  });

  it("renders in bn-BD locale", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhDate, {
        value: new Date(2026, 2, 31),
        locale: "bn-BD"
      })
    );
    expect(html).toContain("৩১ মার্চ ২০২৬");
  });

  it("supports long month format", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhDate, {
        value: new Date(2026, 2, 31),
        month: "long"
      })
    );
    expect(html).toContain("31 March 2026");
  });

  it("includes aria-label", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhDate, { value: new Date(2026, 2, 31) })
    );
    expect(html).toContain('aria-label="31 Mar 2026"');
  });

  it("supports custom srLabel", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhDate, {
        value: new Date(2026, 2, 31),
        srLabel: "Custom label"
      })
    );
    expect(html).toContain('aria-label="Custom label"');
  });
});

describe("TarikhRelative", () => {
  const NOW = new Date("2026-03-31T12:00:00Z").getTime();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders relative time", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhRelative, {
        value: new Date(NOW - 2 * 86_400_000)
      })
    );
    expect(html).toContain("2 days ago");
    expect(html).toContain("<time");
  });

  it("renders Bangla relative time", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhRelative, {
        value: new Date(NOW - 86_400_000),
        locale: "bn-BD"
      })
    );
    expect(html).toContain("১ দিন আগে");
  });

  it("preserves date-only semantics for human-readable strings", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhRelative, { value: "31 March 2026" })
    );
    expect(html).toContain('dateTime="2026-03-31"');
  });
});

describe("TarikhCalendar", () => {
  it("renders Bangla calendar date in English by default", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhCalendar, { value: "2026-03-31" })
    );
    expect(html).toContain("17 Chaitra 1432");
    expect(html).toContain("<time");
    expect(html).toContain('dateTime="2026-03-31"');
  });

  it("preserves date-only semantics for human-readable strings", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhCalendar, { value: "31 March 2026" })
    );
    expect(html).toContain('dateTime="2026-03-31"');
  });

  it("preserves a full datetime in dateTime", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhCalendar, {
        value: new Date("2026-03-31T15:30:00.000Z")
      })
    );
    expect(html).toContain('dateTime="2026-03-31T15:30:00.000Z"');
  });

  it("renders Bangla digits and month when locale is bn-BD", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhCalendar, {
        value: new Date(2026, 2, 31),
        locale: "bn-BD"
      })
    );
    expect(html).toContain("১৭ই চৈত্র ১৪৩২");
  });

  it("renders Pohela Baishakh in English by default", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhCalendar, { value: new Date(2026, 3, 14) })
    );
    expect(html).toContain("1 Baishakh 1433");
  });

  it("supports custom srLabel", () => {
    const html = renderToStaticMarkup(
      createElement(TarikhCalendar, {
        value: new Date(2026, 2, 31),
        srLabel: "Bengali date"
      })
    );
    expect(html).toContain('aria-label="Bengali date"');
  });
});
