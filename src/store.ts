export interface Trip {
  id: string;
  from: string;
  to: string;
  departure: string;
  seats: number;
  fareLkr: number;
}

export interface Passenger {
  name: string;
  nic: string;
  phone: string;
}

export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

export interface Booking {
  id: string;
  tripId: string;
  seatNumber: number;
  passenger: Passenger;
  status: BookingStatus;
  createdAt: string;
}

const seedTrips: Trip[] = [
  { id: 'CMB-KDY-0730', from: 'Colombo', to: 'Kandy', departure: '2026-11-02T07:30:00+05:30', seats: 40, fareLkr: 850 },
  { id: 'CMB-GLE-0900', from: 'Colombo', to: 'Galle', departure: '2026-11-02T09:00:00+05:30', seats: 45, fareLkr: 720 },
  { id: 'KDY-JAF-2100', from: 'Kandy', to: 'Jaffna', departure: '2026-11-02T21:00:00+05:30', seats: 32, fareLkr: 2400 },
];

let trips: Trip[] = [];
let bookings: Booking[] = [];
let nextBookingNumber = 1;

export function resetStore() {
  trips = seedTrips.map((trip) => ({ ...trip }));
  bookings = [];
  nextBookingNumber = 1;
}

resetStore();

export const store = {
  listTrips: () => trips,
  findTrip: (id: string) => trips.find((trip) => trip.id === id),
  listBookingsForTrip: (tripId: string) => bookings.filter((b) => b.tripId === tripId),
  findBooking: (id: string) => bookings.find((b) => b.id === id),
  addBooking(data: Omit<Booking, 'id' | 'status' | 'createdAt'>): Booking {
    const booking: Booking = {
      ...data,
      id: `BK-${String(nextBookingNumber++).padStart(5, '0')}`,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    return booking;
  },
};
