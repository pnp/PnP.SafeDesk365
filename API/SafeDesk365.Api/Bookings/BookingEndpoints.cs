
namespace SafeDesk365.Api.Bookings
{
    public static class BookingEndpoints
    {
        public static void MapBookingEndpoints(this WebApplication app)
        {
            app.MapGet("/api/bookings", GetAllBookings);
            app.MapGet("/api/bookings/{id}", GetBookingById);
            app.MapGet("/api/bookings/upcoming", GetUpcomingBookings);            
            app.MapPost("/api/bookings", CreateBooking);
            app.MapPost("/api/bookings/availability/{id}", CreateBookingFromAvailability);
            // app.MapPut("/api/bookings/{id}", UpdateBooking);
            app.MapPut("/api/bookings/checkin/{id}", CheckInBooking);
            app.MapPut("/api/bookings/checkout/{id}", CheckOutBooking);
            app.MapDelete("/api/bookings/{id}", DeleteBookingById);
        }

        public static void AddBookingServices(this IServiceCollection services)
        {
            services.AddSingleton<IBookingService, SPListBookingService>();
        }

        internal static Task<List<Booking>> GetAllBookings(IBookingService service, string? userEmail, string? location)
        {
            bool userFilter = userEmail != null && userEmail != "";
            bool locationFilter = location != null && location != "";


            if (userFilter && !locationFilter)
            {
                return service.GetAllByUser(userEmail);
            }

            if (locationFilter && !userFilter)
            {
                return service.GetAllByLocation(location);
            }

            return service.GetAll();
        }

        internal static Task<List<Booking>> GetUpcomingBookings(IBookingService service, string? userEmail, string? location)
        {
            bool userFilter = userEmail != null && userEmail != "";
            bool locationFilter = location != null && location != "";

            if(userFilter && !locationFilter)
            {
               return service.GetUpcomingByUser(userEmail);
            }

            if(locationFilter && !userFilter)
            {
               
            }

            if(userFilter && locationFilter)
            {
                
            }
            
 
                return service.GetUpcoming();
            
        }

        internal static Task<Booking> GetBookingById(IBookingService service, int id)
        {
            var booking = service.GetById(id);
            return booking;
        }

        internal static Task<int> CreateBooking(IBookingService service, Booking booking)
        {
            return service.Create(booking);            
        }

        internal static Task<int> CreateBookingFromAvailability(IBookingService service, int id, string userEmail)
        {
            return service.CreateFromAvailability(id, userEmail);
        }

        internal static IResult UpdateBooking(IBookingService service, int id, Booking updatedBooking)
        {
            var booking = service.GetById(id);
            if (booking is null)
            {
                return Results.NotFound();
            }

            service.Update(updatedBooking);
            return Results.Ok(updatedBooking);
        }

        internal async static Task<bool> DeleteBookingById(IBookingService service, int id)
        {
            return await service.Delete(id);            
        }

        internal static async Task<Booking> CheckInBooking(IBookingService service, int id)
        {
            var booking = await service.CheckInById(id);
            return booking;
        }

        internal static async Task<Booking> CheckOutBooking(IBookingService service, int id)
        {
            var booking = await service.CheckOutById(id);
            return booking;
        }
    }
}
