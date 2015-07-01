
namespace Scrum.Web.Database.Outputs {
    public class Output_GetEstimatesVsActuals {

        public int StoryID { get; set; }
        public int StoryOrdinal { get; set; }
        public string StoryText { get; set; }
        public int TaskID { get; set; }
        public int TaskOrdinal { get; set; }
        public string TaskText { get; set; }
        public double EstimatedDevHours { get; set; }
        public double DevHoursBurned { get; set; }
        public double EstimatedQsHours { get; set; }
        public double QsHoursBurned { get; set; }

    }
}
