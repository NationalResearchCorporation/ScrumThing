using System;
using System.ComponentModel.DataAnnotations;

namespace ScrumThing.Web.Database.Inputs {
    public class Input_GetPersonalActionLog {
        [Required]
        public string UserIdentity { get; set; }

        [Required]
        public DateTime FromTime { get; set; }

        [Required]
        public DateTime ToTime { get; set; }

        [Required]
        public string TimeScale { get; set; }
    }
}
