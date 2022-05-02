import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import { Booking } from 'safedesk365-sdk';
import * as strings from 'SafeDesk365AceAdaptiveCardExtensionStrings';
import { ISafeDesk365AceAdaptiveCardExtensionProps } from '../ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from '../ISafeDesk365AceAdaptiveCardExtensionState';
import { CARD_VIEW_WELCOME_ID } from '../SafeDesk365AceAdaptiveCardExtension';

export class BookingCheckedInView extends BaseImageCardView<ISafeDesk365AceAdaptiveCardExtensionProps, ISafeDesk365AceAdaptiveCardExtensionState> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.RefreshQuickViewButton,
        id: 'refresh',
        action: {
          type: 'Submit',
          parameters: {}
        }
      }
    ];
  }

  public get data(): IImageCardParameters {
    return {
      primaryText: `Congrats! You checked-in!`,
      imageUrl: require('../assets/great-job-164x180.png'),
      title: this.properties.title
    };
  }

  public async onAction(action: IActionArguments | any): Promise<void> {
    if (action.id == "refresh") {
      this.setState({
        bookingDate: undefined,
        bookingLocation: undefined,
        bookingTimeSlot: undefined,
        bookingId: undefined,
        deskAvailability: undefined,
        desks: undefined
      });

      // Refresh data
      await this.state.fetchData();

      this.cardNavigator.replace(CARD_VIEW_WELCOME_ID);
    }
  }
}
