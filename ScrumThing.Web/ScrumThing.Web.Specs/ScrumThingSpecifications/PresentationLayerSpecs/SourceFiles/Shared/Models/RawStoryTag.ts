
module ScrumThing {
    export class RawStoryTag {
        public StoryTagId: number;
        public StoryTagDescription: string;
        public Ordinal: number;
        public Enabled: boolean;

        public constructor(storyTagId: number, storyTagDescription: string) {
            this.StoryTagId = storyTagId;
            this.StoryTagDescription = storyTagDescription;
        }
    }
} 
