import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import { Booking } from 'safedesk365-sdk';
import * as strings from 'SafeDesk365AceAdaptiveCardExtensionStrings';
import { ISafeDesk365AceAdaptiveCardExtensionProps } from '../ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from '../ISafeDesk365AceAdaptiveCardExtensionState';
import { 
  QUICK_VIEW_BOOK_SELECTION_ID,
  QUICK_VIEW_CHECKIN_ID,
  QUICK_VIEW_CHECKOUT_ID
} from '../SafeDesk365AceAdaptiveCardExtension';

export class CardView extends BaseImageCardView<ISafeDesk365AceAdaptiveCardExtensionProps, ISafeDesk365AceAdaptiveCardExtensionState> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    
    let result: [ICardButton] | [ICardButton, ICardButton] | undefined = undefined;
    
    if (!this.state.loading) {

      // Check if we have bookings for today
      const today: Date = new Date();
      var todaysBookings: Booking[] = this.state.bookings
        .filter(i => 
          {
            let itemDate = new Date(i.date);
            return (`${itemDate.getFullYear()}-${itemDate.getMonth()}-${itemDate.getDate()}` == `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`);             
          });

      let buttons: ICardButton[] = [];

      buttons.push(        {
        title: strings.BookDeskButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_BOOK_SELECTION_ID
          }
        }
      });

      if (todaysBookings && todaysBookings.length > 0) {
        if (todaysBookings[0].checkInTime == null || todaysBookings[0].checkInTime == "1900-01-01T00:00:00") {
          buttons.push({
            title: strings.CheckInButton,
            action: {
              type: 'QuickView',
              parameters: {
                view: QUICK_VIEW_CHECKIN_ID
              }
            }
          });
        } else {
          buttons.push({
            title: strings.CheckOutButton,
            action: {
              type: 'QuickView',
              parameters: {
                view: QUICK_VIEW_CHECKOUT_ID
              }
            }
          });
        }
      }

      if (buttons.length == 1) {
        result = [buttons[0]];
      } else if (buttons.length == 2) {
        result = [buttons[0], buttons[1]];
      }
    }

    return result;
  }

  public get data(): IImageCardParameters {

    let imageUrl: string;

    if (this.state.loading) {
      imageUrl = require('../assets/loading.svg');
    } else {
      imageUrl = require('../assets/coworking-green-desk-164x180.png');
    }

    return {
      primaryText: strings.PrimaryText,
      imageUrl: imageUrl,
      title: this.properties.title
    };
  }

  // public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
  //   return {
  //     type: 'ExternalLink',
  //     parameters: {
  //       target: 'https://pnp.github.io/'
  //     }
  //   };
  // }
}
