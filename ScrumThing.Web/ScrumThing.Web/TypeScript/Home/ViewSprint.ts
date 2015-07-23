/// <reference path='../../Scripts/typings/underscore/underscore.d.ts' />
/// <reference path='../Shared/Utility.ts' />

jQuery(function () {
    var viewModel: ScrumThing.ViewSprintViewModel = new ScrumThing.ViewSprintViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));

    (<any>window).viewModel = viewModel;
});

module ScrumThing {
    export class ViewSprintViewModel extends BaseSprintViewModel {
        public currentTask: KnockoutObservable<Task> = ko.observable<Task>(null);
        public newNote: KnockoutObservable<string> = ko.observable<string>();

        public states: string[] = [
            'Blocked',
            'ReadyForDev',
            'DevInProgress',
            'ReadyForQs',
            'QsInProgress',
            'Complete'
        ];

        constructor() {
            super();

            // TODO: Move this to a custom binding
            this.currentTask.subscribe(() => {
                jQuery("#taskDetails").modal();
            });

            // If the user goes idle for more than 60 seconds
            jQuery(document).idleTimer(60 * 1000);
            // Then when they return, reload all the sprint info
            jQuery(document).on("active.idleTimer", () => { this.GetSprintInfo(); })
        }

        public GetStoryTasksInState(story: Story, state: string): KnockoutComputed<Task[]> {
            return ko.computed(() => {
                return _.sortBy(_.filter(story.Tasks(), (task) => { return task.State() == state; }), (task) => task.Ordinal());
            });
        }

        public GetSelectedStoryTags(story: Story): KnockoutComputed<RawStoryTag[]> {
            return ko.computed(() => {
                return _.filter(this.storyTags(), (tag) => { return _.contains(story.StoryTags(), tag.StoryTagId) });
            });
        }

        public GetAllAssignmentsForStory(story: Story): KnockoutComputed<string[]> {
            return ko.computed(() => {
                var assignments: RawAssignment[][] = _.map(story.Tasks(), (task) => task.Assignments());
                var flattenedAssignments: RawAssignment[] = _.flatten(assignments);
                var userNames: string[] = _.map(flattenedAssignments, (rawAssignment) => rawAssignment.UserName);
                return _.unique(userNames);
            });
        }

        public Drag(event: any) {
            event.dataTransfer.setData('text', event.target.id);
        }

        public AllowDrop(event: any) {
            event.preventDefault();
        }

        public DropTask(event: any, state: string) {
            var htmlId = event.dataTransfer.getData('text');
            var task = _.find(this.tasks(), (t) => { return t.HtmlId == htmlId; });
            task.State(state);
        }

        public SetTask(task: Task) {
            return () => {
                this.currentTask(task);
            }
        }

        public OnDropTask(state: { State: string }) {
            return "viewModel.DropTask(event, '" + state.State + "')";
        }

        public ClassForTask(task: Task) {
            return ko.computed(() => {
                if (this.currentTask() != null && task.TaskId == this.currentTask().TaskId) {
                    return "active";
                }

                if (task.State() == "Blocked") {
                    return "list-group-item-danger";
                }

                return "";
            });
        }

        public ClassForAssignment(task: Task, username: string) {
            var assigned = _.any(task.Assignments(), (assignment) => { return assignment.UserName == username; });
            if (assigned) {
                return "btn-primary";
            }
            return "btn-default";
        }

        public AddNote() {
            jQuery.ajax({
                type: 'POST',
                url: '/ViewSprint/AddNote',
                data: {
                    TaskId: this.currentTask().TaskId,
                    Note: this.newNote()
                },
                success: (data: RawNote) => {
                    this.newNote('');
                    this.currentTask().Notes.unshift(new Note(data));
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to add note: " + errorThrown);
                }
            });
        }

    }
}
