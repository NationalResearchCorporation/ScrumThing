using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_RemoveStoryTag {
        [Required]
        public int StoryTagId { get; set; }
    }
}
