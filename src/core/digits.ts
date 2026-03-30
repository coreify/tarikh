import { BANGLA_DIGITS, ENGLISH_DIGITS } from "./constants";

export function toBanglaDigits(input: number | string): string {
  return String(input).replace(
    /\d/g,
    (digit) => BANGLA_DIGITS[Number(digit)] ?? digit
  );
}

export function toEnglishDigits(input: number | string): string {
  return String(input).replace(/[০-৯]/g, (digit) => {
    const index = BANGLA_DIGITS.indexOf(
      digit as (typeof BANGLA_DIGITS)[number]
    );
    return index >= 0 ? (ENGLISH_DIGITS[index] ?? digit) : digit;
  });
}
