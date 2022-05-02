import { Booking } from "safedesk365-sdk";

/**
 * Define a custom Error type for the SafeDesk API Client Service
 */
 export class SafeDeskClientError extends Error {
   constructor(message: string) {
       super(message);
   }
}

/**
 * Defines the abstract interface for the Assets Service
 */
export interface ISafeDesk365Client {

    /**
     * Returns the whole list of bookings
     * @returns The whole list of bookings
     */
    getBookings: () => Promise<Booking[]>;

    /**
     * Deletes a booking
     * @returns Whether the booking was removed or not
     */
    removeBooking: (bookingId: number) => Promise<boolean>;
}
