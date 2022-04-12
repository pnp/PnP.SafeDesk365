
namespace SafeDesk365.Api.Facilities
{
    public static class FacilityEndpoints
    {
        public static void MapFacilityEndpoints(this WebApplication app)
        {
            app.MapGet("/api/facilities", GetAllFacilities);
            //app.MapGet("/facilities/{id}", GetFacilityById);
            //app.MapPost("/facilities", CreateFacility);
            //app.MapPut("/facilities/{id}", UpdateFacility);
            //app.MapDelete("/facilities/{id}", DeleteFacilityById);
        }

        public static void AddFacilityServices(this IServiceCollection services)
        {
            services.AddSingleton<IFacilityService, SPListFacilitiesService>();
        }

        internal static Task<List<Facility>> GetAllFacilities(IFacilityService service)
        {
            return service.GetAll();
        }

        internal static IResult GetFacilityById(IFacilityService service, int id)
        {
            var facilitiy = service.GetById(id);
            return facilitiy is not null ? Results.Ok(facilitiy) : Results.NotFound();
        }

        internal static IResult CreateFacility(IFacilityService service, Facility facilitiy)
        {
            service.Create(facilitiy);
            return Results.Created($"/facilities/{facilitiy.Id}", facilitiy);
        }

        internal static IResult UpdateFacility(IFacilityService service, int id, Facility updatedFacility)
        {
            var facilitiy = service.GetById(id);
            if (facilitiy is null)
            {
                return Results.NotFound();
            }

            service.Update(updatedFacility);
            return Results.Ok(updatedFacility);
        }

        internal static IResult DeleteFacilityById(IFacilityService service, int id)
        {
            service.Delete(id);
            return Results.Ok();
        }
    }
}
