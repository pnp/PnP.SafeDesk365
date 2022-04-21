import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SafeDesk365AceAdaptiveCardExtensionStrings';
import { 
  ISafeDesk365AceAdaptiveCardExtensionProps, 
  ISafeDesk365AceAdaptiveCardExtensionState, 
  QUICK_VIEW_BOOK_CHOOSE_FLOW_ID,
  QUICK_VIEW_CHECKIN_ID,
  QUICK_VIEW_CHECKOUT_ID
} from '../SafeDesk365AceAdaptiveCardExtension';

export class CardView extends BaseImageCardView<ISafeDesk365AceAdaptiveCardExtensionProps, ISafeDesk365AceAdaptiveCardExtensionState> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.BookDeskButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_BOOK_CHOOSE_FLOW_ID
          }
        }
      },
      {
        title: strings.CheckInButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_CHECKIN_ID
          }
        }
      }
      // ,
      // {
      //   title: strings.CheckOutButton,
      //   action: {
      //     type: 'QuickView',
      //     parameters: {
      //       view: QUICK_VIEW_CHECKOUT_ID
      //     }
      //   }
      // }
    ];
  }

  public get data(): IImageCardParameters {
    return {
      primaryText: strings.PrimaryText,
      imageUrl: require('../assets/coworking-green-desk-164x180.png'),
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
