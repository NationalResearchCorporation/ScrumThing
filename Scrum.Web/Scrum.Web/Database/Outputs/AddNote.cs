using System;

namespace Scrum.Web.Database.Outputs {
    public class Output_AddNote {
        public int TaskId { get; set; }
        public string UserName { get; set; }
        public string Note { get; set; }
        public string Timestamp { get; set; }
    }
}
