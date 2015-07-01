using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Scrum.Web.Database.Inputs {
    public class Input_MoveTask {
        [Required]
        public int TaskId { get; set; }

        [Required]
        public int NewStoryId { get; set; }

        [Required]
        public int NewOrdinal { get; set; }
    }
}
