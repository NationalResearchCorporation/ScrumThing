
module ScrumThing {
    export class StoryTag {
        public StoryTagId: number;
        public StoryTagDescription: KnockoutObservable<string>;
        public Ordinal: KnockoutObservable<number>;
        public Enabled: KnockoutObservable<boolean>;

        public constructor(rawStoryTag: RawStoryTag) {
            this.StoryTagId = rawStoryTag.StoryTagId;
            this.StoryTagDescription = ko.observable(rawStoryTag.StoryTagDescription);
            this.Ordinal = ko.observable(rawStoryTag.Ordinal);
            this.Enabled = ko.observable(rawStoryTag.Enabled);
        }
    }
} 
