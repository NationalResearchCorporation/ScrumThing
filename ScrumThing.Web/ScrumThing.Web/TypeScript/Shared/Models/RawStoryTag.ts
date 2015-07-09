module ScrumThing {
    export class RawStoryTag {
        public StoryTagId: number;
        public StoryTagDescription: string;

        public constructor(storyTagId: number, storyTagDescription: string) {
            this.StoryTagId = storyTagId;
            this.StoryTagDescription = storyTagDescription;
        }
    }
} 