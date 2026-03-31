import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Tarikh } from "../src/react";

describe("Tarikh", () => {
  it("renders a time element with formatted date", () => {
    const html = renderToStaticMarkup(
      createElement(Tarikh, { value: "2026-03-31" })
    );
    expect(html).toContain("31 Mar 2026");
    expect(html).toContain("<time");
    expect(html).toContain('dateTime="2026-03-31"');
  });

  it("preserves date-only semantics for human-readable strings", () => {
    const html = renderToStaticMarkup(
      createElement(Tarikh, { value: "31 March 2026" })
    );
    expect(html).toContain('dateTime="2026-03-31"');
  });

  it("preserves a full datetime in dateTime", () => {
    const html = renderToStaticMarkup(
      createElement(Tarikh, {
        value: new Date("2026-03-31T15:30:00.000Z")
      })
    );
    expect(html).toContain('dateTime="2026-03-31T15:30:00.000Z"');
  });

  it("renders in bn-BD locale", () => {
    const html = renderToStaticMarkup(
      createElement(Tarikh, {
        value: new Date(2026, 2, 31),
        locale: "bn-BD"
      })
    );
    expect(html).toContain("৩১ মার্চ ২০২৬");
  });

  it("supports long month format", () => {
    const html = renderToStaticMarkup(
      createElement(Tarikh, {
        value: new Date(2026, 2, 31),
        month: "long"
      })
    );
    expect(html).toContain("31 March 2026");
  });

  it("supports weekday and time props", () => {
    const html = renderToStaticMarkup(
      createElement(Tarikh, {
        value: new Date(2026, 2, 31, 15, 4),
        weekday: "short",
        hour: "numeric",
        minute: "2-digit"
      })
    );
    expect(html).toContain("Tue, 31 Mar 2026, 15:04");
  });

  it("includes aria-label", () => {
    const html = renderToStaticMarkup(
      createElement(Tarikh, { value: new Date(2026, 2, 31) })
    );
    expect(html).toContain('aria-label="31 Mar 2026"');
  });

  it("prefers srLabel over aria-label", () => {
    const html = renderToStaticMarkup(
      createElement(Tarikh, {
        value: new Date(2026, 2, 31),
        srLabel: "Screen reader label",
        "aria-label": "Fallback label"
      })
    );
    expect(html).toContain('aria-label="Screen reader label"');
    expect(html).not.toContain('aria-label="Fallback label"');
  });

  it("supports custom srLabel", () => {
    const html = renderToStaticMarkup(
      createElement(Tarikh, {
        value: new Date(2026, 2, 31),
        srLabel: "Custom label"
      })
    );
    expect(html).toContain('aria-label="Custom label"');
  });

  it("renders compound Relative and Bangla components", () => {
    const NOW = new Date("2026-03-31T12:00:00Z").getTime();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    try {
      const relativeHtml = renderToStaticMarkup(
        createElement(Tarikh.Relative, {
          value: new Date(NOW - 86_400_000),
          numeric: "auto"
        })
      );
      const banglaHtml = renderToStaticMarkup(
        createElement(Tarikh.Bangla, {
          value: new Date(2026, 3, 14),
          locale: "bn-BD",
          format: "spoken"
        })
      );

      expect(relativeHtml).toContain("yesterday");
      expect(banglaHtml).toContain("পহেলা বৈশাখ ১৪৩৩");
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("Tarikh.Relative", () => {
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
      createElement(Tarikh.Relative, {
        value: new Date(NOW - 2 * 86_400_000)
      })
    );
    expect(html).toContain("2 days ago");
    expect(html).toContain("<time");
  });

  it("renders Bangla relative time", () => {
    const html = renderToStaticMarkup(
      createElement(Tarikh.Relative, {
        value: new Date(NOW - 86_400_000),
        locale: "bn-BD"
      })
    );
    expect(html).toContain("১ দিন আগে");
  });

  it("prefers srLabel over aria-label for compound variants", () => {
    const banglaHtml = renderToStaticMarkup(
      createElement(Tarikh.Bangla, {
        value: "2026-04-14",
        locale: "bn-BD",
        srLabel: "Bangla label",
        "aria-label": "Fallback label"
      })
    );

    const relativeHtml = renderToStaticMarkup(
      createElement(Tarikh.Relative, {
        value: "2026-03-30",
        srLabel: "Relative label",
        "aria-label": "Fallback label"
      })
    );

    expect(banglaHtml).toContain('aria-label="Bangla label"');
    expect(banglaHtml).not.toContain('aria-label="Fallback label"');
    expect(banglaHtml).toContain('dateTime="2026-04-14"');
    expect(relativeHtml).toContain('aria-label="Relative label"');
    expect(relativeHtml).not.toContain('aria-label="Fallback label"');
    expect(relativeHtml).toContain('dateTime="2026-03-30"');
  });

  it("preserves date-only semantics for human-readable strings", () => {
    const html = renderToStaticMarkup(
      createElement(Tarikh.Relative, { value: "31 March 2026" })
    );
    expect(html).toContain('dateTime="2026-03-31"');
  });

  it("supports natural relative wording", () => {
    const html = renderToStaticMarkup(
      createElement(Tarikh.Relative, {
        value: new Date("2026-03-31T00:00:00Z"),
        numeric: "auto"
      })
    );
    expect(html).toContain("today");
  });
});
