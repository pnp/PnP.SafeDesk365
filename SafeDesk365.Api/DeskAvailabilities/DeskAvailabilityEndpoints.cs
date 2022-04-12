
namespace SafeDesk365.Api.DeskAvailabilities
{
    public static class DeskAvailabilityEndpoints
    {
        public static void MapDeskAvailabilityEndpoints(this WebApplication app)
        {
            app.MapGet("/api/deskAvailabilities", GetAllDeskAvailabilities);
            app.MapGet("/api/deskAvailabilities/location/{location}", GetDeskAvailabilityByLocation);
            app.MapGet("/api/deskAvailabilities/date/{date}", GetDeskAvailabilityByDate);         
            app.MapPost("/api/deskAvailabilities/upcoming", CreateUpcomingDeskAvailabilities);
        }

        public static void AddDeskAvailabilityServices(this IServiceCollection services)
        {
            services.AddSingleton<IDeskAvailabilityService, SPListDeskAvailabilityService>();
        }

        internal static Task<List<DeskAvailability>> GetAllDeskAvailabilities(IDeskAvailabilityService service)
        {
            return service.GetAll();
        }

        internal static Task<List<DeskAvailability>> GetDeskAvailabilityByLocation(IDeskAvailabilityService service, string location)
        {
            return service.GetByLocation(location);
        }

        internal static Task<List<DeskAvailability>> GetDeskAvailabilityByDate(IDeskAvailabilityService service, DateTime date)
        {
            return service.GetByDate(date);
        }
  
        internal static IResult CreateUpcomingDeskAvailabilities(IDeskAvailabilityService service, DateTime from, DateTime to)
        {
            service.CreateUpcomingDeskAvailabilities(from, to);
            return Results.Ok();
        }
    }
}
