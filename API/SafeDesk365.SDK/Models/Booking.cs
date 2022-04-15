using Microsoft.Kiota.Abstractions.Serialization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
namespace SafeDesk365.SDK.Models {
    public class Booking : IParsable {
        /// <summary>The checkInTime property</summary>
        public DateTimeOffset? CheckInTime { get; set; }
        /// <summary>The checkOutTime property</summary>
        public DateTimeOffset? CheckOutTime { get; set; }
        /// <summary>The date property</summary>
        public DateTimeOffset? Date { get; set; }
        /// <summary>The deskCode property</summary>
        public string DeskCode { get; set; }
        /// <summary>The id property</summary>
        public int? Id { get; set; }
        /// <summary>The location property</summary>
        public string Location { get; set; }
        /// <summary>The timeSlot property</summary>
        public string TimeSlot { get; set; }
        /// <summary>The title property</summary>
        public string Title { get; set; }
        /// <summary>The user property</summary>
        public string User { get; set; }
        /// <summary>
        /// Creates a new instance of the appropriate class based on discriminator value
        /// <param name="parseNode">The parse node to use to read the discriminator value and create the object</param>
        /// </summary>
        public static Booking CreateFromDiscriminatorValue(IParseNode parseNode) {
            _ = parseNode ?? throw new ArgumentNullException(nameof(parseNode));
            return new Booking();
        }
        /// <summary>
        /// The deserialization information for the current model
        /// </summary>
        public IDictionary<string, Action<IParseNode>> GetFieldDeserializers() {
            return new Dictionary<string, Action<IParseNode>> {
                {"checkInTime", n => { CheckInTime = n.GetDateTimeOffsetValue(); } },
                {"checkOutTime", n => { CheckOutTime = n.GetDateTimeOffsetValue(); } },
                {"date", n => { Date = n.GetDateTimeOffsetValue(); } },
                {"deskCode", n => { DeskCode = n.GetStringValue(); } },
                {"id", n => { Id = n.GetIntValue(); } },
                {"location", n => { Location = n.GetStringValue(); } },
                {"timeSlot", n => { TimeSlot = n.GetStringValue(); } },
                {"title", n => { Title = n.GetStringValue(); } },
                {"user", n => { User = n.GetStringValue(); } },
            };
        }
        /// <summary>
        /// Serializes information the current object
        /// <param name="writer">Serialization writer to use to serialize this model</param>
        /// </summary>
        public void Serialize(ISerializationWriter writer) {
            _ = writer ?? throw new ArgumentNullException(nameof(writer));
            writer.WriteDateTimeOffsetValue("checkInTime", CheckInTime);
            writer.WriteDateTimeOffsetValue("checkOutTime", CheckOutTime);
            writer.WriteDateTimeOffsetValue("date", Date);
            writer.WriteStringValue("deskCode", DeskCode);
            writer.WriteIntValue("id", Id);
            writer.WriteStringValue("location", Location);
            writer.WriteStringValue("timeSlot", TimeSlot);
            writer.WriteStringValue("title", Title);
            writer.WriteStringValue("user", User);
        }
    }
}
