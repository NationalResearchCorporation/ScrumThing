﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_MoveStory {
        [Required]
        public int StoryId { get; set; }

        [Required]
        public int NewOrdinal { get; set; }

        [Required]
        public bool IsReachGoal { get; set; }
    }
}
