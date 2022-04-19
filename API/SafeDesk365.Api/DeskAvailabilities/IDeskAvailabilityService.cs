
namespace SafeDesk365.Api.DeskAvailabilities
{
    public interface IDeskAvailabilityService
    {

        Task<List<DeskAvailability>> GetUpcoming(DateTime? selectedDate = null, string location = "");
        Task<DeskAvailability> GetById(int id);
        Task<int> CreateUpcomingDeskAvailabilities(DateTime from, DateTime to);
        Task<bool> Delete(int id);

    }
}
