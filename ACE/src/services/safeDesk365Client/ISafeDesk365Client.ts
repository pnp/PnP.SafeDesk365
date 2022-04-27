import { TimeSlot } from './TimeSlot';
import { 
    Location, 
    Desk, 
    DeskAvailability,
    Booking
} from "safedesk365-sdk";

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
     * Returns the whole list of locations
     * @returns The whole list of locations
     */
    getLocations: () => Promise<Location[]>;

    /**
     * Returns the whole list of desks
     * @returns The whole list of desks
     */
    getDesks: () => Promise<Desk[]>;

    /**
     * Returns the whole list of bookings
     * @returns The whole list of bookings
     */
    getBookings: () => Promise<Booking[]>;

    /**
     * Return the very first free spot in a specific location and date/slot
     * @returns The very first free spot in a specific location and date/slot, if any
     */
    getFreeDesk: (location: string, date: string, timeSlot: TimeSlot) => Promise<DeskAvailability | undefined>;

    /**
     * Return the list of free desks in a specific location and date/slot
     * @returns The list of free desks in a specific location and date/slot, if any
     */
    getFreeDesks: (locationId: string, date: string, timeSlot: TimeSlot) => Promise<DeskAvailability[] | undefined>;

    /**
     * Creates a booking for a specific user, location, desk, date, and time slot
     * @returns The id of the created booking
     */
    bookDesk: (user: string, locationId: string, deskCode: string, date: string, timeSlot: TimeSlot) => Promise<number>;
}
