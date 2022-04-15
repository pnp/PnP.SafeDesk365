
namespace SafeDesk365.Api.Desks
{
    public class SPListDeskService : IDeskService
    {
        private readonly IPnPContextFactory pnpContextFactory;
        private readonly IConfiguration configuration;
        private readonly IFacilityService facilitiesService;
        private readonly ILocationService locationService;

        string listTitle;
        string descriptionColumn;
        string facilitiesColumn;
        string locationColumn;
        string pictureColumn;
        string coffeeMachineDistanceColumn;

        public SPListDeskService(IPnPContextFactory pnPContextFactory, IConfiguration configuration,
            IFacilityService facilitiesService, ILocationService locationService)
        {
            this.pnpContextFactory = pnPContextFactory;
            this.configuration = configuration;
            this.facilitiesService = facilitiesService;
            this.locationService = locationService;

            #region SPListColumn Mappings
            listTitle = configuration.GetValue<string>("SafeDesk365:Lists:Desks:ListName");
            descriptionColumn = configuration.GetValue<string>("SafeDesk365:Lists:Desks:DescriptionColumn");
            facilitiesColumn = configuration.GetValue<string>("SafeDesk365:Lists:Desks:FacilitiesColumn");
            locationColumn = configuration.GetValue<string>("SafeDesk365:Lists:Desks:LocationColumn");
            pictureColumn = configuration.GetValue<string>("SafeDesk365:Lists:Desks:PictureColumn");
            coffeeMachineDistanceColumn = configuration.GetValue<string>("SafeDesk365:Lists:Desks:CoffeeMachineDistanceColumn");
            #endregion

        }

        public async Task<List<Desk>> GetAll()
        {
            var result = new List<Desk>();

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

                foreach (var item in myList.Items)
                {
                    Desk desk = GetDesk(facilities, locations, item);
                    result.Add(desk);
                }
            }

            return result;
        }

        public async Task<List<Desk>> GetByLocation(string location)
        {
            var result = new List<Desk>();

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

                string viewXml = GetByLocationIdQuery(locationId);

                var output = await myList.LoadListDataAsStreamAsync(new RenderListDataOptions()
                {
                    ViewXml = viewXml,
                    RenderOptions = RenderListDataOptionsFlags.ListData
                });

                foreach (var item in myList.Items.AsRequested())
                {
                    Desk desk = GetDesk(facilities, locations, item);
                    result.Add(desk);
                }
            }
            return result;
        }

        private string GetByLocationIdQuery(int locationId)
        {
            return $@"<View>
                        <ViewFields>
                          <FieldRef Name='Title' />
                          <FieldRef Name='{descriptionColumn}' />
                          <FieldRef Name='{facilitiesColumn}' />
                          <FieldRef Name='{locationColumn}' />
                          <FieldRef Name='{pictureColumn}' />
                          <FieldRef Name='{coffeeMachineDistanceColumn}' />
                        </ViewFields>
                        <Query>
                          <Where>
                            <BeginsWith>
                              <FieldRef Name='{locationColumn}'/>
                              <Value Type='Lookup'>{locationId}</Value>
                            </BeginsWith>
                          </Where>
                        </Query>
                        <OrderBy Override='TRUE'><FieldRef Name= 'ID' Ascending= 'FALSE' /></OrderBy>
                        <RowLimit>100</RowLimit>
                        </View>";
        }

        private Desk GetDesk(List<Facility> facilities, List<Location> locations, IListItem item)
        {
            string facilitiesAsText = "";

            var values = (item.Values[facilitiesColumn] as IFieldValueCollection).Values;
            foreach (IFieldLookupValue lookup in values)
            {

                facilitiesAsText += values.IndexOf(lookup) == values.Count - 1 ?
                    facilities.First(f => f.Id.Equals(lookup.LookupId)).Name :
                    facilities.First(f => f.Id.Equals(lookup.LookupId)).Name + ", ";
            }

            var desk = new Desk()
            {
                Id = item.Id,
                Code = item.Title,
                CoffeeMachineDistance = Convert.ToInt32((double)item.Values[coffeeMachineDistanceColumn]),
                Description = (string)item.Values[descriptionColumn],
                Facilities = facilitiesAsText,
                Location = locations.First(l => l.Id.Equals((item[locationColumn] as IFieldLookupValue).LookupId)).Name,
                Picture = new Uri((item.Values[pictureColumn] as IFieldUrlValue).Url)
            };
            return desk;
        }
    }
}
