import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SafeDesk365AceAdaptiveCardExtensionStrings';
import { ISafeDesk365AceAdaptiveCardExtensionProps } from '../ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from '../ISafeDesk365AceAdaptiveCardExtensionState';
import { DeskAvailability } from 'safedesk365-sdk';
import { CARD_VIEW_BOOKING_DONE_ID } from '../SafeDesk365AceAdaptiveCardExtension';

export interface IBookSpecificQuickViewData {
  desks: DeskAvailability[];
}

export class BookSpecificQuickView extends BaseAdaptiveCardView<
  ISafeDesk365AceAdaptiveCardExtensionProps,
  ISafeDesk365AceAdaptiveCardExtensionState,
  IBookSpecificQuickViewData
> {
  public get data(): IBookSpecificQuickViewData {
    return {
      desks: this.state.desks,
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/BookSpecificTemplate.json');
  }

  public async onAction(action: IActionArguments | any): Promise<void> {
    if (action.id == "Submit") {

      const deskCode: string = action.data.specificDesk;

      // Here we create the booking, upon confirmation from the user
      const bookingId: number = await this.properties.safeDesk365.bookDesk(
        this.context.pageContext.user.email,
        this.state.bookingLocation, 
        deskCode, 
        this.state.bookingDate, 
        this.state.bookingTimeSlot);

      this.setState({
        bookingId: bookingId
      });

      this.quickViewNavigator.close();
      this.cardNavigator.replace(CARD_VIEW_BOOKING_DONE_ID);
    }
  }
}