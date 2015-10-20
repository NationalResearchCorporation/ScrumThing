using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_CarryOverStory {
        [Required]
        public int StoryId { get; set; }

        [Required]
        public int TeamId { get; set; }
    }
}
