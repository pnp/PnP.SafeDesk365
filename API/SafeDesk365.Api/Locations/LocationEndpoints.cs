
namespace SafeDesk365.Api.Locations
{
    public static class LocationEndpoints
    {
        public static void MapLocationEndpoints(this WebApplication app)
        {
#if NOAUTH
                        app.MapGet("/api/locations", GetAllLocations);
#endif

#if RELEASE
            app.MapGet("/api/locations", GetAllLocations).RequireAuthorization();
#endif

        }

        public static void AddLocationServices(this IServiceCollection services)
        {
            services.AddSingleton<ILocationService, SPListLocationService>();
        }

        internal static Task<List<Location>> GetAllLocations(ILocationService service, ClaimsPrincipal user)
        {
            return service.GetAll();
        }
    }
}
