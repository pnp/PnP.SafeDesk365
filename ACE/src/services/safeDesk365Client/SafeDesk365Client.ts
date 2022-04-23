import { 
  SafeDesk365, 
  Location, 
  Desk, 
  DeskAvailability 
} from "safedesk365-sdk";
import { TimeSlot } from './TimeSlot';

import { ISafeDesk365Client } from './ISafeDesk365Client';

export class SafeDesk365Client implements ISafeDesk365Client {

    private _client: SafeDesk365;

    /**
     * Initializes a new instance of the SafeDesk365 client
     */
    constructor(serviceUri: string, token: string) {
      this._client = new SafeDesk365(serviceUri, token);
    }
    
    /**
     * Returns the whole list of locations
     * @returns The whole list of locations
     */
    public async getLocations(): Promise<Location[]> {
      return this._client.GetLocations();
    }
 
     /**
      * Returns the desks of a specific location
      * @returns The desks of a specific location
      */
      public async getDesksByLocation(locationId: string): Promise<Desk[]> {
        return this._client.GetDeskByLocationName(locationId);
     }
 
     /**
      * Return the very first free spot in a specific location and date/slot
      * @returns The very first free spot in a specific location and date/slot
      */
      public async getFreeDesk(locationId: string, date: Date, timeSlot: TimeSlot): Promise<DeskAvailability | undefined> {
        // const availabilities: DeskAvailability[] = await this.client.api.deskAvailabilities.locationById(locationId).get();
        // const freeDesk: DeskAvailability = availabilities.find(d => d.date == date && d.timeSlot == timeSlot);
        // return freeDesk;
        return null;
     }
  
     /**
      * Checks if a specific spot in a target location and date/slot is available or not
      * @returns Whether the requested desk is available in the target location and date/slot
      */
      public async checkDeskAvailability(locationId: string, date: Date, timeSlot: TimeSlot, desk: string): Promise<DeskAvailability | undefined> {
        // const availabilities: DeskAvailability[] = await this.client.api.deskAvailabilities.locationById(locationId).get();
        // const freeDesk: DeskAvailability = availabilities.find(d => d.date == date && d.timeSlot == timeSlot);
        // return freeDesk;
        return null;
     } 
}
