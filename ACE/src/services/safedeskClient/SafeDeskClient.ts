import { DeviceCodeCredential } from '@azure/identity';
import { AzureIdentityAuthenticationProvider } from '@microsoft/kiota-authentication-azure';
import { AnonymousAuthenticationProvider } from '@microsoft/kiota-abstractions';
import { FetchRequestAdapter } from '@microsoft/kiota-http-fetchlibrary';
import { ApiClient } from 'safedesk-sdk/apiClient';
import { ApiRequestBuilder } from 'safedesk-sdk/api/apiRequestBuilder';
import { TimeSlot } from './TimeSlot';
import { Location, Desk, DeskAvailability } from 'safedesk-sdk/models';

import { ISafeDeskClient } from './ISafeDeskClient';

export class SafeDeskClient implements ISafeDeskClient {

    private authProvider = new AnonymousAuthenticationProvider();
    private adapter = new FetchRequestAdapter(this.authProvider);
    private client = new ApiClient(this.adapter);
    
    /**
     * Returns the whole list of locations
     * @returns The whole list of locations
     */
     public async GetLocations(): Promise<Location[]> {
        return this.client.api.locations.get();
     }
 
     /**
      * Returns the desks of a specific location
      * @returns The desks of a specific location
      */
      public async GetDesksByLocation(locationId: string): Promise<Desk[]> {
        return this.client.api.desks.locationById(locationId).get();
     }
 
     /**
      * Return the very first free spot in a specific location and date/slot
      * @returns The very first free spot in a specific location and date/slot
      */
      public async GetFreeDesk(locationId: string, date: Date, timeSlot: TimeSlot): Promise<DeskAvailability | undefined> {
        const availabilities: DeskAvailability[] = await this.client.api.deskAvailabilities.locationById(locationId).get();
        const freeDesk: DeskAvailability = availabilities.find(d => d.date == date && d.timeSlot == timeSlot);
        return freeDesk;
     }
  
     /**
      * Checks if a specific spot in a target location and date/slot is available or not
      * @returns Whether the requested desk is available in the target location and date/slot
      */
      public async CheckDeskAvailability(locationId: string, date: Date, timeSlot: TimeSlot, desk: string): Promise<DeskAvailability | undefined> {
        const availabilities: DeskAvailability[] = await this.client.api.deskAvailabilities.locationById(locationId).get();
        const freeDesk: DeskAvailability = availabilities.find(d => d.date == date && d.timeSlot == timeSlot);
        return freeDesk;
     } 
}

export const safeDesk = new SafeDeskClient();