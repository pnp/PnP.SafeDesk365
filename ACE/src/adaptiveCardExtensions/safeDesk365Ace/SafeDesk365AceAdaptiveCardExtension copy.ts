import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { WelcomeCardView } from './cardView/WelcomeCardView';
import { BookingDoneCardView } from './cardView/BookingDoneCardView';
import { BookingCheckedInView } from './cardView/BookingCheckedInView';
import { BookingCheckedOutView } from './cardView/BookingCheckedOutView';
import { BookSelectionQuickView } from './quickView/BookSelectionQuickView';
import { BookFreeQuickView } from './quickView/BookFreeQuickView';
import { BookSpecificQuickView } from './quickView/BookSpecificQuickView';
import { BookingDoneQuickView } from './quickView/BookingDoneQuickView';
import { CheckInQuickView } from './quickView/CheckInQuickView';
import { CheckOutQuickView } from './quickView/CheckOutQuickView';
import { SafeDesk365AcePropertyPane } from './SafeDesk365AcePropertyPane';

import { ISafeDesk365AceAdaptiveCardExtensionProps } from './ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from './ISafeDesk365AceAdaptiveCardExtensionState';

import { SafeDesk365Client } from '../../services/safeDesk365Client/SafeDesk365Client';
import { Booking } from 'safedesk365-sdk';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';

export const CARD_VIEW_WELCOME_ID: string = 'SafeDesk365Ace_CV_WELCOME';
export const CARD_VIEW_BOOKING_DONE_ID: string = 'SafeDesk365Ace_CV_BOOKING_DONE';
export const QUICK_VIEW_CHECKIN_ID: string = 'SafeDesk365Ace_QV_CHECKIN';
export const QUICK_VIEW_CHECKOUT_ID: string = 'SafeDesk365Ace_QV_CHECKOUT';
export const QUICK_VIEW_BOOK_SELECTION_ID: string = 'SafeDesk365Ace_QV_BOOK_SELECTION';
export const QUICK_VIEW_BOOK_FREE_ID: string = 'SafeDesk365Ace_QV_BOOK_FREE';
export const QUICK_VIEW_BOOK_SPECIFIC_ID: string = 'SafeDesk365Ace_QV_BOOK_SPECIFIC';
export const QUICK_VIEW_BOOK_DONE_ID: string = 'SafeDesk365Ace_QV_BOOK_DONE';
export const CARD_VIEW_BOOKING_CHECKEDIN_ID: string = 'SafeDesk365Ace_CV_BOOK_CHECKEIN';
export const CARD_VIEW_BOOKING_CHECKEDOUT_ID: string = 'SafeDesk365Ace_CV_BOOK_CHECKEOUT';

export default class SafeDesk365AceAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISafeDesk365AceAdaptiveCardExtensionProps,
  ISafeDesk365AceAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SafeDesk365AcePropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      loading: true,
      locations: undefined,
      desks: undefined
    };

    // Register all the card and quick views
    this.cardNavigator.register(CARD_VIEW_WELCOME_ID, () => new WelcomeCardView());
    this.cardNavigator.register(CARD_VIEW_BOOKING_DONE_ID, () => new BookingDoneCardView());
    this.cardNavigator.register(CARD_VIEW_BOOKING_CHECKEDIN_ID, () => new BookingCheckedInView());
    this.cardNavigator.register(CARD_VIEW_BOOKING_CHECKEDOUT_ID, () => new BookingCheckedOutView());
    this.quickViewNavigator.register(QUICK_VIEW_CHECKIN_ID, () => new CheckInQuickView());
    this.quickViewNavigator.register(QUICK_VIEW_CHECKOUT_ID, () => new CheckOutQuickView());
    this.quickViewNavigator.register(QUICK_VIEW_BOOK_SELECTION_ID, () => new BookSelectionQuickView());
    this.quickViewNavigator.register(QUICK_VIEW_BOOK_FREE_ID, () => new BookFreeQuickView());
    this.quickViewNavigator.register(QUICK_VIEW_BOOK_SPECIFIC_ID, () => new BookSpecificQuickView());
    this.quickViewNavigator.register(QUICK_VIEW_BOOK_DONE_ID, () => new BookingDoneQuickView());

    // Save the fetchData function in the properties
    // to make it available to the cards
    this.properties.fetchData = this.fetchData;

    // Fetch data asynchronously
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
    return CARD_VIEW_WELCOME_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }

  private fetchData = async () => {

    // Initialize the SafeDesk365 Client if it is not yet initialized
    if (!this.properties.safeDesk365) {

      // Initialize the AAD OAuth Token Provider, first
      const tokenProvider = await this.context.aadTokenProviderFactory.getTokenProvider();
      const accessToken: string = await tokenProvider.getToken(this.properties.safeDesk365ApiId);

      // Then create a new instance of the SafeDesk365 Client
      this.properties.safeDesk365 = new SafeDesk365Client(
        this.properties.safeDesk365ApiUri, 
        accessToken, 
        this.context.pageContext.user.email);
    }

    // Get the whole list of locations
    const locations = await this.properties.safeDesk365.getLocations();

    // Get the whole list of bookings for the current user
    const bookings = await this.properties.safeDesk365.getBookings();

    // Get today's bookings, if any
    const today: Date = new Date();
    const todaysBookings: Booking[] = this.state.bookings
      .filter(i => 
        {
          let itemDate = new Date(i.date);
          return (`${itemDate.getFullYear()}-${itemDate.getMonth()}-${itemDate.getDate()}` == `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`);             
        });

    this.setState({
      loading: false,
      locations: locations,
      bookings: bookings,
      todaysBookings: todaysBookings
    });
  }
}
