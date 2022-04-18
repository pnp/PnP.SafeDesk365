
namespace SafeDesk365.Api.DeskAvailabilities
{
    public class SPListDeskAvailabilityService : IDeskAvailabilityService
    {
        private readonly IPnPContextFactory pnpContextFactory;
        private readonly IConfiguration configuration;
        private readonly IFacilityService facilitiesService;
        private readonly ILocationService locationService;
        private readonly IDeskService deskService;

        string listTitle;
        string deskCodeColumn;
        string deskDescriptionColumn;
        string coffeeMachineDistanceColumn;
        string deskPictureColumn;
        string bookingDateColumn;
        string bookingSlotColumn;
        string deskLocationColumn;
        string facilitiesColumn;

        public SPListDeskAvailabilityService(IPnPContextFactory pnPContextFactory, IConfiguration configuration,
            IFacilityService facilitiesService, ILocationService locationService, IDeskService deskService)
        {
            this.pnpContextFactory = pnPContextFactory;
            this.configuration = configuration;
            this.facilitiesService = facilitiesService;
            this.locationService = locationService;
            this.deskService = deskService;

            #region SPListColumn Mappings

            listTitle = configuration.GetValue<string>("SafeDesk365:Lists:DeskAvailabilities:ListName");
            deskCodeColumn = configuration.GetValue<string>("SafeDesk365:Lists:DeskAvailabilities:DeskCodeColumn");
            deskDescriptionColumn = configuration.GetValue<string>("SafeDesk365:Lists:DeskAvailabilities:DeskDescriptionColumn");
            coffeeMachineDistanceColumn = configuration.GetValue<string>("SafeDesk365:Lists:DeskAvailabilities:CoffeeMachineDistanceColumn");
            deskPictureColumn = configuration.GetValue<string>("SafeDesk365:Lists:DeskAvailabilities:DeskPictureColumn");
            bookingDateColumn = configuration.GetValue<string>("SafeDesk365:Lists:DeskAvailabilities:BookingDateColumn");
            bookingSlotColumn = configuration.GetValue<string>("SafeDesk365:Lists:DeskAvailabilities:BookingSlotColumn");
            deskLocationColumn = configuration.GetValue<string>("SafeDesk365:Lists:DeskAvailabilities:DeskLocationColumn");
            facilitiesColumn = configuration.GetValue<string>("SafeDesk365:Lists:DeskAvailabilities:FacilitiesColumn");


            #endregion

        }

        public async Task<List<DeskAvailability>> GetUpcoming()
        {
            var result = new List<DeskAvailability>();

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

                string viewXml = GetQueryAvailable();

                var output = await myList.LoadListDataAsStreamAsync(new RenderListDataOptions()
                {
                    ViewXml = viewXml,
                    DatesInUtc = true,
                    RenderOptions = RenderListDataOptionsFlags.ListData
                });

                foreach (var item in myList.Items.AsRequested())
                {
                    DeskAvailability deskAvailability = GetDeskAvailability(facilities, locations, item);
                    result.Add(deskAvailability);
                }
            }

            return result;
        }

        public async Task<DeskAvailability> GetById(int id)
        {
            DeskAvailability result = new DeskAvailability();

            var facilities = await facilitiesService.GetAll();
            var locations = await locationService.GetAll();

            using (var context = await pnpContextFactory.CreateAsync("SafeDesk365"))
            {
                var myList = context
                        .Web
                        .Lists
                        .GetByTitle(listTitle,
                            p => p.Title, p => p.Items,
                            p => p.Fields.QueryProperties(p => p.InternalName,
                            p => p.FieldTypeKind,
                            p => p.TypeAsString,
                            p => p.Title));

                var item = myList.Items.GetById(id);
                result = GetDeskAvailability(facilities, locations, item);
            }

            return result;
        }

        public async Task<List<DeskAvailability>> GetUpcomingByLocation(string location)
        {
            var result = new List<DeskAvailability>();

            var facilities = await facilitiesService.GetAll();
            var locations = await locationService.GetAll();

            if (locations.Count(l => l.Name.ToLower().Equals(location.ToLower())) <= 0)
                return result;

            var locationId = locations.First(l => l.Name.ToLower().Equals(location.ToLower())).Id;

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

                string viewXml = GetQueryByLocationId(locationId);

                var output = await myList.LoadListDataAsStreamAsync(new RenderListDataOptions()
                {
                    ViewXml = viewXml,
                    RenderOptions = RenderListDataOptionsFlags.ListData
                });

                foreach (var item in myList.Items.AsRequested())
                {
                    DeskAvailability deskAvailability = GetDeskAvailability(facilities, locations, item);
                    result.Add(deskAvailability);
                }
            }

            return result;
        }

        public async Task<List<DeskAvailability>> GetByDate(DateTime selectedDate)
        {
            var result = new List<DeskAvailability>();

            var facilities = await facilitiesService.GetAll();
            var locations = await locationService.GetAll();

            if (DateTime.UtcNow.Date > selectedDate.ToUniversalTime().Date)
                return result;

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

                string viewXml = GetQueryByDate(selectedDate);
               
                var output = await myList.LoadListDataAsStreamAsync(new RenderListDataOptions()
                {
                    ViewXml = viewXml,
                    DatesInUtc = true,
                    RenderOptions = RenderListDataOptionsFlags.ListData
                });

                foreach (var item in myList.Items.AsRequested())
                {
                    DeskAvailability deskAvailability = GetDeskAvailability(facilities, locations, item);
                    result.Add(deskAvailability);
                }
            }

            return result;

        }

        public async Task<int> CreateUpcomingDeskAvailabilities(DateTime from, DateTime to)
        {
            int result = 0;
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

                IField facilitiesField = myList.Fields.AsRequested().FirstOrDefault(f => f.InternalName == facilitiesColumn);

                foreach (DateTime day in EachDay(from, to))
                {
                    foreach (Desk desk in desks)
                    {
                        await myList.Items.AddBatchAsync(GetItemValues(day, desk, "Morning", locations, facilities, facilitiesField));
                        await myList.Items.AddBatchAsync(GetItemValues(day, desk, "Afternoon", locations, facilities, facilitiesField));
                        result += 2;
                    }
                }               
                await context.ExecuteAsync();                
            }

            return result;
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

        private Dictionary<string, object> GetItemValues(DateTime day, Desk desk, string timeslot, List<Location> locations, List<Facility> facilities, IField facilitiesField)
        {
            Dictionary<string, object> result = new();

            var locationId = locations.First(l => l.Name.Equals(desk.Location)).Id;

            IFieldValueCollection facilitiesValues = GetFacilitiesValues(desk, facilities, facilitiesField);

            result.Add("Title", desk.Code + "-" + "-" + desk.Location + "-" + day.ToLongDateString() + "-" + timeslot);
            result.Add(deskCodeColumn, desk.Code);
            result.Add(deskLocationColumn, locationId);
            result.Add(coffeeMachineDistanceColumn, desk.CoffeeMachineDistance);
            result.Add(deskDescriptionColumn, desk.Description);
            result.Add(deskPictureColumn, desk.Picture);
            result.Add(facilitiesColumn, facilitiesValues);
            result.Add(bookingDateColumn, day);
            result.Add(bookingSlotColumn, timeslot);

            return result;
        }

        private static IFieldValueCollection GetFacilitiesValues(Desk desk, List<Facility> facilities, IField facilitiesField)
        {
            IFieldValueCollection facilitiesValues = facilitiesField.NewFieldValueCollection();
            List<string> facilitiesAsString = desk.Facilities.Split(',').ToList();
            foreach (string fac in facilitiesAsString)
            {
                int id = facilities.First(f => f.Name.Equals(fac.Trim())).Id;
                facilitiesValues.Values.Add(facilitiesField.NewFieldLookupValue(id));
            }

            return facilitiesValues;
        }

        private string GetQueryByLocationId(int locationId)
        {
            string dateFormatted = DateTime.Today.ToString("s");

            return $@"<View>
                        <ViewFields>
                          <FieldRef Name='Title' />
                          <FieldRef Name='{deskDescriptionColumn}' />
                          <FieldRef Name='{facilitiesColumn}' />
                          <FieldRef Name='{deskLocationColumn}' />
                          <FieldRef Name='{deskPictureColumn}' />
                          <FieldRef Name='{coffeeMachineDistanceColumn}' />
                          <FieldRef Name='{bookingSlotColumn}' />
                          <FieldRef Name='{bookingDateColumn}' />
                          <FieldRef Name='{deskCodeColumn}' />                          
                        </ViewFields>
                        <Query>
                          <Where>
                            <And>
                            <Eq>
                              <FieldRef Name='{deskLocationColumn}' LookupId='TRUE'/>
                              <Value Type='Lookup'>{locationId}</Value>
                            </Eq>
                            <Geq>
                              <FieldRef Name='{bookingDateColumn}'/>
                              <Value Type='DateTime' IncludeTimeValue='FALSE'>{dateFormatted}</Value>
                            </Geq>
                            </And> 
                          </Where>
                        </Query>
                        <OrderBy Override='TRUE'><FieldRef Name= 'ID' Ascending= 'FALSE' /></OrderBy>
                        <RowLimit>100</RowLimit>
                        </View>";
        }

        private string GetQueryByDate(DateTime date)
        {

            string dateFormatted = date.ToString("s");
            
            return $@"<View>
                        <ViewFields>
                          <FieldRef Name='Title' />
                          <FieldRef Name='{deskDescriptionColumn}' />
                          <FieldRef Name='{facilitiesColumn}' />
                          <FieldRef Name='{deskLocationColumn}' />
                          <FieldRef Name='{deskPictureColumn}' />
                          <FieldRef Name='{coffeeMachineDistanceColumn}' />
                          <FieldRef Name='{bookingSlotColumn}' />
                          <FieldRef Name='{bookingDateColumn}' />
                          <FieldRef Name='{deskCodeColumn}' />                          
                        </ViewFields>
                        <Query>
                          <Where>
                            <Eq>
                              <FieldRef Name='{bookingDateColumn}'/>
                              <Value Type='DateTime' IncludeTimeValue='FALSE'>{dateFormatted}</Value>
                            </Eq>
                          </Where>
                        </Query>
                        <OrderBy Override='TRUE'><FieldRef Name= 'ID' Ascending= 'FALSE' /></OrderBy>
                        <RowLimit>100</RowLimit>
                        </View>";
        }

        private string GetQueryAvailable()
        {              
            string dateFormatted = DateTime.Today.ToString("s");

            return $@"<View>
                        <ViewFields>
                          <FieldRef Name='Title' />
                          <FieldRef Name='{deskDescriptionColumn}' />
                          <FieldRef Name='{facilitiesColumn}' />
                          <FieldRef Name='{deskLocationColumn}' />
                          <FieldRef Name='{deskPictureColumn}' />
                          <FieldRef Name='{coffeeMachineDistanceColumn}' />
                          <FieldRef Name='{bookingSlotColumn}' />
                          <FieldRef Name='{bookingDateColumn}' />
                          <FieldRef Name='{deskCodeColumn}' />                          
                        </ViewFields>
                        <Query>
                          <Where>
                            <Geq>
                              <FieldRef Name='{bookingDateColumn}'/>
                              <Value Type='DateTime' IncludeTimeValue='FALSE'>{dateFormatted}</Value>
                            </Geq>
                          </Where>
                        </Query>
                        <OrderBy Override='TRUE'><FieldRef Name= 'ID' Ascending= 'FALSE' /></OrderBy>
                        <RowLimit>100</RowLimit>
                        </View>";
        }
        
        private DeskAvailability GetDeskAvailability(List<Facility> facilities, List<Location> locations, IListItem item)
        {
            string facilitiesAsText = "";

            var values = (item.Values[facilitiesColumn] as IFieldValueCollection).Values;
            foreach (IFieldLookupValue lookup in values)
            {

                facilitiesAsText += values.IndexOf(lookup) == values.Count - 1 ?
                    facilities.First(f => f.Id.Equals(lookup.LookupId)).Name :
                    facilities.First(f => f.Id.Equals(lookup.LookupId)).Name + ", ";
            }

            
            List<string> timeSlotList = (List<string>)item.Values[bookingSlotColumn];

            var deskAvailability = new DeskAvailability()
            {
                Id = item.Id,
                Title = item.Title,
                Code = (string)item.Values[deskCodeColumn],
                CoffeeMachineDistance = Convert.ToInt32((double)item.Values[coffeeMachineDistanceColumn]),
                Description = (string)item.Values[deskDescriptionColumn],
                Facilities = facilitiesAsText,
                Location = locations.First(l => l.Id.Equals((item[deskLocationColumn] as IFieldLookupValue).LookupId)).Name,
                Picture = new Uri((item.Values[deskPictureColumn] as IFieldUrlValue).Url),
                Date = (DateTime)item.Values[bookingDateColumn],
                TimeSlot = timeSlotList[0]
            };
            return deskAvailability;
        }

        private static IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }        
    }
}
