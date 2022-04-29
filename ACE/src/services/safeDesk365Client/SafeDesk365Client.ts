import { 
  SafeDesk365, 
  Location, 
  Desk, 
  DeskAvailability,
  Booking
} from "safedesk365-sdk";
import { TimeSlot } from './TimeSlot';

import { ISafeDesk365Client } from './ISafeDesk365Client';

export class SafeDesk365Client implements ISafeDesk365Client {

    private _client: SafeDesk365;
    private _user: string;

    /**
     * Initializes a new instance of the SafeDesk365 client
     */
    constructor(serviceUri: string, token: string, user: string) {
      this._client = new SafeDesk365(serviceUri, token);
      this._user = user;
    }
    
    /**
     * Returns the whole list of locations
     * @returns The whole list of locations
     */
    public async getLocations(): Promise<Location[]> {
      return this._client.GetLocations();
    }
 
    /**
      * Returns the whole list of desks
      * @returns The whole list of desks
      */
    public async getDesks(): Promise<Desk[]> {
        return this._client.GetDesks();
    }

    /**
      * Returns the whole list of bookings
      * @returns The whole list of bookings
      */
    public async getBookings(): Promise<Booking[]> {
      return this._client.GetAllBookings(this._user, undefined);
    }
   
    /**
      * Return the very first free spot in a specific location and date/slot
      * @returns The very first free spot in a specific location and date/slot
      */
    public async getFreeDesk(locationId: string, date: string, timeSlot: TimeSlot): Promise<DeskAvailability | undefined> {
      let freeDesk: DeskAvailability;  
      const freeDesks: DeskAvailability[] = await this.getFreeDesks(locationId, date, timeSlot);
      if (freeDesks.length > 0) {
        freeDesk = freeDesks[0];
      }
      return freeDesk;
    }

    /**
     * Return the list of desks in a specific location and date/slot
     * @returns The list of desks in a specific location and date/slot, if any
     */
    public async getFreeDesks(locationId: string, date: string, timeSlot: TimeSlot): Promise<DeskAvailability[] | undefined> {
      const availabilities: DeskAvailability[] = await this._client.GetUpcomingdeskAvailabilities(date, locationId);
      const freeDesks: DeskAvailability[] = availabilities.filter(d => d.timeSlot == timeSlot);
      return freeDesks;
    }

    /**
     * Creates a booking for a specific user, location, desk, date, and time slot
     * @returns The id of the created booking
     */
    public async bookDesk(user: string, locationId: string, deskCode: string, date: string, timeSlot: TimeSlot): Promise<number> {
      return await this._client.CreateSpecificBooking({
        title: `${user}-${deskCode}-${date}-${timeSlot}`,
        user: user,
        deskCode: deskCode,
        date: date,
        timeSlot: timeSlot,
        location: locationId 
      });
    }

    /**
     * Checks-in a booking
     * @returns The checked-in booking
     */
    public async checkIn(bookingId: number): Promise<Booking> {
      return this._client.Checkin(bookingId);
    }

    /**
     * Checks-out a booking
     * @returns The checked-out booking
     */
    public async checkOut(bookingId: number): Promise<Booking> {
      return this._client.Checkout(bookingId);
    }
}
