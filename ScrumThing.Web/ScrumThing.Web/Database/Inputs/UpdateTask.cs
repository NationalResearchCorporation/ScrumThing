using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs
{
    public class Input_UpdateTask
    {
        public string LoggedBy { get; set; }
        public int TaskId { get; set; }
        public string TaskText { get; set; }
        public string State { get; set; }
        public string TaskTags { get; set; }
        public double EstimatedDevHours { get; set; }
        public double EstimatedQsHours { get; set; }
        public double DevHoursBurned { get; set; }
        public double QsHoursBurned { get; set; }
        public double RemainingDevHours { get; set; }
        public double RemainingQsHours { get; set; }
    }

}
