
namespace SafeDesk365.Api.Locations
{
    public static class LocationEndpoints
    {
        public static void MapLocationEndpoints(this WebApplication app)
        {
            app.MapGet("/api/locations", GetAllLocations);           
        }

        public static void AddLocationServices(this IServiceCollection services)
        {
            services.AddSingleton<ILocationService, SPListLocationService>();
        }

        internal static Task<List<Location>> GetAllLocations(ILocationService service)
        {
            return service.GetAll();
        }
    }
}
