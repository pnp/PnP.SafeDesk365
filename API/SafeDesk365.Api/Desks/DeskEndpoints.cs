
namespace SafeDesk365.Api.Desks
{
    public static class DeskEndpoints
    {
        public static void MapDeskEndpoints(this WebApplication app)
        {
#if NOAUTH
            app.MapGet("/api/desks", GetAllDesks);
            app.MapGet("/api/desks/location/{location}", GetDesksByLocation);
#endif

#if RELEASE
            app.MapGet("/api/desks", GetAllDesks).RequireAuthorization();
            app.MapGet("/api/desks/location/{location}", GetDesksByLocation).RequireAuthorization();
#endif

        }

        public static void AddDeskServices(this IServiceCollection services)
        {
            services.AddSingleton<IDeskService, SPListDeskService>();
        }

        internal static Task<List<Desk>> GetAllDesks(IDeskService service)
        {
            return service.GetAll();
        }

        internal static Task<List<Desk>> GetDesksByLocation(IDeskService service, string location)
        {
            return service.GetByLocation(location);
        }
    }
}
