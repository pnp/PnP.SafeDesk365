import { 
  SafeDesk365, 
  Booking
} from "safedesk365-sdk";

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
      * Returns the whole list of bookings
      * @returns The whole list of bookings
      */
    public async getBookings(): Promise<Booking[]> {
      return this._client.GetAllBookings(this._user, undefined);
    }

    /**
     * Deletes a booking
     * @returns No result
     */
    public async deleteBooking(bookingId: number): Promise<boolean> {
      return this._client.RemoveBooking(bookingId);
    }
}
