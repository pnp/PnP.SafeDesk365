import {DeskAvailability} from '../../models/';
import {createDeskAvailabilityFromDiscriminatorValue} from '../../models/createDeskAvailabilityFromDiscriminatorValue';
import {DateRequestBuilder} from './date/dateRequestBuilder';
import {WithDateItemRequestBuilder} from './date/item/withDateItemRequestBuilder';
import {WithLocationItemRequestBuilder} from './location/item/withLocationItemRequestBuilder';
import {LocationRequestBuilder} from './location/locationRequestBuilder';
import {UpcomingRequestBuilder} from './upcoming/upcomingRequestBuilder';
import {getPathParameters, HttpMethod, Parsable, ParsableFactory, RequestAdapter, RequestInformation, RequestOption, ResponseHandler} from '@microsoft/kiota-abstractions';

/** Builds and executes requests for operations under /api/deskAvailabilities  */
export class DeskAvailabilitiesRequestBuilder {
    /** The date property  */
    public get date(): DateRequestBuilder {
        return new DateRequestBuilder(this.pathParameters, this.requestAdapter);
    }
    /** The location property  */
    public get location(): LocationRequestBuilder {
        return new LocationRequestBuilder(this.pathParameters, this.requestAdapter);
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
     * Instantiates a new DeskAvailabilitiesRequestBuilder and sets the default values.
     * @param pathParameters The raw url or the Url template parameters for the request.
     * @param requestAdapter The request adapter to use to execute the requests.
     */
    public constructor(pathParameters: Record<string, unknown> | string | undefined, requestAdapter: RequestAdapter) {
        if(!pathParameters) throw new Error("pathParameters cannot be undefined");
        if(!requestAdapter) throw new Error("requestAdapter cannot be undefined");
        this.urlTemplate = "{+baseurl}/api/deskAvailabilities";
        const urlTplParams = getPathParameters(pathParameters);
        this.pathParameters = urlTplParams;
        this.requestAdapter = requestAdapter;
    };
    public createGetRequestInformation(headers?: Record<string, string> | undefined, options?: RequestOption[] | undefined) : RequestInformation {
        const requestInfo = new RequestInformation();
        requestInfo.urlTemplate = this.urlTemplate;
        requestInfo.pathParameters = this.pathParameters;
        requestInfo.httpMethod = HttpMethod.GET;
        if(headers) requestInfo.headers = headers;
        options && requestInfo.addRequestOptions(...options);
        return requestInfo;
    };
    /**
     * Gets an item from the SafeDesk.API.api.deskAvailabilities.date.item collection
     * @param id Unique identifier of the item
     * @returns a WithDateItemRequestBuilder
     */
    public dateById(id: string) : WithDateItemRequestBuilder {
        if(!id) throw new Error("id cannot be undefined");
        const urlTplParams = getPathParameters(this.pathParameters);
        urlTplParams["date"] = id
        return new WithDateItemRequestBuilder(urlTplParams, this.requestAdapter);
    };
    public get(headers?: Record<string, string> | undefined, options?: RequestOption[] | undefined, responseHandler?: ResponseHandler | undefined) : Promise<DeskAvailability[] | undefined> {
        const requestInfo = this.createGetRequestInformation(
            headers, options
        );
        return this.requestAdapter?.sendCollectionAsync<DeskAvailability>(requestInfo, createDeskAvailabilityFromDiscriminatorValue, responseHandler, undefined) ?? Promise.reject(new Error('http core is null'));
    };
    /**
     * Gets an item from the SafeDesk.API.api.deskAvailabilities.location.item collection
     * @param id Unique identifier of the item
     * @returns a WithLocationItemRequestBuilder
     */
    public locationById(id: string) : WithLocationItemRequestBuilder {
        if(!id) throw new Error("id cannot be undefined");
        const urlTplParams = getPathParameters(this.pathParameters);
        urlTplParams["location"] = id
        return new WithLocationItemRequestBuilder(urlTplParams, this.requestAdapter);
    };
}
