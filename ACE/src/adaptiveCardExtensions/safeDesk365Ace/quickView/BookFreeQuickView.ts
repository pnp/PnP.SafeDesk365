import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SafeDesk365AceAdaptiveCardExtensionStrings';
import { ISafeDesk365AceAdaptiveCardExtensionProps } from '../ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from '../ISafeDesk365AceAdaptiveCardExtensionState';
import { Location, Desk } from 'safedesk-sdk/models';

export interface IBookFreeQuickViewData {
  locations: Location[];
  desks: Desk[];
}

export class BookFreeQuickView extends BaseAdaptiveCardView<
  ISafeDesk365AceAdaptiveCardExtensionProps,
  ISafeDesk365AceAdaptiveCardExtensionState,
  IBookFreeQuickViewData
> {
  public get data(): IBookFreeQuickViewData {
    return {
      locations: this.state.locations,
      desks: undefined
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/BookFreeTemplate.json');
  }
}