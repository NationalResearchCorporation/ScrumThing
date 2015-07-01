using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Scrum.Web.Database.Inputs {
    public class Input_AddStory {
        [Required]
        public int SprintId { get; set; }
    }
}
