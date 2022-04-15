
namespace SafeDesk365.Api.Locations
{
    public class SPListLocationService : ILocationService
    {
        private readonly IPnPContextFactory pnpContextFactory;
        private readonly IConfiguration configuration;

        public SPListLocationService(IPnPContextFactory pnPContextFactory, IConfiguration configuration)
        {
            this.pnpContextFactory = pnPContextFactory;
            this.configuration = configuration;
        }

        public async Task<List<Location>> GetAll()
        {
            var result = new List<Location>();
            var listTitle = configuration.GetValue<string>("SafeDesk365:Lists:Locations:ListName"); 
            var addressColumn = configuration.GetValue<string>("SafeDesk365:Lists:Locations:AddressColumn");

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

                foreach(var item in myList.Items)
                {
                    var loc = new Location()
                    {
                        Id = item.Id,
                        Address= (string)item.Values[addressColumn],
                        Name = item.Title
                    };
                    result.Add(loc);
                }
            }

            return result;
        }
    }
}
