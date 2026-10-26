import { Router } from 'express';
import { store } from '../store';

export const tripsRouter = Router();

tripsRouter.get('/', (_req, res) => {
  res.json(store.listTrips());
});

tripsRouter.get('/:id', (req, res) => {
  const trip = store.findTrip(req.params.id);
  if (!trip) {
    res.status(404).json({ error: 'Trip not found' });
    return;
  }
  const taken = store
    .listBookingsForTrip(trip.id)
    .filter((b) => b.status === 'CONFIRMED')
    .map((b) => b.seatNumber);
  res.json({ ...trip, availableSeats: trip.seats - taken.length, takenSeats: taken });
});
