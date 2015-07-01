using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_RemoveTask {
        [Required]
        public int TaskId { get; set; }
    }
}
