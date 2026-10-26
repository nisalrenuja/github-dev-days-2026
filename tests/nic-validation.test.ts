import { describe, expect, it } from 'vitest';
import { maskNic, validateNic } from '../.github/skills/nic-validation/scripts/validate-nic';

describe('validateNic', () => {
  it.each([
    ['951234567V', 'old', 1995, 'male', '951234567V'],
    ['958234567v', 'old', 1995, 'female', '958234567V'],
    ['199512345678', 'new', 1995, 'male', '199512345678'],
    ['199582345678', 'new', 1995, 'female', '199582345678'],
    ['  951234567X ', 'old', 1995, 'male', '951234567X'],
  ])('accepts %s', (input, format, birthYear, gender, normalized) => {
    expect(validateNic(input)).toEqual({ ok: true, format, birthYear, gender, normalized });
  });

  it.each(['95123456V', '951234567Z', '950004567V', '954004567V', '199587045678', '189912345678', 'abc', ''])(
    'rejects %s',
    (input) => {
      expect(validateNic(input).ok).toBe(false);
    },
  );

  it('rejects values that are not strings', () => {
    expect(validateNic(951234567)).toEqual({ ok: false, message: 'NIC must be a string' });
  });

  it('never echoes the NIC in error messages', () => {
    const result = validateNic('954004567V');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).not.toContain('954004567');
  });
});

describe('maskNic', () => {
  it('keeps only the last 4 characters', () => {
    expect(maskNic('951234567V')).toBe('******567V');
    expect(maskNic('199512345678')).toBe('********5678');
  });
});
