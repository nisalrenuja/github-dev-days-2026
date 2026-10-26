import { Router } from 'express';
import { AppError } from '../errors';
import { logger } from '../logger';
import { store } from '../store';
import { validatePassenger } from '../validation/passenger';

export const bookingsRouter = Router();

bookingsRouter.post('/', (req, res) => {
  const { tripId, seatNumber, passenger } = req.body ?? {};

  if (typeof tripId !== 'string' || tripId === '') {
    throw new AppError(400, 'INVALID_TRIP_ID', 'tripId is required');
  }
  const trip = store.findTrip(tripId);
  if (!trip) {
    throw new AppError(404, 'TRIP_NOT_FOUND', 'Trip not found');
  }
  if (!Number.isInteger(seatNumber) || seatNumber < 1 || seatNumber > trip.seats) {
    throw new AppError(400, 'INVALID_SEAT', `seatNumber must be between 1 and ${trip.seats}`);
  }
  const seatTaken = store
    .listBookingsForTrip(trip.id)
    .some((b) => b.seatNumber === seatNumber && b.status === 'CONFIRMED');
  if (seatTaken) {
    throw new AppError(409, 'SEAT_TAKEN', `Seat ${seatNumber} is already booked`);
  }

  const result = validatePassenger(passenger);
  if (!result.ok) {
    throw new AppError(400, 'INVALID_PASSENGER', result.message);
  }

  const booking = store.addBooking({ tripId: trip.id, seatNumber, passenger: result.value });
  logger.info('Booking created', { bookingId: booking.id, tripId: trip.id, phone: booking.passenger.phone });
  res.status(201).json(booking);
});

bookingsRouter.get('/:id', (req, res) => {
  const booking = store.findBooking(req.params.id);
  if (!booking) {
    throw new AppError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
  }
  res.json(booking);
});
