import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SafeDesk365AceAdaptiveCardExtensionStrings';
import { ISafeDesk365AceAdaptiveCardExtensionProps } from '../ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from '../ISafeDesk365AceAdaptiveCardExtensionState';
import { Location, Desk } from 'safedesk-sdk/models';

export interface IBookSpecificQuickViewData {
  locations: Location[];
  desks: Desk[];
}

export class BookSpecificQuickView extends BaseAdaptiveCardView<
  ISafeDesk365AceAdaptiveCardExtensionProps,
  ISafeDesk365AceAdaptiveCardExtensionState,
  IBookSpecificQuickViewData
> {
  public get data(): IBookSpecificQuickViewData {
    return {
      locations: this.state.locations,
      desks: undefined
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/BookSpecificTemplate.json');
  }
}