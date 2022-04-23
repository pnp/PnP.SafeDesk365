
namespace SafeDesk365.Api.Bookings
{
    public interface IBookingService
    {
        Task<int> Create(Booking? booking);
        Task<int> CreateFromAvailability(int availabilityId, string userEmail);

        Task<Booking> GetById(int id);

        Task<List<Booking>> GetBookings(BookingQueryType type, string email = "", string location = "");        

        void Update(Booking booking);
        Task<bool> Delete(int id);

        Task<Booking> CheckInById(int id);
        Task<Booking> CheckOutById(int id);
    }

    public enum BookingQueryType
    {
        All,
        Upcoming
    }
}
