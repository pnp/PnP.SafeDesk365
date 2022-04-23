import { TimeSlot } from './TimeSlot';
import { 
    Location, 
    Desk, 
    DeskAvailability 
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
     * Returns the desks of a specific location
     * @returns The desks of a specific location
     */
    getDesksByLocation: (location: string) => Promise<Desk[]>;

    /**
     * Return the very first free spot in a specific location and date/slot
     * @returns The very first free spot in a specific location and date/slot, if any
     */
    getFreeDesk: (location: string, date: Date, timeSlot: TimeSlot) => Promise<DeskAvailability | undefined>;
 
    /**
     * Checks if a specific spot in a target location and date/slot is available or not
     * @returns Whether the requested desk is available in the target location and date/slot, if any
     */
    checkDeskAvailability: (location: string, date: Date, timeSlot: TimeSlot, desk: string) => Promise<DeskAvailability | undefined>;
}
