import { Booking } from "safedesk365-sdk";

export interface ISafeDesk365State {
  loading: boolean;
  bookings: Booking[];
}
