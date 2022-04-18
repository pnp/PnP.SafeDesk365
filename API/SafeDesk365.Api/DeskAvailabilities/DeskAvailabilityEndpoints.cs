
namespace SafeDesk365.Api.DeskAvailabilities
{
    public static class DeskAvailabilityEndpoints
    {
        public static void MapDeskAvailabilityEndpoints(this WebApplication app)
        {
            app.MapGet("/api/deskAvailabilities/upcoming/", GetUpcomingDeskAvailabilities);            
            app.MapGet("/api/deskAvailabilities/date/{date}", GetDeskAvailabilityByDate);         
            app.MapPost("/api/deskAvailabilities/upcoming", CreateUpcomingDeskAvailabilities);
        }

        public static void AddDeskAvailabilityServices(this IServiceCollection services)
        {
            services.AddSingleton<IDeskAvailabilityService, SPListDeskAvailabilityService>();
        }

        internal static Task<List<DeskAvailability>> GetUpcomingDeskAvailabilities(IDeskAvailabilityService service, string? location)
        {
            if(location != null && location != "")
            {
                return service.GetUpcomingByLocation(location);
            }
            
            return service.GetUpcoming();
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
