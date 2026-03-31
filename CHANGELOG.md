# Changelog

All notable changes to this package are documented in this file.

## Unreleased

- Tightened `format()` contract for token patterns:
  - Passing both `pattern` and `mode` now throws at runtime.
  - `PatternFormatOptions` now disallows `mode` in TypeScript (`mode?: never`).
- Added pattern literal escaping with square brackets, for example:
  - `format(date, { pattern: "[Today at] h:mm a" })`.
- Hardened parsing and tests:
  - Strict timezone offset bounds validation.
  - Additional parser and React `<time dateTime>` contract coverage.
