/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../Shared/Utility.ts" />

jQuery(function () {
    var viewModel: ScrumThing.PlanSprintViewModel = new ScrumThing.PlanSprintViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));

    (<any>window).viewModel = viewModel;
});

module ScrumThing {
    export class PlanSprintViewModel extends BaseSprintViewModel {
        // This isn't really handled in the standard way.
        // TODO: set up the multidatespicker as a proper knockout binding
        //public sprintDays: KnockoutObservable<string> = ko.observable<string>();

        constructor() {
            super();
            this.sprintId.subscribe(this.GetSprintDays, this);
            jQuery("#sprintDaysPicker").multiDatesPicker();
        }

        public AddResource() {
            this.resources.push(new Resource('', 0, 0, 0));
        }

        public RemoveResource(resource: Resource) {
            this.resources.remove(resource);
        }

        public SetResources() {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/SetResources',
                data: {
                    SprintId: this.sprintId,
                    ResourcesJson: JSON.stringify(_.map(this.resources(), (resource) => { return resource.ToRaw(); }))
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    jQuery.jGrowl("Failed to save resources: " + errorThrown);
                }
            });
        }

        public GetSprintDays() {
            if (typeof this.sprintId() === 'number') {
                jQuery.ajax({
                    type: 'POST',
                    url: '/PlanSprint/GetSprintDays',
                    data: { SprintId: this.sprintId() },
                    success: (data: Array<{ Day: string }>) => {
                        var dates = _.map(data, (date) => { return date.Day; });
                        if (dates.length > 0) {
                            jQuery('#sprintDaysPicker').multiDatesPicker('addDates', dates);
                        }                    },
                    error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                        jQuery.jGrowl("Failed to get sprint days: " + errorThrown);
                    }
                });
            }
        }

        public SetSprintDays() {
            var dates = <string[]>jQuery('#sprintDaysPicker').multiDatesPicker('getDates');
            var packedDates = dates.join('|');
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/SetSprintDays',
                data: {
                    SprintId: this.sprintId(),
                    Days: packedDates
                },
                success: (data: Array<string>) => {
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    jQuery.jGrowl("Failed to save sprint days: " + errorThrown);
                }
            });
        }

        public AddStory() {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/AddStory',
                data: {
                    SprintId: this.sprintId
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    jQuery.jGrowl("Failed to add story: " + errorThrown);
                },
                success: (data: { StoryId: number; Ordinal: number; IsReachGoal: boolean }) => {
                    this.stories.push(new Story(data.StoryId, '', 0, data.Ordinal, data.IsReachGoal, [], this.taskTags()));

                    //This is a shite UX bandaid to bring the new story into view until the
                    // UX story that covers this behavior fully is completed.
                    // see http://nrcwiki.nationalresearch.com/mediawiki/index.php/SoftwareEngineering/ScrumThingBoard
                    jQuery('#story' + data.StoryId)[0].scrollIntoView();
                }
            });
        }

        public RemoveStory(story: Story) {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/RemoveStory',
                data: {
                    StoryId: story.StoryId
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    jQuery.jGrowl("Failed to remove story: " + errorThrown);
                },
                success: (storyId: number) => {
                    this.stories.remove(story);
                }
            });
        }

        public HoursRemainingClass(hours: KnockoutObservable<number>): string {
            if (hours() < 10) {
                return "text-danger";
            } else if (hours() < 30) {
                return "text-warning";
            }
            return "text-success";
        }

        public Drag(event: any) {
            event.dataTransfer.setData('text', event.target.id);
        }

        public AllowDrop(event: any) {
            event.preventDefault();
        }

        public DropStory(event: any, ordinal: number) {
            var htmlId = event.dataTransfer.getData('text');
            var story = _.find(this.stories(), (t) => { return t.HtmlId == htmlId; });
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/MoveStory',
                data: {
                    StoryId: story.StoryId,
                    NewOrdinal: ordinal
                },
                success: (data: Array<{ StoryId: number; Ordinal: number }>) => {
                    for (var ii = 0; ii < data.length; ii++) {
                        var modifiedStory = _.findWhere(this.stories(), { StoryId: data[ii].StoryId });
                        modifiedStory.Ordinal(data[ii].Ordinal);
                    }
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    jQuery.jGrowl("Failed to change story's order: " + errorThrown);
                }
            });
        }

        public DropTask(event: any, story: number, ordinal: number) {
            var htmlId = event.dataTransfer.getData('text');
            var task = _.find(this.tasks(), (t) => { return t.HtmlId == htmlId; });
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/MoveTask',
                data: {
                    TaskId: task.TaskId,
                    NewStoryId: story,
                    NewOrdinal: ordinal
                },
                success: (data: Array<{ TaskId: number; Ordinal: number }>) => {                    
                    for (var ii = 0; ii < data.length; ii++) {
                        var modifiedTask = _.findWhere(this.tasks(), { TaskId: data[ii].TaskId });
                        modifiedTask.Ordinal(data[ii].Ordinal);
                    }

                    // ToDo. Modify when add StoryId to Task model                
                    var currentTask = _.findWhere(this.tasks(), { TaskId: task.TaskId });
                    for (var ii = 0; ii < this.stories().length; ii++) {                        
                        if (_.contains(this.stories()[ii].Tasks(), currentTask)) {                            
                            if (this.stories()[ii].StoryId != story) {
                                var newStory = _.findWhere(this.stories(), { StoryId: story });

                                this.stories()[ii].Tasks.remove(currentTask);
                                newStory.Tasks.push(currentTask);
                            }
                        }
                    }
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    jQuery.jGrowl("Failed to change task's order: " + errorThrown);
                }
            });
        }

        public OnDropStory(index: number) {
            return "viewModel.DropStory(event, " + (index + 1) + ")";
        }

        public OnDropTask(story: Story, index: number) {
            return "viewModel.DropTask(event, " + story.StoryId + ", " + (index + 1) + ")";
        }

        public ExportSprint() {
            jQuery("#exportSprintForm").submit();
        }
    }
}
