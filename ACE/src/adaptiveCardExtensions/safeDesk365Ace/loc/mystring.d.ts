declare interface ISafeDesk365AceAdaptiveCardExtensionStrings {
  PropertyPaneDescription: string;
  TitleFieldLabel: string;
  Title: string;
  SubTitle: string;
  PrimaryText: string;
  Description: string;
  QuickViewButton: string;
  RefreshQuickViewButton: string;

  // ACE Buttons
  BookDeskButton: string;
  CheckInButton: string;
  CheckOutButton: string;

  // Book Desk
  BookTitle: string;
  HereIsYourDesk: string;
  DeskCode: string;
  DeskDescription: string;
  DeskCoffeeMachine: string;
  BookDeskAction: string;
  BookingConfirmed: string;
  BookingDone: string;
  DoneAction: string;
  BookingChooseFlow: string;
  BookingLocationLabel: string;
  BookingLocationRequired: string;
  BookingLocationPlaceholder: string;
  BookingDateLabel: string
  BookingDateRequired: string;
  BookingTimeSlotLabel: string;
  BookingTimeSlotRequired: string;
  BookingTimeSlotPlaceholder: string;
  BookingTimeSlotMorning: string;
  BookingTimeSlotAfternoon: string;
  BookingFreeDesk: string;
  BookingSpecificDesk: string;
  ChooseDesk: string;
  ChooseDeskPlaceholder: string;
  ChooseDeskRequired: string;
  BookingNoSpots: string;

  // Check-in / Check-out
  CheckInTitle: string;
  CheckOutTitle: string;
  SelectBookingCheckIn: string;
  SelectBookingCheckOut: string;
  BookingsListLocationColumn: string;
  BookingsListDeskColumn: string;
  BookingsListTimeSlotColumn: string;
  BookingsListActionColumn: string;
  CheckIn: string;
  CheckOut: string;
}

declare module 'SafeDesk365AceAdaptiveCardExtensionStrings' {
  const strings: ISafeDesk365AceAdaptiveCardExtensionStrings;
  export = strings;
}
