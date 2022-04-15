
namespace SafeDesk365.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string User { get; set; } = "";
        public string DeskCode { get; set; } = "";
        public DateTime Date { get; set; }
        public string TimeSlot { get; set; } = "";
        public DateTime CheckInTime { get; set; }
        public DateTime CheckOutTime { get; set; }
        public string Location { get; set; } = "";
    }            
}
