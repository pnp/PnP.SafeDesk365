
namespace SafeDesk365.Api.Locations
{
    public class InMemoryLocationService : ILocationService
    {
        private readonly Dictionary<int, Location> _location = new();
        public void Create(Location? location)
        {
            if (location is null)
                return;            

            _location[location.Id] = location;
        }

        public void Delete(int id)
        {
            _location.Remove(id);
        }

        public Task<List<Location>> GetAll()
        {            
            return Task.FromResult(_location.Values.ToList());
        }

        public Location? GetById(int id)
        {
            return _location.GetValueOrDefault(id);
        }

        public void Update(Location location)
        {
            if (location is null)
                return;

            var existingLocation = GetById(location.Id);
            if (existingLocation is null)
                return;
            _location[location.Id] = location;
        }
    }
}
