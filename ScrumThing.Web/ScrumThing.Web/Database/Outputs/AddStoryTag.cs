using System.Collections.Generic;

namespace ScrumThing.Web.Database.Outputs {
    public class Output_AddStoryTag {
        public int StoryTagId { get; set; }
        public string StoryTagDescription { get; set; }
        public int Ordinal { get; set; }
        public bool Enabled { get; set; }
    }
}
