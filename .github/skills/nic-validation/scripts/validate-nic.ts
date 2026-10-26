export type NicFormat = 'old' | 'new';

export type NicResult =
  | { ok: true; format: NicFormat; normalized: string; birthYear: number; gender: 'male' | 'female' }
  | { ok: false; message: string };

const OLD_NIC = /^(\d{2})(\d{3})\d{4}[VX]$/;
const NEW_NIC = /^(\d{4})(\d{3})\d{5}$/;

// Error messages never echo the NIC back, so they are safe to return or log.
export function validateNic(input: unknown): NicResult {
  if (typeof input !== 'string') {
    return { ok: false, message: 'NIC must be a string' };
  }
  const normalized = input.trim().toUpperCase();

  const oldMatch = OLD_NIC.exec(normalized);
  const newMatch = NEW_NIC.exec(normalized);
  const match = oldMatch ?? newMatch;
  if (!match) {
    return { ok: false, message: 'NIC must be 9 digits followed by V or X, or 12 digits' };
  }

  const format: NicFormat = oldMatch ? 'old' : 'new';
  const birthYear = format === 'old' ? 1900 + Number(match[1]) : Number(match[1]);
  if (birthYear < 1900 || birthYear > new Date().getFullYear()) {
    return { ok: false, message: 'NIC has an invalid birth year' };
  }

  let day = Number(match[2]);
  const gender = day > 500 ? 'female' : 'male';
  if (gender === 'female') day -= 500;
  if (day < 1 || day > 366) {
    return { ok: false, message: 'NIC has an invalid day of the year' };
  }

  return { ok: true, format, normalized, birthYear, gender };
}

// Keeps the last 4 characters so support staff can match a record without seeing the full number.
export function maskNic(input: string): string {
  const value = input.trim();
  return '*'.repeat(Math.max(value.length - 4, 0)) + value.slice(-4);
}

const isCli = process.argv[1]?.replace(/\\/g, '/').endsWith('validate-nic.ts');
if (isCli) {
  const value = process.argv[2];
  if (!value) {
    console.error('Usage: npx tsx validate-nic.ts <nic>');
    process.exit(2);
  }
  const result = validateNic(value);
  console.log(JSON.stringify(result.ok ? { ...result, normalized: maskNic(result.normalized) } : result, null, 2));
  process.exit(result.ok ? 0 : 1);
}
