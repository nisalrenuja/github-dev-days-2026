---
name: nic-validation
description: Validate Sri Lankan NIC (National Identity Card) numbers, old and new formats. Use when a task reads, validates, stores, masks or logs a NIC field.
---

# NIC validation

Use `scripts/validate-nic.ts`. Do not write a new regex for NIC numbers.
Never write a raw NIC to logs.

## How to use it

1. Copy `scripts/validate-nic.ts` from this skill to `src/validation/nic.ts` if it is not there yet. Do not change its logic.
2. Call `validateNic(value)`. It returns `{ ok: true, format, normalized, birthYear, gender }` or `{ ok: false, message }`.
3. Store `normalized` (trimmed, upper case), not the raw input.
4. When a NIC must appear in a log or a response that is not the passenger's own booking, use `maskNic(value)`.
5. Add test cases from `examples.md` to the tests for the code you changed.

To check one value from the terminal:

```
npx tsx .github/skills/nic-validation/scripts/validate-nic.ts 199512345678
```

## The two formats

| Format | Shape | Example |
| --- | --- | --- |
| Old (before 2016) | 9 digits + `V` or `X` | `951234567V` |
| New | 12 digits | `199512345678` |

- Old: digits 1-2 are the birth year (`95` = 1995), digits 3-5 are the day of the year.
- New: digits 1-4 are the birth year, digits 5-7 are the day of the year.
- Day of the year is 001-366 for men and 501-866 for women (500 is added).
- `V` and `X` may arrive in lower case. Accept them and upper case them.
