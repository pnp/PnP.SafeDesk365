
namespace SafeDesk365.Api.DeskAvailabilities
{
    public static class DeskAvailabilityEndpoints
    {
        public static void MapDeskAvailabilityEndpoints(this WebApplication app)
        {
            app.MapGet("/api/deskAvailabilities/upcoming/", GetUpcomingDeskAvailabilities).RequireAuthorization();                     
            app.MapPost("/api/deskAvailabilities/upcoming", CreateUpcomingDeskAvailabilities).RequireAuthorization();
        }

        public static void AddDeskAvailabilityServices(this IServiceCollection services)
        {
            services.AddSingleton<IDeskAvailabilityService, SPListDeskAvailabilityService>();
        }

        internal static Task<List<DeskAvailability>> GetUpcomingDeskAvailabilities(IDeskAvailabilityService service, DateTime? selectedDate, string? location)
        {
            location = location == null ? "" : location;

            return service.GetUpcoming(selectedDate, location);
        }        
  
        internal static IResult CreateUpcomingDeskAvailabilities(IDeskAvailabilityService service, DateTime from, DateTime to)
        {
            service.CreateUpcomingDeskAvailabilities(from, to);
            return Results.Ok();
        }
    }
}
