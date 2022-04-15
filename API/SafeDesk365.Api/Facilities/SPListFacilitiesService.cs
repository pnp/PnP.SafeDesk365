
namespace SafeDesk365.Api.Facilities
{
    public class SPListFacilitiesService : IFacilityService
    {
        private readonly IPnPContextFactory pnpContextFactory;
        private readonly IConfiguration configuration;
        public SPListFacilitiesService(IPnPContextFactory pnPContextFactory, IConfiguration configuration)
        {
            this.pnpContextFactory = pnPContextFactory;
            this.configuration = configuration;
            
        }
        public void Create(Facility? facility)
        {
            throw new NotImplementedException();
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Facility>> GetAll()
        {
            var result = new List<Facility>();
            var listTitle = configuration.GetValue<string>("SafeDesk365:Lists:Facilities:ListName");
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
                    var fac = new Facility()
                    {
                        Id = item.Id,                        
                        Name = item.Title
                    };
                    result.Add(fac);
                }
            }

            return result;
        }

        public Facility? GetById(int id)
        {
            throw new NotImplementedException();
        }

        public void Update(Facility facility)
        {
            throw new NotImplementedException();
        }
    }
}
