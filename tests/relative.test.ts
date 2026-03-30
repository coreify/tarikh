import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fromNow } from "../src/core/relative";

describe("fromNow", () => {
  const NOW = new Date("2026-03-31T12:00:00Z").getTime();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
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

  // Bangla locale tests
  it("returns Bangla 'just now'", () => {
    expect(fromNow(new Date(NOW - 500), { locale: "bn-BD" })).toBe(
      "এইমাত্র"
    );
  });

  it("returns Bangla days ago", () => {
    expect(fromNow(new Date(NOW - 2 * 86_400_000), { locale: "bn-BD" })).toBe(
      "২ দিন আগে"
    );
  });

  it("returns Bangla hours ago", () => {
    expect(
      fromNow(new Date(NOW - 3 * 3_600_000), { locale: "bn-BD" })
    ).toBe("৩ ঘণ্টা আগে");
  });

  it("returns Bangla future", () => {
    expect(
      fromNow(new Date(NOW + 5 * 60_000), { locale: "bn-BD" })
    ).toBe("৫ মিনিট পরে");
  });

  it("returns Bangla 1 month in the future for month-end boundaries", () => {
    expect(
      fromNow(new Date("2026-04-30T12:00:00Z"), { locale: "bn-BD" })
    ).toBe("১ মাস পরে");
  });

  it("returns Bangla 1 day ago", () => {
    expect(
      fromNow(new Date(NOW - 86_400_000), { locale: "bn-BD" })
    ).toBe("১ দিন আগে");
  });
});
