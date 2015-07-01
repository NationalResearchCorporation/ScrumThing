using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_RemoveStory {
        [Required]
        public int StoryId { get; set; }
    }
}
