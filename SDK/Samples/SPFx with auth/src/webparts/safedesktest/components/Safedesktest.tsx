import * as React from 'react';
import styles from './Safedesktest.module.scss';
import { ISafedesktestProps } from './ISafedesktestProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Location } from 'safedesk365-sdk';

export default class Safedesktest extends React.Component<ISafedesktestProps, {}> {
  public render(): React.ReactElement<ISafedesktestProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      authLocation,
      unAuthLocation
    } = this.props;

    return (
      <section className={`${styles.safedesktest} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          <h3>Welcome to SafeDeskk!</h3>
          <p>
            You are currently <strong>authenicated</strong> located at:
          </p>
          <div>
            {this.props.authLocation}
          </div>
          <p>
            You are currently <strong>not-authenticated</strong> located at:
          </p>
          <div>
            {this.props.unAuthLocation}
          </div>
        </div>
      </section>
    );
  }
}
