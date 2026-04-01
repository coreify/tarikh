import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getDefaults, setDefaults } from "../src";
import { fromNow } from "../src/core/relative";

describe("fromNow", () => {
  const NOW = new Date("2026-03-31T12:00:00Z").getTime();
  const initialDefaults = getDefaults();

  function resetDefaults(): void {
    setDefaults({
      locale: initialDefaults.locale,
      mode: initialDefaults.mode,
      month: initialDefaults.month ?? null,
      timeZone: initialDefaults.timeZone,
      hijriSystem: initialDefaults.hijriSystem
    });
  }

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    resetDefaults();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetDefaults();
  });

  it("returns 'just now' for very recent dates", () => {
    expect(fromNow(new Date(NOW - 500))).toBe("just now");
  });

  it("returns seconds ago", () => {
    expect(fromNow(new Date(NOW - 30_000))).toBe("30 seconds ago");
  });

  it("returns 1 minute ago", () => {
    expect(fromNow(new Date(NOW - 60_000))).toBe("1 minute ago");
  });

  it("returns minutes ago", () => {
    expect(fromNow(new Date(NOW - 5 * 60_000))).toBe("5 minutes ago");
  });

  it("returns 1 hour ago", () => {
    expect(fromNow(new Date(NOW - 3_600_000))).toBe("1 hour ago");
  });

  it("returns hours ago", () => {
    expect(fromNow(new Date(NOW - 3 * 3_600_000))).toBe("3 hours ago");
  });

  it("returns 1 day ago", () => {
    expect(fromNow(new Date(NOW - 86_400_000))).toBe("1 day ago");
  });

  it("returns days ago", () => {
    expect(fromNow(new Date(NOW - 2 * 86_400_000))).toBe("2 days ago");
  });

  it("returns 1 week ago", () => {
    expect(fromNow(new Date(NOW - 7 * 86_400_000))).toBe("1 week ago");
  });

  it("returns weeks ago", () => {
    expect(fromNow(new Date(NOW - 14 * 86_400_000))).toBe("2 weeks ago");
  });

  it("returns 1 month ago", () => {
    expect(fromNow(new Date("2026-02-28T12:00:00Z"))).toBe("1 month ago");
  });

  it("returns 1 month in the future for month-end boundaries", () => {
    expect(fromNow(new Date("2026-04-30T12:00:00Z"))).toBe("in 1 month");
  });

  it("returns 1 year ago", () => {
    expect(fromNow(new Date("2025-03-31T12:00:00Z"))).toBe("1 year ago");
  });

  it("handles future dates", () => {
    expect(fromNow(new Date(NOW + 2 * 86_400_000))).toBe("in 2 days");
  });

  it("handles future hours", () => {
    expect(fromNow(new Date(NOW + 3 * 3_600_000))).toBe("in 3 hours");
  });

  it("supports a custom base date", () => {
    expect(
      fromNow("2026-03-31T10:00:00Z", {
        baseDate: "2026-03-31T12:00:00Z"
      })
    ).toBe("2 hours ago");
  });

  it("supports short style output", () => {
    expect(fromNow(new Date(NOW - 3 * 3_600_000), { style: "short" })).toBe(
      "3h ago"
    );
    expect(fromNow(new Date(NOW + 2 * 86_400_000), { style: "short" })).toBe(
      "in 2d"
    );
  });

  it("supports custom thresholds", () => {
    expect(
      fromNow(new Date(NOW - 30_000), {
        threshold: { justNow: 60_000 }
      })
    ).toBe("just now");
    expect(
      fromNow(new Date(NOW - 10 * 86_400_000), {
        threshold: { week: 14 * 86_400_000 }
      })
    ).toBe("10 days ago");
  });

  it("returns Bangla 'just now'", () => {
    expect(fromNow(new Date(NOW - 500), { locale: "bn-BD" })).toBe("এইমাত্র");
  });

  it("returns Bangla days ago", () => {
    expect(fromNow(new Date(NOW - 2 * 86_400_000), { locale: "bn-BD" })).toBe(
      "২ দিন আগে"
    );
  });

  it("returns Bangla hours ago", () => {
    expect(fromNow(new Date(NOW - 3 * 3_600_000), { locale: "bn-BD" })).toBe(
      "৩ ঘণ্টা আগে"
    );
  });

  it("returns Bangla future", () => {
    expect(fromNow(new Date(NOW + 5 * 60_000), { locale: "bn-BD" })).toBe(
      "৫ মিনিট পরে"
    );
  });

  it("returns Bangla 1 month in the future for month-end boundaries", () => {
    expect(fromNow(new Date("2026-04-30T12:00:00Z"), { locale: "bn-BD" })).toBe(
      "১ মাস পরে"
    );
  });

  it("returns Bangla 1 day ago", () => {
    expect(fromNow(new Date(NOW - 86_400_000), { locale: "bn-BD" })).toBe(
      "১ দিন আগে"
    );
  });

  it("supports natural relative words in English", () => {
    expect(fromNow(new Date("2026-03-31T00:00:00Z"), { numeric: "auto" })).toBe(
      "today"
    );
    expect(fromNow(new Date(NOW - 86_400_000), { numeric: "auto" })).toBe(
      "yesterday"
    );
    expect(fromNow(new Date("2026-04-30T12:00:00Z"), { numeric: "auto" })).toBe(
      "next month"
    );
  });

  it("supports natural relative words in Bangla", () => {
    expect(
      fromNow(new Date("2026-03-31T00:00:00Z"), {
        locale: "bn-BD",
        numeric: "auto"
      })
    ).toBe("আজ");
    expect(
      fromNow(new Date("2026-03-31T23:59:59"), {
        locale: "bn-BD",
        numeric: "auto"
      })
    ).toBe("আজ");
    expect(
      fromNow(new Date("2026-04-30T12:00:00Z"), {
        locale: "bn-BD",
        numeric: "auto"
      })
    ).toBe("আগামী মাসে");
  });

  it("uses configured defaults when locale is omitted", () => {
    setDefaults({ locale: "bn-BD" });
    expect(fromNow(new Date(NOW - 500))).toBe("এইমাত্র");
  });
});
