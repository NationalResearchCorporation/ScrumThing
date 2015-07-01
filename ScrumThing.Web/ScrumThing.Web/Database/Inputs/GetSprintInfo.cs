using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_GetSprintInfo {
        [Required]
        public int SprintId { get; set; }
    }
}
