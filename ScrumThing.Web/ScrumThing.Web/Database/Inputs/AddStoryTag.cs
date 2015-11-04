using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_AddStoryTag {
        [Required]
        public string StoryTagDescription { get; set; }
    }
}
