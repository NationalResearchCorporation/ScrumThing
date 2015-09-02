using System.Collections.Generic;

namespace ScrumThing.Web.Database.Outputs {
    public class Output_AddStory {
        public int NewStoryId { get; set; }
        public List<Output_AddStory_NewOrdinals> NewOrdinals { get; set; }
    }

    public class Output_AddStory_NewStoryId {
        public decimal NewStoryId { get; set; }
    }

    public class Output_AddStory_NewOrdinals {
        public int StoryId { get; set; }
        public int Ordinal { get; set; }
    }
}
