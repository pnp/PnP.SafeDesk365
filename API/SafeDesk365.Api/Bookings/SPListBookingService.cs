
using PnP.Core.Model.Security;

namespace SafeDesk365.Api.Bookings
{
    public class SPListBookingService : IBookingService
    {
        private readonly IPnPContextFactory pnpContextFactory;
        private readonly IConfiguration configuration;
        private readonly IFacilityService facilitiesService;
        private readonly ILocationService locationService;
        private readonly IDeskService deskService;
        private readonly IDeskAvailabilityService deskAvailabilityService;

        string listTitle;
        string userColumn;
        string deskCodeColumn;
        string dateColumn;
        string slotColumn;
        string checkinColumn;
        string checkoutColumn;
        string locationColumn;
        int rowlimit = 0;

        public SPListBookingService(IPnPContextFactory pnpContextFactory, IConfiguration configuration,
            IFacilityService facilitiesService, ILocationService locationService, IDeskService deskService,
            IDeskAvailabilityService deskAvailabilityService)
        {
            this.pnpContextFactory = pnpContextFactory;
            this.configuration = configuration;
            this.facilitiesService = facilitiesService;
            this.locationService = locationService;
            this.deskService = deskService;
            this.deskAvailabilityService = deskAvailabilityService;



            #region SPListColumn Mappings

            listTitle = configuration.GetValue<string>("SafeDesk365:Lists:Bookings:ListName");
            userColumn = configuration.GetValue<string>("SafeDesk365:Lists:Bookings:BookingUserColumn");
            deskCodeColumn = configuration.GetValue<string>("SafeDesk365:Lists:Bookings:DeskCodeColumn");
            dateColumn = configuration.GetValue<string>("SafeDesk365:Lists:Bookings:BookingDateColumn");
            slotColumn = configuration.GetValue<string>("SafeDesk365:Lists:Bookings:BookingSlotColumn");
            checkinColumn = configuration.GetValue<string>("SafeDesk365:Lists:Bookings:BookingCheckinColumn");
            checkoutColumn = configuration.GetValue<string>("SafeDesk365:Lists:Bookings:BookingCheckoutColumn");
            locationColumn = configuration.GetValue<string>("SafeDesk365:Lists:Bookings:BookingLocationColumn");
            rowlimit = configuration.GetValue<int>("SafeDesk365:Lists:Bookings:RowLimit");

            #endregion

        }
        public async Task<int> Create(Booking? booking)
        {
            List<Desk> desks = await deskService.GetAll();
            var locations = await locationService.GetAll();
            var facilities = await facilitiesService.GetAll();

            using (var context = await pnpContextFactory.CreateAsync("SafeDesk365"))
            {
                var myList = context
                        .Web
                        .Lists
                        .GetByTitle(listTitle,
                            p => p.Title,
                            p => p.Fields.QueryProperties(p => p.InternalName,
                            p => p.FieldTypeKind,
                            p => p.TypeAsString,
                            p => p.Title));

                Dictionary<string, object> values = new();

                var itemTitle = booking.Title != "" ? booking.Title : booking.DeskCode
                    + "-" + booking.Date.ToShortDateString() + "-" + booking.TimeSlot;

                IField userField = myList.Fields.AsRequested().FirstOrDefault(f => f.InternalName == userColumn);
                var myUser = await context.Web.EnsureUserAsync(booking.User);
                var locationId = locations.First(l => l.Name.Equals(booking.Location)).Id;

                values.Add("Title",itemTitle);
                values.Add(deskCodeColumn, booking.DeskCode);
                values.Add(dateColumn, booking.Date);
                values.Add(slotColumn, booking.TimeSlot);
                values.Add(userColumn, userField.NewFieldUserValue(myUser));
                values.Add(locationColumn, locationId);

                var addedItem = await myList.Items.AddAsync(values);

                return addedItem.Id;
            }
        }

        public async Task<int> CreateFromAvailability(int availabilityId, string userEmail)
        {
            List<Desk> desks = await deskService.GetAll();
            var locations = await locationService.GetAll();
            var facilities = await facilitiesService.GetAll();
            var deskAvailability = await deskAvailabilityService.GetById(availabilityId);

            using (var context = await pnpContextFactory.CreateAsync("SafeDesk365"))
            {
                var myList = context
                        .Web
                        .Lists
                        .GetByTitle(listTitle,
                            p => p.Title,
                            p => p.Fields.QueryProperties(p => p.InternalName,
                            p => p.FieldTypeKind,
                            p => p.TypeAsString,
                            p => p.Title));

                Dictionary<string, object> values = new();                

                IField userField = myList.Fields.AsRequested().FirstOrDefault(f => f.InternalName == userColumn);
                var myUser = await context.Web.EnsureUserAsync(userEmail);
                var locationId = locations.First(l => l.Name.Equals(deskAvailability.Location)).Id;

                values.Add("Title", deskAvailability.Title);
                values.Add(deskCodeColumn, deskAvailability.Code);
                values.Add(dateColumn, deskAvailability.Date);
                values.Add(slotColumn, deskAvailability.TimeSlot);
                values.Add(userColumn, userField.NewFieldUserValue(myUser));
                values.Add(locationColumn, locationId);

                var addedItem = await myList.Items.AddAsync(values);

                await deskAvailabilityService.Delete(availabilityId);

                return addedItem.Id;
            }
        }

        public async Task<bool> Delete(int id)
        {
            using (var context = await pnpContextFactory.CreateAsync("SafeDesk365"))
            {
                var myList = context
                        .Web
                        .Lists
                        .GetByTitle(listTitle,
                            p => p.Title,
                            p => p.Fields.QueryProperties(p => p.InternalName,
                            p => p.FieldTypeKind,
                            p => p.TypeAsString,
                            p => p.Title));

                var item = myList.Items.GetById(id);
                await item.DeleteAsync();
                return true;
            }
        }

        public async Task<List<Booking>> GetBookings(BookingQueryType type, string email = "", string location = "")
        {
            var result = new List<Booking>();

            var facilities = await facilitiesService.GetAll();
            var locations = await locationService.GetAll();

            using (var context = await pnpContextFactory.CreateAsync("SafeDesk365"))
            {
                var myList = context
                        .Web
                        .Lists
                        .GetByTitle(listTitle,
                            p => p.Title,
                            p => p.Fields.QueryProperties(p => p.InternalName,
                            p => p.FieldTypeKind,
                            p => p.TypeAsString,
                            p => p.Title));

                string viewXml = "";

                if(type == BookingQueryType.All)
                    viewXml = await GetAllQueryString(email, location, locations, context);

                if (type == BookingQueryType.Upcoming)
                    viewXml = await GetUpcomingQueryString(email, location, locations, context);

                var output = await myList.LoadListDataAsStreamAsync(new RenderListDataOptions()
                {
                    ViewXml = viewXml,
                    DatesInUtc = true,
                    RenderOptions = RenderListDataOptionsFlags.ListData
                });

                foreach (var item in myList.Items.AsRequested())
                {
                    var usrId = (item.Values[userColumn] as IFieldUserValue).LookupId;
                    ISharePointUser user = await context.Web.GetUserByIdAsync(usrId);

                    Booking booking = GetBooking(facilities, locations, item, user);
                    result.Add(booking);
                }
            }

            return result;
        }
        
        public async Task<Booking> GetById(int id)
        {
            Booking result;

            var facilities = await facilitiesService.GetAll();
            var locations = await locationService.GetAll();

            using (var context = await pnpContextFactory.CreateAsync("SafeDesk365"))
            {
                var myList = context
                        .Web
                        .Lists
                        .GetByTitle(listTitle,
                            p => p.Title,
                            p => p.Fields.QueryProperties(p => p.InternalName,
                            p => p.FieldTypeKind,
                            p => p.TypeAsString,
                            p => p.Title));

                var item = myList.Items.GetById(id);                

                var usrId = (item.Values[userColumn] as IFieldUserValue).LookupId;
                ISharePointUser user = await context.Web.GetUserByIdAsync(usrId);
                result = GetBooking(facilities, locations, item, user);
            }

            return result;
        }
        
        public void Update(Booking booking)
        {
            throw new NotImplementedException();
        }

        public async Task<Booking> CheckInById(int id)
        {
            var result = new Booking();

            var facilities = await facilitiesService.GetAll();
            var locations = await locationService.GetAll();

            using (var context = await pnpContextFactory.CreateAsync("SafeDesk365"))
            {
                var myList = context
                        .Web
                        .Lists
                        .GetByTitle(listTitle,
                            p => p.Title,
                            p => p.Fields.QueryProperties(p => p.InternalName,
                            p => p.FieldTypeKind,
                            p => p.TypeAsString,
                            p => p.Title));
                
                var item = myList.Items.GetById(id);
                item[checkinColumn]=DateTime.Now;
                await item.UpdateAsync();

                var usrId = (item.Values[userColumn] as IFieldUserValue).LookupId;
                ISharePointUser user = await context.Web.GetUserByIdAsync(usrId);
                result = GetBooking(facilities, locations, item, user);
            }

            return result;
        }

        public async Task<Booking> CheckOutById(int id)
        {
            var result = new Booking();

            var facilities = await facilitiesService.GetAll();
            var locations = await locationService.GetAll();

            using (var context = await pnpContextFactory.CreateAsync("SafeDesk365"))
            {
                var myList = context
                        .Web
                        .Lists
                        .GetByTitle(listTitle,
                            p => p.Title,
                            p => p.Fields.QueryProperties(p => p.InternalName,
                            p => p.FieldTypeKind,
                            p => p.TypeAsString,
                            p => p.Title));

                var item = myList.Items.GetById(id);
                item[checkoutColumn] = DateTime.Now;
                await item.UpdateAsync();

                var usrId = (item.Values[userColumn] as IFieldUserValue).LookupId;
                ISharePointUser user = await context.Web.GetUserByIdAsync(usrId);
                result = GetBooking(facilities, locations, item, user);
            }

            return result;
        }
        
        private Booking GetBooking(List<Facility> facilities, List<Location> locations, IListItem item, ISharePointUser user)
        {
            List<string> timeSlotList = (List<string>)item.Values[slotColumn];

            var booking = new Booking()
            {
                Id = item.Id,
                Title = item.Title,
                CheckInTime = item.Values[checkinColumn] == null ? new DateTime(1900,1,1) : (DateTime)item.Values[checkinColumn],
                CheckOutTime = item.Values[checkoutColumn] == null ? new DateTime(1900, 1, 1) : (DateTime)item.Values[checkoutColumn],
                Date = (DateTime)item.Values[dateColumn],
                DeskCode = (string)item.Values[deskCodeColumn],
                TimeSlot = timeSlotList[0],
                User = user.Mail,
                Location = locations.First(l => l.Id.Equals((item[locationColumn] as IFieldLookupValue).LookupId)).Name
            };

            return booking;
        }

        private async Task<string> GetAllQueryString(string email, string location, List<Location> locations, PnPContext context)
        {
            string viewXml = "";

            if (email == "" && location == "")
                viewXml = GetQueryAll();

            if (email != "" && location == "")
            {
                var myUser = await context.Web.EnsureUserAsync(email);
                viewXml = GetQueryAllByUserId(myUser.Id);
            }

            if (location != "" && email == "")
            {
                int locationId = locations.First(l => l.Name.ToLower().Equals(location.ToLower())).Id;
                viewXml = GetQueryAllByLocationId(locationId);
            }

            if (email != "" && location != "")
            {
                var myUser = await context.Web.EnsureUserAsync(email);
                int locationId = locations.First(l => l.Name.ToLower().Equals(location.ToLower())).Id;
                viewXml = GetQueryAllByLocationAndUserId(locationId, myUser.Id);
            }

            return viewXml;
        }

        private async Task<string> GetUpcomingQueryString(string email, string location, List<Location> locations, PnPContext context)
        {
            string viewXml = "";

            if (email == "" && location == "")
                viewXml = GetQueryUpcoming();

            if (email != "" && location == "")
            {
                var myUser = await context.Web.EnsureUserAsync(email);
                viewXml = GetQueryUpcomingByUserId(myUser.Id);
            }

            if (location != "" && email == "")
            {
                int locationId = locations.First(l => l.Name.ToLower().Equals(location.ToLower())).Id;
                viewXml = GetQueryUpcomingByLocationId(locationId);
            }

            if (email != "" && location != "")
            {
                var myUser = await context.Web.EnsureUserAsync(email);
                int locationId = locations.First(l => l.Name.ToLower().Equals(location.ToLower())).Id;
                viewXml = GetQueryUpcomingByLocationIdAndUserId(locationId, myUser.Id);
            }

            return viewXml;
        }


        #region GetQueryStrings

        private string GetViewFields()
        {
            return $@"<ViewFields>
                          <FieldRef Name='Title' />
                          <FieldRef Name='{userColumn}' />
                          <FieldRef Name='{deskCodeColumn}' />
                          <FieldRef Name='{dateColumn}' />
                          <FieldRef Name='{checkinColumn}' />
                          <FieldRef Name='{slotColumn}' />
                          <FieldRef Name='{checkoutColumn}' />                          
                          <FieldRef Name='{deskCodeColumn}' />
                          <FieldRef Name='{locationColumn}' />  
                        </ViewFields>";
        }
        private string GetOrderByAndRowLimit()
        {
            return $@"<OrderBy Override='TRUE'><FieldRef Name= 'ID' Ascending= 'FALSE' /></OrderBy>
                      <RowLimit>{rowlimit}</RowLimit>";
        }
        private string GetQueryAll()
        {
            return $@"<View>
                        {GetViewFields()}
                        <Query>
                          <Where>
                          </Where>
                        </Query>
                        {GetOrderByAndRowLimit()}
                        </View>";
        }
        private string GetQueryAllByLocationId(int locationId)
        {            
            return $@"<View>
                        {GetViewFields()}
                        <Query>
                          <Where>                            
                            <Eq>
                              <FieldRef Name='{locationColumn}' LookupId='TRUE'/>
                              <Value Type='Lookup'>{locationId}</Value>
                            </Eq>                            
                          </Where>
                        </Query>
                        {GetOrderByAndRowLimit()}
                        </View>";
        }
        private string GetQueryAllByUserId(int userId)
        {            
            return $@"<View>
                        {GetViewFields()}
                        <Query>
                          <Where>                                                            
                            <Eq>
                              <FieldRef Name='{userColumn}' LookupId='TRUE'/>
                              <Value Type='Lookup'>{userId}</Value>
                            </Eq>                                                            
                          </Where>
                        </Query>
                        {GetOrderByAndRowLimit()}
                        </View>";
        }
        private string GetQueryAllByLocationAndUserId(int locationId, int userId)
        {
            return $@"<View>
                        {GetViewFields()}
                        <Query>
                          <Where>
                            <And>
                                <Eq>
                                  <FieldRef Name='{userColumn}' LookupId='TRUE'/>
                                  <Value Type='Lookup'>{userId}</Value>
                                </Eq>
                                <Eq>
                                  <FieldRef Name='{locationColumn}' LookupId='TRUE'/>
                                  <Value Type='Lookup'>{locationId}</Value>
                                </Eq>
                            </And>
                          </Where>
                        </Query>
                        {GetOrderByAndRowLimit()}
                        </View>";
        }
        private string GetQueryUpcoming()
        {
            string dateFormatted = DateTime.Now.ToString("s");

            return $@"<View>
                        {GetViewFields()}
                        <Query>
                          <Where>
                            <Geq>
                              <FieldRef Name='{dateColumn}'/>
                              <Value Type='DateTime' IncludeTimeValue='FALSE'>{dateFormatted}</Value>
                            </Geq>
                          </Where>
                        </Query>
                        {GetOrderByAndRowLimit()}
                        </View>";
        }
        private string GetQueryUpcomingByUserId(int userId)
        {
            string dateFormatted = DateTime.Now.ToString("s");

            return $@"<View>
                        {GetViewFields()}
                        <Query>
                          <Where>
                            <And>
                            <Geq>
                              <FieldRef Name='{dateColumn}'/>
                              <Value Type='DateTime' IncludeTimeValue='FALSE'>{dateFormatted}</Value>
                            </Geq>                                
                            <Eq>
                              <FieldRef Name='{userColumn}' LookupId='TRUE'/>
                              <Value Type='Lookup'>{userId}</Value>
                            </Eq>                                
                            </And>
                          </Where>
                        </Query>
                        {GetOrderByAndRowLimit()}
                        </View>";
        }
        private string GetQueryUpcomingByLocationId(int locationId)
        {
            string dateFormatted = DateTime.Now.ToString("s");

            return $@"<View>
                        {GetViewFields()}
                        <Query>
                          <Where>
                            <And>
                            <Geq>
                              <FieldRef Name='{dateColumn}'/>
                              <Value Type='DateTime' IncludeTimeValue='FALSE'>{dateFormatted}</Value>
                            </Geq>
                            <Eq>
                              <FieldRef Name='{locationColumn}' LookupId='TRUE'/>
                              <Value Type='Lookup'>{locationId}</Value>
                            </Eq>
                            </And>
                          </Where>
                        </Query>
                        {GetOrderByAndRowLimit()}
                        </View>";
        }
        private string GetQueryUpcomingByLocationIdAndUserId(int locationId, int userId)
        {
            string dateFormatted = DateTime.Now.ToString("s");

            return $@"<View>
                        {GetViewFields()}
                        <Query>
                          <Where>
                            <And>
                            <Geq>
                              <FieldRef Name='{dateColumn}'/>
                              <Value Type='DateTime' IncludeTimeValue='FALSE'>{dateFormatted}</Value>
                            </Geq>
                                <And>
                                <Eq>
                                  <FieldRef Name='{locationColumn}' LookupId='TRUE'/>
                                  <Value Type='Lookup'>{locationId}</Value>
                                </Eq>
                                <Eq>
                                  <FieldRef Name='{userColumn}' LookupId='TRUE'/>
                                  <Value Type='Lookup'>{userId}</Value>
                                </Eq>
                                </And>
                            </And>
                          </Where>
                        </Query>
                        {GetOrderByAndRowLimit()}
                        </View>";
        }
        #endregion
    }    
}
