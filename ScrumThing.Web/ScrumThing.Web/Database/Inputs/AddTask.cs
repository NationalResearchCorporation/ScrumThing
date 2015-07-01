using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_AddTask {
        [Required]
        public int StoryId { get; set; }
    }
}
