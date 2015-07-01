using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Scrum.Web.Database.Inputs
{
    public class Input_UpdateTask
    {
        public int TaskId { get; set; }
        public string TaskText { get; set; }
        public string State { get; set; }
        public string Tags { get; set; }
        public double EstimatedDevHours { get; set; }
        public double EstimatedQsHours { get; set; }
        public double DevHoursBurned { get; set; }
        public double QsHoursBurned { get; set; }
        public double RemainingDevHours { get; set; }
        public double RemainingQsHours { get; set; }
    }

}
