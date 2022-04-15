
namespace SafeDesk365.Api.Locations
{
    public interface ILocationService
    {
        Task<List<Location>> GetAll();

    }
}
