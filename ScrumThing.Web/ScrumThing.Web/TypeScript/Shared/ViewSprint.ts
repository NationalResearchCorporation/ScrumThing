/// <reference path='../../Scripts/typings/underscore/underscore.d.ts' />
/// <reference path='../Shared/Utility.ts' />

jQuery(function () {
    var viewModel: Scrum.ViewSprintViewModel = new Scrum.ViewSprintViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));

    (<any>window).viewModel = viewModel;
});

module Scrum {
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
        }

        public GetStoryTasksInState(story: Story, state: string): KnockoutComputed<Task[]> {
            return ko.computed(() => {
                return _.sortBy(_.filter(story.Tasks(), (task) => { return task.State() == state; }), (task) => task.Ordinal());
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
            jQuery.ajax({
                type: 'POST',
                url: '/ViewSprint/SetTaskState',
                data: {
                    TaskId: task.TaskId,
                    State: state
                },
                success: () => {
                    task.State(state);
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    jQuery.jGrowl("Failed to update task's state: " + errorThrown);
                }
            });
        }

        public SetTask(task: Task) {
            return () => {
                this.currentTask(task);
            }
        }

        public SaveWork(task: Task) {
            return () => {
                jQuery.ajax({
                    type: 'POST',
                    url: '/ViewSprint/LogWork',
                    data: task.ToRaw(),
                    error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                        jQuery.jGrowl("Failed to update hours burned: " + errorThrown);
                    }
                });
            };
        }

        public OnDropTask(state: {State: string}) {
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

        public ToggleAssignment(task: Task, username: string) {
            return () => {
                var assigned = _.any(task.Assignments(), (assignment) => { return assignment.UserName == username; });
                var assignment = { TaskId: task.TaskId, UserName: username };
                if (assigned) {
                    jQuery.ajax({
                        type: 'POST',
                        url: '/ViewSprint/RemoveAssignment',
                        data: assignment,
                        success: () => {
                            var filtered = _.filter(task.Assignments(), (assignment) => { return assignment.UserName != username; });
                            task.Assignments(filtered);
                        },
                        error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                            jQuery.jGrowl("Failed to remove assignment: " + errorThrown);
                        }
                    });
                } else {
                    jQuery.ajax({
                        type: 'POST',
                        url: '/ViewSprint/AddAssignment',
                        data: {
                            UserName: username,
                            TaskId: task.TaskId
                        },
                        success: () => {
                            task.Assignments.push(assignment);
                        },
                        error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                            jQuery.jGrowl("Failed to add assignment: " + errorThrown);
                        }
                    });
                }
            };
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
                    this.currentTask().Notes.unshift(data);
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    jQuery.jGrowl("Failed to add note: " + errorThrown);
                }
            });
        }

        public SetCollapsed(story: Story, collapsed: boolean) {
            return () => {
                localStorage.setItem('collapsed' + story.StoryId, JSON.stringify(collapsed));
                story.CollapsedOverride(collapsed);
            };
        }

        public ClearCollapsed() {
            localStorage.clear();
            _.forEach(this.stories(), (story) => {
                story.CollapsedOverride(null);
            });
        }
    }
}
