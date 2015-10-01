using System;

namespace ScrumThing.Web.Database.Outputs {
    public class Output_GetPersonalActionLog {
        public string MostRecentActivityLoggedBy { get; set; }
        public DateTime MostRecentTimeStamp { get; set; }
        public DateTime MinTimeperiodValue { get; set; }
        public DateTime MaxTimeperiodValue { get; set; }
        public string TeamName { get; set; }
        public int SprintId { get; set; }
        public string SprintName { get; set; }
        public int StoryOrdinal { get; set; }
        public string StoryText { get; set; }
        public bool IsReachGoal { get; set; }
        public int StoryPoints { get; set; }
        public int TaskOrdinal { get; set; }
        public string TaskText { get; set; }
        public string TaskState { get; set; }
        public decimal EstimatedDevHours { get; set; }
        public decimal EstimatedQsHours { get; set; }
        public decimal BurnedDevHours { get; set; }
        public decimal BurnedDevHoursDelta { get; set; }
        public decimal BurnedQsHours { get; set; }
        public decimal BurnedQsHoursDelta { get; set; }
        public decimal RemainingDevHours { get; set; }
        public decimal RemainingDevHoursDelta { get; set; }
        public decimal RemainingQsHours { get; set; }
        public decimal RemainingQsHoursDelta { get; set; }
    }
}