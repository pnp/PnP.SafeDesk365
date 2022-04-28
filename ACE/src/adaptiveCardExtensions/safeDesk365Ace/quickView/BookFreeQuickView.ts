import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SafeDesk365AceAdaptiveCardExtensionStrings';
import { ISafeDesk365AceAdaptiveCardExtensionProps } from '../ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from '../ISafeDesk365AceAdaptiveCardExtensionState';
import { DeskAvailability } from 'safedesk365-sdk';
import { CARD_VIEW_BOOKING_DONE_ID } from '../SafeDesk365AceAdaptiveCardExtension';

export interface IBookFreeQuickViewData {
  deskAvailability: DeskAvailability;
}

export class BookFreeQuickView extends BaseAdaptiveCardView<
  ISafeDesk365AceAdaptiveCardExtensionProps,
  ISafeDesk365AceAdaptiveCardExtensionState,
  IBookFreeQuickViewData
> {
  public get data(): IBookFreeQuickViewData {
    return {
      deskAvailability: this.state.deskAvailability
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/BookFreeTemplate.json');
  }

  public async onAction(action: IActionArguments | any): Promise<void> {
    if (action.id == "Submit") {

      // Here we create the booking, upon confirmation from the user
      const bookingId: number = await this.properties.safeDesk365.bookDesk(
        this.context.pageContext.user.email,
        this.state.bookingLocation, 
        this.state.deskAvailability.code, 
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