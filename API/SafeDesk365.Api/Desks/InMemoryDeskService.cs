
namespace SafeDesk365.Api.Desks
{
    public class InMemoryDeskService : IDeskService
    {
        private readonly Dictionary<int, Desk> _desks = new();
        public void Create(Desk? desk)
        {
            if (desk is null)
                return;

            _desks[desk.Id] = desk;
        }

        public void Delete(int id)
        {
            _desks.Remove(id);
        }

        public Task<List<Desk>> GetAll()
        {
            return Task.FromResult(_desks.Values.ToList());
        }

        public Desk? GetById(int id)
        {
            return _desks.GetValueOrDefault(id);
        }

        public void Update(Desk desk)
        {
            if (desk is null)
                return;

            var existingDesk = GetById(desk.Id);
            if (existingDesk is null)
                return;
            _desks[desk.Id] = desk;
        }

        Task<List<Desk>> IDeskService.GetByLocation(string location)
        {
            throw new NotImplementedException();
        }
    }
}
