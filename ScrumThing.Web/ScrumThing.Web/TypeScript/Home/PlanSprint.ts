/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../Shared/Utility.ts" />

jQuery(function () {
    var viewModel: ScrumThing.PlanSprintViewModel = new ScrumThing.PlanSprintViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));

    (<any>window).viewModel = viewModel;
});

module ScrumThing {
    export class PlanSprintViewModel extends BaseSprintViewModel {

        private lastDay: KnockoutComputed<Date>;
        public IsAfterLastDayOfSprint: KnockoutComputed<boolean>;
        private carryOverTargetTeam: KnockoutObservable<string> = ko.observable<string>();
        private carryOverSourceStory: KnockoutObservable<number> = ko.observable<number>();
        private days: KnockoutObservableArray<Date> = ko.observableArray<Date>();


        // This isn't really handled in the standard way.
        // TODO: set up the multidatespicker as a proper knockout binding
        //public sprintDays: KnockoutObservable<string> = ko.observable<string>();

       

        constructor() {
            super();
            this.sprintId.subscribe(this.GetSprintDays, this);
            jQuery("#sprintDaysPicker").multiDatesPicker();

            this.lastDay = ko.computed((): Date => {
                return _.max(this.days());
            });

            this.IsAfterLastDayOfSprint = ko.computed(() => {
                var today = new Date();
                return this.lastDay() < today;
            });
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
                    toastr.error("Failed to save resources: " + errorThrown);
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
                        this.days(_.map(dates, (date) => { return new Date(date); }));
                        if (dates.length > 0) {
                            jQuery('#sprintDaysPicker').multiDatesPicker('resetDates');
                            jQuery('#sprintDaysPicker').multiDatesPicker('addDates', dates);
                        }
                    },
                    error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                        toastr.error("Failed to get sprint days: " + errorThrown);
                    }
                });
            }
        }

        public SetSprintDays() {
            var dates = <string[]>jQuery('#sprintDaysPicker').multiDatesPicker('getDates');

            this.days(_.map(dates, (date) => { return new Date(date); }));

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
                    toastr.error("Failed to save sprint days: " + errorThrown);
                }
            });
        }

        public AddStory(ordinal: number, isReachGoal: boolean) {
            return () => {
                return jQuery.ajax({
                    type: 'POST',
                    url: '/PlanSprint/AddStory',
                    data: {
                        SprintId: this.sprintId,
                        Ordinal: ordinal,
                        IsReachGoal: isReachGoal
                    },
                    error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                        toastr.error("Failed to add story: " + errorThrown);
                    },
                    success: (data: NewStoryInfo) => {
                        var story = new Story(data.NewStoryId, '', 0, ordinal, isReachGoal, []);
                        story.CollapsedOverride(false);
                        this.stories.push(story);

                        _.each(data.NewOrdinals, (newOrdinal) => {
                            var story = _.find(this.stories(), (candidate) => candidate.StoryId == newOrdinal.StoryId);
                            story.Ordinal(newOrdinal.Ordinal);
                        });
                    }
                });
            }
        }

        public RemoveStory(story: Story) {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/RemoveStory',
                data: {
                    StoryId: story.StoryId
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to remove story: " + errorThrown);
                },
                success: (newOrdinals: Array<{ StoryId: number; Ordinal: number }>) => {
                    this.stories.remove(story);

                    _.each(this.stories(), (story) => {
                        var newOrdinal = _.find(newOrdinals, (item) => item.StoryId == story.StoryId);
                        story.Ordinal(newOrdinal.Ordinal);
                    });
                }
            });
        }

        public MoveStory(storyId: number, newOrdinal: number, isReachGoal: boolean, growlMsg?: string) {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/MoveStory',
                data: {
                    StoryId: storyId,
                    NewOrdinal: newOrdinal,
                    IsReachGoal: isReachGoal
                },
                success: (data: Array<{ StoryId: number; Ordinal: number; IsReachGoal: boolean }>) => {
                    for (var ii = 0; ii < data.length; ii++) {
                        var modifiedStory = _.findWhere(this.stories(), { StoryId: data[ii].StoryId });
                        modifiedStory.Ordinal(data[ii].Ordinal);
                        modifiedStory.IsReachGoal(data[ii].IsReachGoal);
                    }


                    if (growlMsg) {
                        toastr.info(growlMsg);
                    }
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to change story's order: " + errorThrown);
                }
            });
        }

        public ToggleReachGoal(story: Story) {

            var msg: string, newOrdinal: number;

            if (story.IsReachGoal()) {
                newOrdinal = _.max(this.stories(), (story) => story.IsReachGoal() ? -1 : story.Ordinal()).Ordinal() + 1;
                msg = 'Story ' + story.Ordinal() + ' is now a commitment.  The new story number is ' + newOrdinal + '.';
            } else {
                newOrdinal = _.max(this.stories(), (story) => story.Ordinal()).Ordinal();
                msg = 'Story ' + story.Ordinal() + ' is now a reach goal.  The new story number is ' + newOrdinal + '.';
            }

            story.IsReachGoal(!story.IsReachGoal());
            this.MoveStory(story.StoryId, newOrdinal, story.IsReachGoal(), msg);
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

        public DropStory(event: any, ordinal: number, isReachGoal: boolean) {
            var htmlId = event.dataTransfer.getData('text');
            var story = _.find(this.stories(), (t) => { return t.HtmlId == htmlId; });

            this.MoveStory(story.StoryId, ordinal, isReachGoal);
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
                    toastr.error("Failed to change task's order: " + errorThrown);
                }
            });
        }

        public OnDropStory(ordinal: number, isReachGoal: boolean) {
            return "viewModel.DropStory(event, " + ordinal + ", " + isReachGoal + ")";
        }

        public OnDropTask(story: Story, index: number) {
            return "viewModel.DropTask(event, " + story.StoryId + ", " + (index + 1) + ")";
        }

        public ExportSprint() {
            jQuery("#exportSprintForm").submit();
        }


        public CarryOverStoryModal(storyId: number) {
            this.carryOverTargetTeam(this.currentTeam().TeamName);
            this.carryOverSourceStory(storyId);
            jQuery("#carryOverModal").modal();
        }

        public ChangeTargetTeam(newTeamName: string) {
            this.carryOverTargetTeam(newTeamName);
        }

        public CarryOverStory() {
            var team = _.find(this.teams(), (team) => { return team.TeamName == this.carryOverTargetTeam() });

            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/CarryOverStory',
                data: {
                    StoryId: this.carryOverSourceStory(),
                    TeamId: team.TeamId
                },
                success: () => {
                    jQuery("#carryOverModal").modal('hide');
                    toastr.success("Carried over story to current sprint of team:" + team.TeamName);
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to carry over story: " + errorThrown);
                }
            });
        }
    }
}
