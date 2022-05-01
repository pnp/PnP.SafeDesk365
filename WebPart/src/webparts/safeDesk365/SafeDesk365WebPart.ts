import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'SafeDesk365WebPartStrings';
import SafeDesk365 from './components/SafeDesk365';
import { ISafeDesk365Props } from './components/ISafeDesk365Props';
import { SafeDesk365Client } from '../../services/safeDesk365Client/SafeDesk365Client';

export interface ISafeDesk365WebPartProps {
  safeDesk365ApiUniqueUri: string;
  safeDesk365ApiUri: string;
  safeDesk365ApiId: string;
}

export default class SafeDesk365WebPart extends BaseClientSideWebPart<ISafeDesk365WebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _safeDesk365Client: SafeDesk365Client;

  protected async onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    // Initialize the AAD OAuth Token Provider, first
    const tokenProvider = await this.context.aadTokenProviderFactory.getTokenProvider();
    const accessToken: string = await tokenProvider.getToken(this.properties.safeDesk365ApiId);

    // Then create a new instance of the SafeDesk365 Client
    this._safeDesk365Client = new SafeDesk365Client(
      this.properties.safeDesk365ApiUri, 
      accessToken, 
      this.context.pageContext.user.email);

    return super.onInit();
  }

  public render(): void {

    const element: React.ReactElement<ISafeDesk365Props> = React.createElement(
      SafeDesk365,
      {
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        safeDesk365Client: this._safeDesk365Client
      }
    );

    ReactDom.render(element, this.domElement);
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
