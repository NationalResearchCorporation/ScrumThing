using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ScrumThing.Web.Database.Inputs
{
    public class Input_UpdateSprint
    {
        [Required]
        public int SprintId { get; set; }

        [MaxLength(200)]
        public string Name { get; set; }

    }
}