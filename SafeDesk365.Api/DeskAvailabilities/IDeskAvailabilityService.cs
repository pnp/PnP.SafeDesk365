
namespace SafeDesk365.Api.DeskAvailabilities
{
    public interface IDeskAvailabilityService
    {

        Task<List<DeskAvailability>> GetAll();

        Task<List<DeskAvailability>> GetByLocation(string location);

        Task<List<DeskAvailability>> GetByDate(DateTime selectedDate);

        Task<int> CreateUpcomingDeskAvailabilities(DateTime from, DateTime to);
        
    }
}
