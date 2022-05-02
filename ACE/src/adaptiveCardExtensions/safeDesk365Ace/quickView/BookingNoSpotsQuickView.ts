import { ISPFxAdaptiveCard, IActionArguments, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SafeDesk365AceAdaptiveCardExtensionStrings';
import { ISafeDesk365AceAdaptiveCardExtensionProps } from '../ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from '../ISafeDesk365AceAdaptiveCardExtensionState';
import { CARD_VIEW_WELCOME_ID } from '../SafeDesk365AceAdaptiveCardExtension';

export interface IBookingNoSpotsQuickViewData {
  strings: ISafeDesk365AceAdaptiveCardExtensionStrings;
}

export class BookingNoSpotsQuickView extends BaseAdaptiveCardView<
  ISafeDesk365AceAdaptiveCardExtensionProps,
  ISafeDesk365AceAdaptiveCardExtensionState,
  IBookingNoSpotsQuickViewData
> {
  public get data(): IBookingNoSpotsQuickViewData {
    return {
      strings: strings
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/BookingNoSpotsTemplate.json');
  }

  public async onAction(action: IActionArguments | any): Promise<void> {
    if (action.id == "Submit") {
      this.quickViewNavigator.close();
      this.cardNavigator.replace(CARD_VIEW_WELCOME_ID);
    }
  }
}