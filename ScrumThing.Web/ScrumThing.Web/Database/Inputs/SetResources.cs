using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_SetResources {
        [Required]
        public int SprintId { get; set; }

        public string ResourcesJson { get; set; }
    }

    public class Input_SetResources_Resource {
        public string UserName { get; set; }
        public double DevPercentage { get; set; }
        public double QsPercentage { get; set; }
        public double Days { get; set; }
        public double TotalDevHours { get; set; }
        public double TotalQsHours { get; set; }
        public double TotalHours { get; set; }
    }
}
