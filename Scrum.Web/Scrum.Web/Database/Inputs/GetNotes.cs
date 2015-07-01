using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Scrum.Web.Database.Inputs {
    public class Input_GetNotes {
        [Required]
        public int TaskId { get; set; }
    }
}
