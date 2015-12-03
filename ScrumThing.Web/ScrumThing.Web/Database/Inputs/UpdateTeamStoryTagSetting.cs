using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_UpdateTeamStoryTagSetting {
        [Required]
        public int TeamId { get; set; }

        [Required]
        public int StoryTagId { get; set; }

        [Required]
        public bool Enabled { get; set; }
    }
}
