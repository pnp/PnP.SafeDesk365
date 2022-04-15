
namespace SafeDesk365.Api.Bookings
{
    public interface IBookingService
    {
        Task<int> Create(Booking? booking);
        Task<Booking> GetById(int id);
        Task<List<Booking>> GetAll();
        Task<List<Booking>> GetUpcoming();
        Task<List<Booking>> GetAllForUser(string email);
        void Update(Booking booking);
        Task<bool> Delete(int id);
        Task<Booking> CheckInById(int id);
        Task<Booking> CheckOutById(int id);
    }
}
