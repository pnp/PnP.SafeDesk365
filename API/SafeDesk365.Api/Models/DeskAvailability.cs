
namespace SafeDesk365.Models
{
    public class DeskAvailability
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Description { get; set; } = "";
        public int CoffeeMachineDistance { get; set; }
        public string Location { get; set; } = "";
        public Uri Picture { get; set; }
        public string Facilities { get; set; } = "";
        public DateTime Date { get; set; } 
        public string TimeSlot { get; set; } = "";
    }
}
