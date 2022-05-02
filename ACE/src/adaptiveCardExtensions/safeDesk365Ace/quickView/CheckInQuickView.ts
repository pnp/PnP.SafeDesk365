import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SafeDesk365AceAdaptiveCardExtensionStrings';
import { ISafeDesk365AceAdaptiveCardExtensionProps } from '../ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from '../ISafeDesk365AceAdaptiveCardExtensionState';
import { Booking } from 'safedesk365-sdk';
import { CARD_VIEW_BOOKING_CHECKEDIN_ID } from '../SafeDesk365AceAdaptiveCardExtension';

export interface ICheckInQuickViewData {
  todaysBookings: Booking[];
  strings: ISafeDesk365AceAdaptiveCardExtensionStrings;
}

export class CheckInQuickView extends BaseAdaptiveCardView<
  ISafeDesk365AceAdaptiveCardExtensionProps,
  ISafeDesk365AceAdaptiveCardExtensionState,
  ICheckInQuickViewData
> {
  public get data(): ICheckInQuickViewData {
    return {
      todaysBookings: this.state.todaysBookings,
      strings: strings
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/CheckInTemplate.json');
  }

  public async onAction(action: IActionArguments | any): Promise<void> {
    if (action.id == "checkIn") {

      const bookingId: number = action.data.bookingId;

      // Here we check-in the booking
      const booking: Booking = await this.state.safeDesk365.checkIn(bookingId);

      this.quickViewNavigator.close();
      this.cardNavigator.replace(CARD_VIEW_BOOKING_CHECKEDIN_ID);
    }
  }
}