using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Scrum.Web.Database.Inputs {
    public class Input_MoveStory {
        [Required]
        public int StoryId { get; set; }

        [Required]
        public int NewOrdinal { get; set; }
    }
}
