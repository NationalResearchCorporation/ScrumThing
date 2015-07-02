using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_SetStoryTags {
        [Required]
        public int StoryId { get; set; }

        public string StoryTagIds { get; set; }
    }
}
