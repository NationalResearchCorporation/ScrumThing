using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Scrum.Web.Database.Inputs {
    public class Input_AddNote {
        [Required]
        public int TaskId { get; set; }

        [Required]
        public string Note { get; set; }
    }
}
