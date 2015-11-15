
module ScrumThing.ViewModels {
    export class Management extends ScrumThing.BaseSprintViewModel {
        public NewStoryTagDescription: KnockoutObservable<string> = ko.observable("");

        constructor() {
            super();

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
                    this.storyTags.push(new StoryTag(rawStoryTag));
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

        public SetStoryTagEnabled = (storyTag: StoryTag, enabled: boolean) => {
            jQuery.ajax({
                type: 'POST',
                url: '/Management/UpdateTeamStoryTagSetting',
                data: {
                    TeamId: this.currentTeam().TeamId,
                    StoryTagId: storyTag.StoryTagId,
                    Enabled: enabled
                },
                success: (success: boolean) => {
                    if (success) {
                        storyTag.Enabled(enabled);
                    } else {
                        toastr.info("Failed to update story tag");
                    }
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to update story tag: " + errorThrown);
                },
            });
        }
    }
}
