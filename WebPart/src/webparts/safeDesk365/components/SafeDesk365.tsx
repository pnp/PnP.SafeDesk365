import * as React from 'react';
import styles from './SafeDesk365.module.scss';
import { ISafeDesk365Props } from './ISafeDesk365Props';
import { ISafeDesk365State } from './ISafeDesk365State';
import { escape } from '@microsoft/sp-lodash-subset';

import { ListView, IViewField, SelectionMode } from "@pnp/spfx-controls-react/lib/ListView";
import { IColumn, IIconProps, Spinner, CommandBarButton } from 'office-ui-fabric-react';

import { Booking } from 'safedesk365-sdk';
import * as strings from 'SafeDesk365WebPartStrings';

const deleteIcon: IIconProps = { iconName: 'Delete' };

export default class SafeDesk365 extends React.Component<ISafeDesk365Props, ISafeDesk365State> {

  private _bookingViewFields: IViewField[] = [
    {
      name: "id",
      displayName: "ID",
      sorting: false,
      minWidth: 50,
      maxWidth: 50
    },
    {
      name: "deskCode",
      displayName: "Desk Code",
      sorting: true,
      minWidth: 100,
      maxWidth: 150
    },
    {
      name: "date",
      displayName: "Date",
      render: (item?: any, index?: number, column?: IColumn) => {
        const dateString: string = item.date;
        const date: Date = new Date(dateString.substring(0, 10));
        return <span>{date.toDateString()}</span>;
      },
      sorting: true,
      minWidth: 100,
      maxWidth: 150
    },
    {
      name: "timeSlot",
      displayName: "Time Slot",
      sorting: false,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      name: "location",
      displayName: "Location",
      sorting: true,
      minWidth: 150
    },
    {
      name: "action",
      displayName: "Action",
      sorting: false,
      render: (item?: any, index?: number, column?: IColumn) => {
        return <CommandBarButton iconProps={deleteIcon} 
          onClick={ async () => { 
            await this._removeBooking(item.id); 
            await this._loadBookings(); 
          }} />;  
      },
      minWidth: 50,
      maxWidth: 50
    }
  ];
  
  constructor(props: ISafeDesk365Props) {
    super(props);
    
    this.state = {
      loading: false,
      bookings: []
    };
  }

  private _loadBookings = async () => {

    // Set loading UI
    this.setState({
      loading: true,
      bookings: []
    });

    // Load bookings
    const bookings: Booking[] = await this.props.safeDesk365Client.getBookings();

    // Set bookings in UI
    this.setState({
      loading: false,
      bookings: bookings
    });
  }

  private _removeBooking = async (bookingId: number) => {
    await this.props.safeDesk365Client.removeBooking(bookingId);
  }

  public componentDidMount(): void {
    // load data initially after the component has been instantiated
    this._loadBookings();
  }

  public render(): React.ReactElement<ISafeDesk365Props> {
    const {
      hasTeamsContext,
    } = this.props;

    const {
      loading,
      bookings
    } = this.state;

    return (
      <section className={`${styles.safeDesk365} ${hasTeamsContext ? styles.teams : ''}`}>
        {
          !loading ?
          <div>
            <div className={styles.welcome}>
              <h2>{strings.BookingsWelcomeText}</h2>
            </div>
            <div>
              <ListView
                items={bookings}
                viewFields={this._bookingViewFields}
                compact={true}
                selectionMode={SelectionMode.none}
                showFilter={false}
                stickyHeader={true} />
            </div>
          </div> :
          <div>
            <Spinner label={strings.BookingSpinnerLabel} ariaLive="assertive" labelPosition="left" />
          </div>
        }
      </section>
    );
  }
}
