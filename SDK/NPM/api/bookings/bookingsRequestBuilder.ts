import {Booking} from '../../models/';
import {createBookingFromDiscriminatorValue} from '../../models/createBookingFromDiscriminatorValue';
import {CheckinRequestBuilder} from './checkin/checkinRequestBuilder';
import {CheckinItemRequestBuilder} from './checkin/item/checkinItemRequestBuilder';
import {CheckoutRequestBuilder} from './checkout/checkoutRequestBuilder';
import {CheckoutItemRequestBuilder} from './checkout/item/checkoutItemRequestBuilder';
import {UpcomingRequestBuilder} from './upcoming/upcomingRequestBuilder';
import {getPathParameters, HttpMethod, Parsable, ParsableFactory, RequestAdapter, RequestInformation, RequestOption, ResponseHandler} from '@microsoft/kiota-abstractions';

/** Builds and executes requests for operations under /api/bookings  */
export class BookingsRequestBuilder {
    /** The checkin property  */
    public get checkin(): CheckinRequestBuilder {
        return new CheckinRequestBuilder(this.pathParameters, this.requestAdapter);
    }
    /** The checkout property  */
    public get checkout(): CheckoutRequestBuilder {
        return new CheckoutRequestBuilder(this.pathParameters, this.requestAdapter);
    }
    /** Path parameters for the request  */
    private readonly pathParameters: Record<string, unknown>;
    /** The request adapter to use to execute the requests.  */
    private readonly requestAdapter: RequestAdapter;
    /** The upcoming property  */
    public get upcoming(): UpcomingRequestBuilder {
        return new UpcomingRequestBuilder(this.pathParameters, this.requestAdapter);
    }
    /** Url template to use to build the URL for the current request builder  */
    private readonly urlTemplate: string;
    /**
     * Gets an item from the SafeDesk.API.api.bookings.checkin.item collection
     * @param id Unique identifier of the item
     * @returns a CheckinItemRequestBuilder
     */
    public checkinById(id: string) : CheckinItemRequestBuilder {
        if(!id) throw new Error("id cannot be undefined");
        const urlTplParams = getPathParameters(this.pathParameters);
        urlTplParams["id"] = id
        return new CheckinItemRequestBuilder(urlTplParams, this.requestAdapter);
    };
    /**
     * Gets an item from the SafeDesk.API.api.bookings.checkout.item collection
     * @param id Unique identifier of the item
     * @returns a CheckoutItemRequestBuilder
     */
    public checkoutById(id: string) : CheckoutItemRequestBuilder {
        if(!id) throw new Error("id cannot be undefined");
        const urlTplParams = getPathParameters(this.pathParameters);
        urlTplParams["id"] = id
        return new CheckoutItemRequestBuilder(urlTplParams, this.requestAdapter);
    };
    /**
     * Instantiates a new BookingsRequestBuilder and sets the default values.
     * @param pathParameters The raw url or the Url template parameters for the request.
     * @param requestAdapter The request adapter to use to execute the requests.
     */
    public constructor(pathParameters: Record<string, unknown> | string | undefined, requestAdapter: RequestAdapter) {
        if(!pathParameters) throw new Error("pathParameters cannot be undefined");
        if(!requestAdapter) throw new Error("requestAdapter cannot be undefined");
        this.urlTemplate = "{+baseurl}/api/bookings{?userEmail,location}";
        const urlTplParams = getPathParameters(pathParameters);
        this.pathParameters = urlTplParams;
        this.requestAdapter = requestAdapter;
    };
    public createGetRequestInformation(queryParameters?: {
                    location?: string,
                    userEmail?: string
                    } | undefined, headers?: Record<string, string> | undefined, options?: RequestOption[] | undefined) : RequestInformation {
        const requestInfo = new RequestInformation();
        requestInfo.urlTemplate = this.urlTemplate;
        requestInfo.pathParameters = this.pathParameters;
        requestInfo.httpMethod = HttpMethod.GET;
        if(headers) requestInfo.headers = headers;
        queryParameters && requestInfo.setQueryStringParametersFromRawObject(queryParameters);
        options && requestInfo.addRequestOptions(...options);
        return requestInfo;
    };
    public createPostRequestInformation(body: Booking | undefined, headers?: Record<string, string> | undefined, options?: RequestOption[] | undefined) : RequestInformation {
        if(!body) throw new Error("body cannot be undefined");
        const requestInfo = new RequestInformation();
        requestInfo.urlTemplate = this.urlTemplate;
        requestInfo.pathParameters = this.pathParameters;
        requestInfo.httpMethod = HttpMethod.POST;
        if(headers) requestInfo.headers = headers;
        requestInfo.setContentFromParsable(this.requestAdapter, "application/json", body);
        options && requestInfo.addRequestOptions(...options);
        return requestInfo;
    };
    public get(queryParameters?: {
                    location?: string,
                    userEmail?: string
                    } | undefined, headers?: Record<string, string> | undefined, options?: RequestOption[] | undefined, responseHandler?: ResponseHandler | undefined) : Promise<Booking[] | undefined> {
        const requestInfo = this.createGetRequestInformation(
            queryParameters, headers, options
        );
        return this.requestAdapter?.sendCollectionAsync<Booking>(requestInfo, createBookingFromDiscriminatorValue, responseHandler, undefined) ?? Promise.reject(new Error('http core is null'));
    };
    public post(body: Booking | undefined, headers?: Record<string, string> | undefined, options?: RequestOption[] | undefined, responseHandler?: ResponseHandler | undefined) : Promise<number | undefined> {
        if(!body) throw new Error("body cannot be undefined");
        const requestInfo = this.createPostRequestInformation(
            body, headers, options
        );
        return this.requestAdapter?.sendPrimitiveAsync<number>(requestInfo, "number", responseHandler, undefined) ?? Promise.reject(new Error('http core is null'));
    };
}
