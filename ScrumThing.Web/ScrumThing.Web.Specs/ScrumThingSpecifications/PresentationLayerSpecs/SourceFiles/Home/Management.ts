
module ScrumThing.ViewModels {
    export class Management extends ScrumThing.BaseSprintViewModel {
        public NewStoryTagDescription: KnockoutObservable<string> = ko.observable("");

        constructor() {
            super();

            this.GetStoryTags();

            this.showSprintDropdown(false);
        }

        public AddStoryTag = () => {
            jQuery.ajax({
                type: 'POST',
                url: '/Management/AddStoryTag',
                data: {
                    StoryTagDescription: this.NewStoryTagDescription()
                },
                success: (rawStoryTag: RawStoryTag) => {
                    this.storyTags.push(rawStoryTag);
                    this.NewStoryTagDescription("");
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to add story tag: " + errorThrown);
                },
            });
        }

        public RemoveStoryTag = (storyTagToRemove: RawStoryTag) => {
            jQuery.ajax({
                type: 'POST',
                url: '/Management/RemoveStoryTag',
                data: {
                    StoryTagId: storyTagToRemove.StoryTagId
                },
                success: (success: boolean) => {
                    if (success) {
                        this.storyTags(_.filter(this.storyTags(), (storyTag) => storyTag.StoryTagId != storyTagToRemove.StoryTagId));
                    } else {
                        toastr.info("Story tag in use, can't remove");
                    }
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to remove story tag: " + errorThrown);
                },
            });
        }
    }
}
