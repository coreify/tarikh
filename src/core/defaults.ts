import type {
  FormatMode,
  GlobalDefaults,
  GlobalDefaultsInput,
  HijriCalendarSystem,
  HijriTimeZone,
  Locale,
  MonthFormat
} from "../types";
import { HIJRI_TIME_ZONES } from "../types";

const DEFAULTS: GlobalDefaults = {
  locale: "en-BD",
  mode: "standard",
  month: undefined,
  timeZone: "Asia/Dhaka",
  hijriSystem: "islamic-umalqura"
};

let currentDefaults: GlobalDefaults = { ...DEFAULTS };

function assertAllowedValue<T extends string>(
  value: string,
  allowedValues: readonly T[],
  optionLabel: string
): asserts value is T {
  if (!allowedValues.includes(value as T)) {
    throw new TypeError(
      `Invalid ${optionLabel}: ${value}. Supported values: ${allowedValues.join(", ")}`
    );
  }
}

function resolveDefaultValue<T>(
  key: keyof GlobalDefaults,
  value: T | null | undefined
): T | undefined {
  if (value === null) {
    return DEFAULTS[key] as T | undefined;
  }

  if (value === undefined) {
    return undefined;
  }

  return value;
}

export function getDefaults(): GlobalDefaults {
  return { ...currentDefaults };
}

export function setDefaults(input: GlobalDefaultsInput = {}): GlobalDefaults {
  const next: GlobalDefaults = { ...currentDefaults };

  if ("locale" in input) {
    const locale = resolveDefaultValue<Locale>("locale", input.locale);
    if (locale !== undefined) {
      assertAllowedValue(locale, ["en-BD", "bn-BD"], "default locale");
      next.locale = locale;
    }
  }

  if ("mode" in input) {
    const mode = resolveDefaultValue<FormatMode>("mode", input.mode);
    if (mode !== undefined) {
      assertAllowedValue(
        mode,
        ["standard", "bangla", "hijri", "hybrid"],
        "default mode"
      );
      next.mode = mode;
    }
  }

  if ("month" in input) {
    const month = resolveDefaultValue<MonthFormat>("month", input.month);
    if (month === undefined) {
      next.month = undefined;
    } else {
      assertAllowedValue(month, ["short", "long"], "default month format");
      next.month = month;
    }
  }

  if ("timeZone" in input) {
    const timeZone = resolveDefaultValue<HijriTimeZone>(
      "timeZone",
      input.timeZone
    );
    if (timeZone !== undefined) {
      assertAllowedValue(timeZone, HIJRI_TIME_ZONES, "default Hijri time zone");
      next.timeZone = timeZone;
    }
  }

  if ("hijriSystem" in input) {
    const hijriSystem = resolveDefaultValue<HijriCalendarSystem>(
      "hijriSystem",
      input.hijriSystem
    );
    if (hijriSystem !== undefined) {
      assertAllowedValue(
        hijriSystem,
        ["islamic-umalqura", "islamic-civil"],
        "default Hijri calendar system"
      );
      next.hijriSystem = hijriSystem;
    }
  }

  currentDefaults = next;
  return getDefaults();
}
