using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_GetSprint {
        [Required]
        public int TeamId { get; set; }
    }
}
