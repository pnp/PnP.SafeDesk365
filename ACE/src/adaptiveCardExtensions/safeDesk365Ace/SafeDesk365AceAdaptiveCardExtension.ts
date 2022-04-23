import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { BookChooseFlowQuickView } from './quickView/BookChooseFlowQuickView';
import { BookFreeQuickView } from './quickView/BookFreeQuickView';
import { BookSpecificQuickView } from './quickView/BookSpecificQuickView';
import { CheckInQuickView } from './quickView/CheckInQuickView';
import { CheckOutQuickView } from './quickView/CheckOutQuickView';
import { SafeDesk365AcePropertyPane } from './SafeDesk365AcePropertyPane';

import { ISafeDesk365AceAdaptiveCardExtensionProps } from './ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from './ISafeDesk365AceAdaptiveCardExtensionState';

import { SafeDesk365Client } from '../../services/safeDesk365Client/SafeDesk365Client';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';

const CARD_VIEW_REGISTRY_ID: string = 'SafeDesk365Ace_CARD_VIEW';
export const QUICK_VIEW_CHECKIN_ID: string = 'SafeDesk365Ace_QV_CHECKIN';
export const QUICK_VIEW_CHECKOUT_ID: string = 'SafeDesk365Ace_QV_CHECKOUT';
export const QUICK_VIEW_BOOK_CHOOSE_FLOW_ID: string = 'SafeDesk365Ace_QV_BOOK_CHOOSE_FLOW';
export const QUICK_VIEW_BOOK_FREE_ID: string = 'SafeDesk365Ace_QV_BOOK_FREE';
export const QUICK_VIEW_BOOK_SPECIFIC_ID: string = 'SafeDesk365Ace_QV_BOOK_SPECIFIC';

export default class SafeDesk365AceAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISafeDesk365AceAdaptiveCardExtensionProps,
  ISafeDesk365AceAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SafeDesk365AcePropertyPane | undefined;
  private _safeDesk365: SafeDesk365Client;

  public async onInit(): Promise<void> {
    this.state = {
      locations: undefined
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_CHECKIN_ID, () => new CheckInQuickView());
    this.quickViewNavigator.register(QUICK_VIEW_CHECKOUT_ID, () => new CheckOutQuickView());
    this.quickViewNavigator.register(QUICK_VIEW_BOOK_CHOOSE_FLOW_ID, () => new BookChooseFlowQuickView());
    this.quickViewNavigator.register(QUICK_VIEW_BOOK_FREE_ID, () => new BookFreeQuickView());
    this.quickViewNavigator.register(QUICK_VIEW_BOOK_SPECIFIC_ID, () => new BookSpecificQuickView());

    setTimeout(this.fetchData, 200);
  
    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'SafeDesk365Ace-property-pane'*/
      './SafeDesk365AcePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.SafeDesk365AcePropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }

  private fetchData = async () => {

    // Initialize the SafeDesk365 Client if it is not yet initialized
    if (!this._safeDesk365) {

      // Initialize the AAD OAuth Token Provider, first
      const client: AadHttpClient = await this.context.aadHttpClientFactory.getClient(this.properties.safeDesk365ApiUniqueUri);
      const response: HttpClientResponse = await client.get(`${this.properties.safeDesk365ApiUri}api/locations`, AadHttpClient.configurations.v1);
      console.log(response.json());
      
      const tokenProvider = await this.context.aadTokenProviderFactory.getTokenProvider();
      const accessToken: string = await tokenProvider.getToken(this.properties.safeDesk365ApiUniqueUri);

      console.log(accessToken);

      // Then create a new instance of the SafeDesk365 Client
      this._safeDesk365 = new SafeDesk365Client(this.properties.safeDesk365ApiUri, accessToken);
    }

    const locations = await this._safeDesk365.getLocations();

    this.setState({
      locations: locations
    });
  }
}
