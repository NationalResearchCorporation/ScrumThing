using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_GetResources {
        [Required]
        public int SprintId { get; set; }
    }
}
