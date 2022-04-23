import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'SafedesktestWebPartStrings';
import Safedesktest from './components/Safedesktest';
import { ISafedesktestProps } from './components/ISafedesktestProps';
import { SafeDesk365, Location } from "safedesk365-sdk"
import { AadHttpClient, HttpClientResponse, AadTokenProvider } from '@microsoft/sp-http';

export interface ISafedesktestWebPartProps {
  description: string;
}

export default class SafedesktestWebPart extends BaseClientSideWebPart<ISafedesktestWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private authLocation;
  private unAuthLocation;

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();


    return super.onInit();
  }

  public render(): void {

    var tokenId = 'cd999c9a-6a4f-4187-985f-7afac488cd2d'

    this.context.aadTokenProviderFactory.getTokenProvider()
      .then((tokenProvider: AadTokenProvider): Promise<string> => {
        // retrieve access token for the enterprise API secured with Azure AD
        return tokenProvider.getToken(tokenId);
      })
      .then((accessToken: string): void => {
        var c = new SafeDesk365("https://safedesk365-pro.azurewebsites.net/", accessToken);
        c.GetLocations().then((c: Location[]) => {
          this.authLocation = c[0].name;
          console.log("authenticated location" + c)
          var unauthenticatedSafeDesk = new SafeDesk365("https://safedesk365-test.azurewebsites.net/");
          unauthenticatedSafeDesk.GetLocations().then((c: Location[]) => {
            this.unAuthLocation = c[1].name;
            console.log("Unauthenticated location" + c)
            const element: React.ReactElement<ISafedesktestProps> = React.createElement(
              Safedesktest,
              {
                description: this.properties.description,
                isDarkTheme: this._isDarkTheme,
                environmentMessage: this._environmentMessage,
                hasTeamsContext: !!this.context.sdks.microsoftTeams,
                userDisplayName: this.context.pageContext.user.displayName,
                authLocation: this.authLocation,
                unAuthLocation: this.unAuthLocation
              }
            );
            ReactDom.render(element, this.domElement);
          });
        });
      });

    }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
