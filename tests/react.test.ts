import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Tarikh } from "../src/react";

describe("react <time> dateTime semantics", () => {
  it("keeps date-only input as date-only dateTime", () => {
    const html = renderToStaticMarkup(
      createElement(Tarikh, { value: "2026-03-31" })
    );

    expect(html).toContain('dateTime="2026-03-31"');
  });

  it("preserves datetime input with microseconds as full timestamp", () => {
    const html = renderToStaticMarkup(
      createElement(Tarikh, { value: "2026-03-31T15:30:00.123456Z" })
    );

    expect(html).toContain('dateTime="2026-03-31T15:30:00.123Z"');
  });

  it("keeps datetime semantics for Tarikh.Relative and Tarikh.Bangla", () => {
    const relative = renderToStaticMarkup(
      createElement(Tarikh.Relative, { value: "2026-03-31T15:30:00Z" })
    );
    const bangla = renderToStaticMarkup(
      createElement(Tarikh.Bangla, { value: "2026-03-31T15:30:00Z" })
    );

    expect(relative).toContain('dateTime="2026-03-31T15:30:00.000Z"');
    expect(bangla).toContain('dateTime="2026-03-31T15:30:00.000Z"');
  });
});
