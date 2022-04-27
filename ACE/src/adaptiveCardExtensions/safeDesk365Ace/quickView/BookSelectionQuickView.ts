import { ISPFxAdaptiveCard, IActionArguments, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SafeDesk365AceAdaptiveCardExtensionStrings';
import { ISafeDesk365AceAdaptiveCardExtensionProps } from '../ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from '../ISafeDesk365AceAdaptiveCardExtensionState';
import { 
  QUICK_VIEW_BOOK_FREE_ID,
  QUICK_VIEW_BOOK_SPECIFIC_ID
} from '../SafeDesk365AceAdaptiveCardExtension';
import { Location, DeskAvailability } from 'safedesk365-sdk';

export interface IBookSelectionQuickViewData {
  locations: Location[];
}

export class BookSelectionQuickView extends BaseAdaptiveCardView<
  ISafeDesk365AceAdaptiveCardExtensionProps,
  ISafeDesk365AceAdaptiveCardExtensionState,
  IBookSelectionQuickViewData
> {
  public get data(): IBookSelectionQuickViewData {
    return {
      locations: this.state.locations
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/BookSelectionTemplate.json');
  }

  public async onAction(action: IActionArguments | any): Promise<void> {
    if (action.id == "SpecificDesk") {

      const desks: DeskAvailability[]  = await this.properties.safeDesk365.getFreeDesks(
        action.data.deskLocation,
        action.data.deskDate,
        action.data.deskTimeSlot
      );

      this.setState({
        bookingLocation: action.data.deskLocation,
        bookingDate: action.data.deskDate,
        desks: desks
      });

      this.quickViewNavigator.replace(QUICK_VIEW_BOOK_SPECIFIC_ID);
    } else if (action.id == "FreeDesk") {

      const freeDesk: DeskAvailability = await this.properties.safeDesk365.getFreeDesk(
        action.data.deskLocation,
        action.data.deskDate,
        action.data.deskTimeSlot
      );

      this.setState({
        bookingLocation: action.data.deskLocation,
        bookingDate: action.data.deskDate,
        deskAvailability: freeDesk
      });

      this.quickViewNavigator.replace(QUICK_VIEW_BOOK_FREE_ID);
    }
  }
}