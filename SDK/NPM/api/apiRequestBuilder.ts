import {BookingsRequestBuilder} from './bookings/bookingsRequestBuilder';
import {BookingsItemRequestBuilder} from './bookings/item/bookingsItemRequestBuilder';
import {DeskAvailabilitiesRequestBuilder} from './deskAvailabilities/deskAvailabilitiesRequestBuilder';
import {DesksRequestBuilder} from './desks/desksRequestBuilder';
import {FacilitiesRequestBuilder} from './facilities/facilitiesRequestBuilder';
import {LocationsRequestBuilder} from './locations/locationsRequestBuilder';
import {getPathParameters, RequestAdapter} from '@microsoft/kiota-abstractions';

/** Builds and executes requests for operations under /api  */
export class ApiRequestBuilder {
    /** The bookings property  */
    public get bookings(): BookingsRequestBuilder {
        return new BookingsRequestBuilder(this.pathParameters, this.requestAdapter);
    }
    /** The deskAvailabilities property  */
    public get deskAvailabilities(): DeskAvailabilitiesRequestBuilder {
        return new DeskAvailabilitiesRequestBuilder(this.pathParameters, this.requestAdapter);
    }
    /** The desks property  */
    public get desks(): DesksRequestBuilder {
        return new DesksRequestBuilder(this.pathParameters, this.requestAdapter);
    }
    /** The facilities property  */
    public get facilities(): FacilitiesRequestBuilder {
        return new FacilitiesRequestBuilder(this.pathParameters, this.requestAdapter);
    }
    /** The locations property  */
    public get locations(): LocationsRequestBuilder {
        return new LocationsRequestBuilder(this.pathParameters, this.requestAdapter);
    }
    /** Path parameters for the request  */
    private readonly pathParameters: Record<string, unknown>;
    /** The request adapter to use to execute the requests.  */
    private readonly requestAdapter: RequestAdapter;
    /** Url template to use to build the URL for the current request builder  */
    private readonly urlTemplate: string;
    /**
     * Gets an item from the SafeDesk.API.api.bookings.item collection
     * @param id Unique identifier of the item
     * @returns a BookingsItemRequestBuilder
     */
    public bookingsById(id: string) : BookingsItemRequestBuilder {
        if(!id) throw new Error("id cannot be undefined");
        const urlTplParams = getPathParameters(this.pathParameters);
        urlTplParams["id"] = id
        return new BookingsItemRequestBuilder(urlTplParams, this.requestAdapter);
    };
    /**
     * Instantiates a new ApiRequestBuilder and sets the default values.
     * @param pathParameters The raw url or the Url template parameters for the request.
     * @param requestAdapter The request adapter to use to execute the requests.
     */
    public constructor(pathParameters: Record<string, unknown> | string | undefined, requestAdapter: RequestAdapter) {
        if(!pathParameters) throw new Error("pathParameters cannot be undefined");
        if(!requestAdapter) throw new Error("requestAdapter cannot be undefined");
        this.urlTemplate = "{+baseurl}/api";
        const urlTplParams = getPathParameters(pathParameters);
        this.pathParameters = urlTplParams;
        this.requestAdapter = requestAdapter;
    };
}
