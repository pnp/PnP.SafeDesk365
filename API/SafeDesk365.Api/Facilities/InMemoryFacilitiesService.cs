
namespace SafeDesk365.Api.Facilities
{
    public class InMemoryFacilityService : IFacilityService
    {
        private readonly Dictionary<int, Facility> _facility = new();
        public void Create(Facility? facility)
        {
            if (facility is null)
                return;

            _facility[facility.Id] = facility;
        }

        public void Delete(int id)
        {
            _facility.Remove(id);
        }

        public Task<List<Facility>> GetAll()
        {
            return Task.FromResult(_facility.Values.ToList());
        }

        public Facility? GetById(int id)
        {
            return _facility.GetValueOrDefault(id);
        }

        public void Update(Facility facility)
        {
            if (facility is null)
                return;

            var existingFacility = GetById(facility.Id);
            if (existingFacility is null)
                return;
            _facility[facility.Id] = facility;
        }
    }
}
