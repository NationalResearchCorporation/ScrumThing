using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_SetTaskTags {
        [Required]
        public int TaskId { get; set; }

        public string TaskTagIds { get; set; }
    }
}
