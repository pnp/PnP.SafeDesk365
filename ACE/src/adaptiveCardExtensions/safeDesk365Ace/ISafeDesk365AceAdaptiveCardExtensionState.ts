import { Location, Booking, DeskAvailability } from 'safedesk365-sdk';
import { TimeSlot } from '../../services/safeDesk365Client/TimeSlot';

export interface ISafeDesk365AceAdaptiveCardExtensionState {
    loading: boolean;
    locations?: Location[];
    desks?: DeskAvailability[];
    bookings?: Booking[]; 
    todaysBookings?: Booking[]; 
    bookingDate?: string;
    bookingLocation?: string;
    bookingTimeSlot?: TimeSlot;
    deskAvailability?: DeskAvailability;
    bookingId?: number;
}