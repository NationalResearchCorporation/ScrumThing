using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_GetSprintDays {
        [Required]
        public int SprintId { get; set; }
    }
}
