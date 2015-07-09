module ScrumThing {
    export class RawTaskTag {
        public TaskTagId: number;
        public TaskTagDescription: string;
        public TaskTagClasses: string;
        public IsIncluded: boolean = false;

        public constructor(tagId: number, tagDescription: string, tagClasses: string) {
            this.TaskTagId = tagId;
            this.TaskTagClasses = tagClasses;
            this.TaskTagDescription = tagDescription;
        }
    }
}
