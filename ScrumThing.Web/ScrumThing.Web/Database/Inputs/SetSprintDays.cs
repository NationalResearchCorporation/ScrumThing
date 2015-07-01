using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_SetSprintDays {
        [Required]
        public int SprintId { get; set; }

        // Pipe delimited yyyymmdd style dates
        [Required]
        public string Days { get; set; }
    }
}
