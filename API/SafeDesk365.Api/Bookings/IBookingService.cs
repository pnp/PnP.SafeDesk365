
namespace SafeDesk365.Api.Bookings
{
    public interface IBookingService
    {
        Task<int> Create(Booking? booking);
        Task<int> CreateFromAvailability(int availabilityId, string userEmail);

        Task<Booking> GetById(int id);

        Task<List<Booking>> GetAll();
        Task<List<Booking>> GetAllByUser(string email);
        Task<List<Booking>> GetAllByLocation(string location);

        Task<List<Booking>> GetUpcoming();        
        Task<List<Booking>> GetUpcomingByUser(string email);

        void Update(Booking booking);
        Task<bool> Delete(int id);

        Task<Booking> CheckInById(int id);
        Task<Booking> CheckOutById(int id);
    }
}
