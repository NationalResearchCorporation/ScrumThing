using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Scrum.Web.Database.Inputs {
    public class Input_RemoveTask {
        [Required]
        public int TaskId { get; set; }
    }
}
