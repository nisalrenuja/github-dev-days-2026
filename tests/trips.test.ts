import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';
import { resetStore } from '../src/store';

const app = createApp();

describe('GET /trips', () => {
  beforeEach(() => resetStore());

  it('lists all trips', async () => {
    const res = await request(app).get('/trips');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  it('returns seat availability for a trip', async () => {
    const res = await request(app).get('/trips/CMB-KDY-0730');
    expect(res.status).toBe(200);
    expect(res.body.availableSeats).toBe(40);
    expect(res.body.takenSeats).toEqual([]);
  });

  it('returns 404 for an unknown trip', async () => {
    const res = await request(app).get('/trips/NOPE');
    expect(res.status).toBe(404);
  });
});
