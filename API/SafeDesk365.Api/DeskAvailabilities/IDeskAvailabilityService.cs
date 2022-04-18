
namespace SafeDesk365.Api.DeskAvailabilities
{
    public interface IDeskAvailabilityService
    {

        Task<List<DeskAvailability>> GetUpcoming();
        Task<DeskAvailability> GetById(int id);
        Task<List<DeskAvailability>> GetUpcomingByLocation(string location);
        Task<List<DeskAvailability>> GetByDate(DateTime selectedDate);
        Task<int> CreateUpcomingDeskAvailabilities(DateTime from, DateTime to);
        Task<bool> Delete(int id);

    }
}
