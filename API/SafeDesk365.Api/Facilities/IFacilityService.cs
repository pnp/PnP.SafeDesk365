
namespace SafeDesk365.Api.Facilities
{
    public interface IFacilityService
    {
        void Create(Facility? facility);

        Facility? GetById(int id);
        Task<List<Facility>> GetAll();

        void Update(Facility facility);

        void Delete(int id);
    }
}
