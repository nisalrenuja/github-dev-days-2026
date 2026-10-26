import type { Passenger } from '../store';

export type ValidationResult = { ok: true; value: Passenger } | { ok: false; message: string };

const SRI_LANKA_MOBILE = /^07\d{8}$/;

// Validates the passenger form sent with a booking request.
export function validatePassenger(input: unknown): ValidationResult {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, message: 'passenger is required' };
  }
  const { name, nic, phone } = input as Record<string, unknown>;

  if (typeof name !== 'string' || name.trim().length < 2) {
    return { ok: false, message: 'passenger.name must be at least 2 characters' };
  }
  if (typeof nic !== 'string' || nic.trim() === '') {
    return { ok: false, message: 'passenger.nic is required' };
  }
  if (typeof phone !== 'string' || !SRI_LANKA_MOBILE.test(phone)) {
    return { ok: false, message: 'passenger.phone must be a Sri Lankan mobile number like 0771234567' };
  }

  return { ok: true, value: { name: name.trim(), nic: nic.trim(), phone } };
}
