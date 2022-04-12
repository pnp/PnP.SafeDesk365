using Microsoft.Kiota.Abstractions;
using SafeDesk365.SDK.Api.Bookings;
using SafeDesk365.SDK.Api.DeskAvailabilities;
using SafeDesk365.SDK.Api.Desks;
using SafeDesk365.SDK.Api.Facilities;
using SafeDesk365.SDK.Api.Locations;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
namespace SafeDesk365.SDK.Api {
    /// <summary>Builds and executes requests for operations under \api</summary>
    public class ApiRequestBuilder {
        /// <summary>The bookings property</summary>
        public BookingsRequestBuilder Bookings { get =>
            new BookingsRequestBuilder(PathParameters, RequestAdapter);
        }
        /// <summary>The deskAvailabilities property</summary>
        public DeskAvailabilitiesRequestBuilder DeskAvailabilities { get =>
            new DeskAvailabilitiesRequestBuilder(PathParameters, RequestAdapter);
        }
        /// <summary>The desks property</summary>
        public DesksRequestBuilder Desks { get =>
            new DesksRequestBuilder(PathParameters, RequestAdapter);
        }
        /// <summary>The facilities property</summary>
        public FacilitiesRequestBuilder Facilities { get =>
            new FacilitiesRequestBuilder(PathParameters, RequestAdapter);
        }
        /// <summary>The locations property</summary>
        public LocationsRequestBuilder Locations { get =>
            new LocationsRequestBuilder(PathParameters, RequestAdapter);
        }
        /// <summary>Path parameters for the request</summary>
        private Dictionary<string, object> PathParameters { get; set; }
        /// <summary>The request adapter to use to execute the requests.</summary>
        private IRequestAdapter RequestAdapter { get; set; }
        /// <summary>Url template to use to build the URL for the current request builder</summary>
        private string UrlTemplate { get; set; }
        /// <summary>
        /// Instantiates a new ApiRequestBuilder and sets the default values.
        /// <param name="pathParameters">Path parameters for the request</param>
        /// <param name="requestAdapter">The request adapter to use to execute the requests.</param>
        /// </summary>
        public ApiRequestBuilder(Dictionary<string, object> pathParameters, IRequestAdapter requestAdapter) {
            _ = pathParameters ?? throw new ArgumentNullException(nameof(pathParameters));
            _ = requestAdapter ?? throw new ArgumentNullException(nameof(requestAdapter));
            UrlTemplate = "{+baseurl}/api";
            var urlTplParams = new Dictionary<string, object>(pathParameters);
            PathParameters = urlTplParams;
            RequestAdapter = requestAdapter;
        }
        /// <summary>
        /// Instantiates a new ApiRequestBuilder and sets the default values.
        /// <param name="rawUrl">The raw URL to use for the request builder.</param>
        /// <param name="requestAdapter">The request adapter to use to execute the requests.</param>
        /// </summary>
        public ApiRequestBuilder(string rawUrl, IRequestAdapter requestAdapter) {
            if(string.IsNullOrEmpty(rawUrl)) throw new ArgumentNullException(nameof(rawUrl));
            _ = requestAdapter ?? throw new ArgumentNullException(nameof(requestAdapter));
            UrlTemplate = "{+baseurl}/api";
            var urlTplParams = new Dictionary<string, object>();
            urlTplParams.Add("request-raw-url", rawUrl);
            PathParameters = urlTplParams;
            RequestAdapter = requestAdapter;
        }
    }
}
