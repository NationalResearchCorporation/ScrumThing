
namespace ScrumThing.Web.Database.Outputs {
    public class Output_GetResources {
        public int SprintId { get; set; }
        public string UserName { get; set; }
        public double DevPercentage { get; set; }
        public double QsPercentage { get; set; }
        public double Days { get; set; }
        public double TotalDevHours { get; set; }
        public double TotalQsHours { get; set; }
        public double TotalHours { get; set; }
    }
}
