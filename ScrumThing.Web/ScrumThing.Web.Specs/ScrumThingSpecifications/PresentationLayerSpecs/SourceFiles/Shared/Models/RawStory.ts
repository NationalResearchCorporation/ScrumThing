
module ScrumThing {
    export class RawStory {
        public StoryId: number;
        public Ordinal: number;
        public Title: string;
        public StoryText: string;
        public StoryPoints: number;
        public IsReachGoal: boolean;
        public Tasks: RawTask[];
        public StoryTags: RawStoryTag[];
    }
} 
