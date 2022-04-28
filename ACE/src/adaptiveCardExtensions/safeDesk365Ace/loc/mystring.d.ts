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

  // Check-in
  CheckInTitle: string;

  // Check-out
  CheckOutTitle: string;
}

declare module 'SafeDesk365AceAdaptiveCardExtensionStrings' {
  const strings: ISafeDesk365AceAdaptiveCardExtensionStrings;
  export = strings;
}
