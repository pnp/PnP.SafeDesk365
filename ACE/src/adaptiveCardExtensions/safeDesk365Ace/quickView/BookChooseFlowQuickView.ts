import { ISPFxAdaptiveCard, IActionArguments, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SafeDesk365AceAdaptiveCardExtensionStrings';
import { ISafeDesk365AceAdaptiveCardExtensionProps } from '../ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from '../ISafeDesk365AceAdaptiveCardExtensionState';
import { 
  QUICK_VIEW_BOOK_FREE_ID,
  QUICK_VIEW_BOOK_SPECIFIC_ID
} from '../SafeDesk365AceAdaptiveCardExtension';

export interface IBookChooseFlowQuickViewData {
}

export class BookChooseFlowQuickView extends BaseAdaptiveCardView<
  ISafeDesk365AceAdaptiveCardExtensionProps,
  ISafeDesk365AceAdaptiveCardExtensionState,
  IBookChooseFlowQuickViewData
> {
  public get data(): IBookChooseFlowQuickViewData {
    return {};
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/BookChooseFlowTemplate.json');
  }

  public onAction(action: IActionArguments | any): void {
    if (action.id == "SpecificDesk") {
      this.quickViewNavigator.push(QUICK_VIEW_BOOK_SPECIFIC_ID);
    } else if (action.id == "FreeDesk") {
      this.quickViewNavigator.push(QUICK_VIEW_BOOK_FREE_ID);
    }
  }
}