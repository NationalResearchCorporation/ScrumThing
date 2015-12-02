using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_UpdateStory {
        [Required]
        public int StoryId { get; set; }

        public string Title { get; set; }

        [Required]
        public string StoryText { get; set; }

        public string Notes { get; set; }

        [Required]
        public int StoryPoints { get; set; }

        [Required]
        public bool IsReachGoal { get; set; }
    }
}
