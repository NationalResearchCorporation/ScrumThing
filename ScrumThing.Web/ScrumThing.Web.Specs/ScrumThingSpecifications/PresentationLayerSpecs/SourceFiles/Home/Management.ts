
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
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to add storytag: " + errorThrown);
                },
            });
        }
    }
}
