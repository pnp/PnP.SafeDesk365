
namespace SafeDesk365.Api.Desks
{
    public interface IDeskService
    {
        Task<List<Desk>> GetAll();

        Task<List<Desk>> GetByLocation(string location);
    }
}
