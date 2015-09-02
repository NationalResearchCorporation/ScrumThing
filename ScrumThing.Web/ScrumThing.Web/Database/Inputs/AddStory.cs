using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_AddStory {
        [Required]
        public int SprintId { get; set; }

        [Required]
        public int Ordinal { get; set; }

        [Required]
        public bool IsReachGoal { get; set; }
    }
}
