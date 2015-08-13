using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_AddSprint {
        [Required]
        public int TeamId { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
