import express from 'express';
import { errorHandler } from './errors';
import { bookingsRouter } from './routes/bookings';
import { tripsRouter } from './routes/trips';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use('/trips', tripsRouter);
  app.use('/bookings', bookingsRouter);

  app.use(errorHandler);
  return app;
}
