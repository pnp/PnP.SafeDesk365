import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SafeDesk365AceAdaptiveCardExtensionStrings';
import { ISafeDesk365AceAdaptiveCardExtensionProps } from '../ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from '../ISafeDesk365AceAdaptiveCardExtensionState';
import { Booking } from 'safedesk365-sdk';
import { CARD_VIEW_BOOKING_CHECKEDOUT_ID } from '../SafeDesk365AceAdaptiveCardExtension';

export interface ICheckOutQuickViewData {
  todaysBookings: Booking[];
  strings: ISafeDesk365AceAdaptiveCardExtensionStrings;
}

export class CheckOutQuickView extends BaseAdaptiveCardView<
  ISafeDesk365AceAdaptiveCardExtensionProps,
  ISafeDesk365AceAdaptiveCardExtensionState,
  ICheckOutQuickViewData
> {
  public get data(): ICheckOutQuickViewData {
    return {
      todaysBookings: this.state.todaysBookings,
      strings: strings
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/CheckOutTemplate.json');
  }

  public async onAction(action: IActionArguments | any): Promise<void> {
    if (action.id == "checkOut") {

      const bookingId: number = action.data.bookingId;

      // Here we check-out the booking
      const booking: Booking = await this.properties.safeDesk365.checkOut(bookingId);

      this.quickViewNavigator.close();
      this.cardNavigator.replace(CARD_VIEW_BOOKING_CHECKEDOUT_ID);
    }
  }
}