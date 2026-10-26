import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { resetStore } from '../src/store';
import { validPassenger } from './helpers';

const app = createApp();

describe('POST /bookings', () => {
  beforeEach(() => resetStore());

  it('books a free seat', async () => {
    const res = await request(app)
      .post('/bookings')
      .send({ tripId: 'CMB-KDY-0730', seatNumber: 12, passenger: validPassenger });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 'BK-00001', seatNumber: 12, status: 'CONFIRMED' });
  });

  it('rejects a seat that is already taken', async () => {
    const body = { tripId: 'CMB-KDY-0730', seatNumber: 12, passenger: validPassenger };
    await request(app).post('/bookings').send(body);
    const res = await request(app).post('/bookings').send(body);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ code: 'SEAT_TAKEN', message: 'Seat 12 is already booked' });
  });

  it('rejects a request without a tripId', async () => {
    const res = await request(app).post('/bookings').send({ seatNumber: 12, passenger: validPassenger });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: 'INVALID_TRIP_ID', message: 'tripId is required' });
  });

  it('rejects an unknown trip', async () => {
    const res = await request(app)
      .post('/bookings')
      .send({ tripId: 'NOPE', seatNumber: 12, passenger: validPassenger });

    expect(res.status).toBe(404);
    expect(res.body.code).toBe('TRIP_NOT_FOUND');
  });

  it('rejects malformed JSON', async () => {
    const res = await request(app).post('/bookings').set('Content-Type', 'application/json').send('{bad');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ code: 'INVALID_JSON', message: 'Request body must be valid JSON' });
  });

  it('rejects a seat number outside the bus', async () => {
    const res = await request(app)
      .post('/bookings')
      .send({ tripId: 'CMB-KDY-0730', seatNumber: 99, passenger: validPassenger });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('INVALID_SEAT');
  });

  it('rejects an invalid phone number', async () => {
    const res = await request(app)
      .post('/bookings')
      .send({ tripId: 'CMB-KDY-0730', seatNumber: 3, passenger: { ...validPassenger, phone: '12345' } });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('INVALID_PASSENGER');
  });
});

describe('GET /bookings/:id', () => {
  beforeEach(() => resetStore());

  it('returns 404 for an unknown booking', async () => {
    const res = await request(app).get('/bookings/BK-99999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ code: 'BOOKING_NOT_FOUND', message: 'Booking not found' });
  });
});
