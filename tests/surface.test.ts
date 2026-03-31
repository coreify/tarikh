import { describe, expect, it } from "vitest";
import * as tarikh from "../src";
import * as react from "../src/react";

describe("public surface", () => {
  it("does not export legacy formatter entry points", () => {
    expect("formatDate" in tarikh).toBe(false);
    expect("formatHybridDate" in tarikh).toBe(false);
    expect("formatBanglaCalendar" in tarikh).toBe(false);
  });

  it("does not export standalone React component entry points", () => {
    expect("RelativeTime" in react).toBe(false);
    expect("BanglaDate" in react).toBe(false);
  });

  it("keeps compound React variants attached to Tarikh", () => {
    expect(react.Tarikh).toBeTruthy();
    expect(react.Tarikh.displayName).toBe("Tarikh");
    expect(react.Tarikh.Relative).toBeTruthy();
    expect(react.Tarikh.Relative.displayName).toBe("RelativeTime");
    expect(react.Tarikh.Bangla).toBeTruthy();
    expect(react.Tarikh.Bangla.displayName).toBe("BanglaDate");
  });
});
