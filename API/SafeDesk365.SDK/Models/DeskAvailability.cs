using Microsoft.Kiota.Abstractions.Serialization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
namespace SafeDesk365.SDK.Models {
    public class DeskAvailability : IParsable {
        /// <summary>The code property</summary>
        public string Code { get; set; }
        /// <summary>The coffeeMachineDistance property</summary>
        public int? CoffeeMachineDistance { get; set; }
        /// <summary>The date property</summary>
        public DateTimeOffset? Date { get; set; }
        /// <summary>The description property</summary>
        public string Description { get; set; }
        /// <summary>The facilities property</summary>
        public string Facilities { get; set; }
        /// <summary>The id property</summary>
        public int? Id { get; set; }
        /// <summary>The location property</summary>
        public string Location { get; set; }
        /// <summary>The picture property</summary>
        public string Picture { get; set; }
        /// <summary>The timeSlot property</summary>
        public string TimeSlot { get; set; }
        /// <summary>The title property</summary>
        public string Title { get; set; }
        /// <summary>
        /// Creates a new instance of the appropriate class based on discriminator value
        /// <param name="parseNode">The parse node to use to read the discriminator value and create the object</param>
        /// </summary>
        public static DeskAvailability CreateFromDiscriminatorValue(IParseNode parseNode) {
            _ = parseNode ?? throw new ArgumentNullException(nameof(parseNode));
            return new DeskAvailability();
        }
        /// <summary>
        /// The deserialization information for the current model
        /// </summary>
        public IDictionary<string, Action<IParseNode>> GetFieldDeserializers() {
            return new Dictionary<string, Action<IParseNode>> {
                {"code", n => { Code = n.GetStringValue(); } },
                {"coffeeMachineDistance", n => { CoffeeMachineDistance = n.GetIntValue(); } },
                {"date", n => { Date = n.GetDateTimeOffsetValue(); } },
                {"description", n => { Description = n.GetStringValue(); } },
                {"facilities", n => { Facilities = n.GetStringValue(); } },
                {"id", n => { Id = n.GetIntValue(); } },
                {"location", n => { Location = n.GetStringValue(); } },
                {"picture", n => { Picture = n.GetStringValue(); } },
                {"timeSlot", n => { TimeSlot = n.GetStringValue(); } },
                {"title", n => { Title = n.GetStringValue(); } },
            };
        }
        /// <summary>
        /// Serializes information the current object
        /// <param name="writer">Serialization writer to use to serialize this model</param>
        /// </summary>
        public void Serialize(ISerializationWriter writer) {
            _ = writer ?? throw new ArgumentNullException(nameof(writer));
            writer.WriteStringValue("code", Code);
            writer.WriteIntValue("coffeeMachineDistance", CoffeeMachineDistance);
            writer.WriteDateTimeOffsetValue("date", Date);
            writer.WriteStringValue("description", Description);
            writer.WriteStringValue("facilities", Facilities);
            writer.WriteIntValue("id", Id);
            writer.WriteStringValue("location", Location);
            writer.WriteStringValue("picture", Picture);
            writer.WriteStringValue("timeSlot", TimeSlot);
            writer.WriteStringValue("title", Title);
        }
    }
}
