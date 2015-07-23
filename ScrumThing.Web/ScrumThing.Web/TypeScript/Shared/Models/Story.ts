module ScrumThing {
    export class Story {
        public StoryId: number;
        public HtmlId: string;
        public Ordinal: KnockoutObservable<number> = ko.observable<number>();
        public StoryText: KnockoutObservable<string> = ko.observable<string>();
        public StoryPoints: KnockoutObservable<number> = observableNumber();
        public Tasks: KnockoutObservableArray<Task> = ko.observableArray<Task>();
        public StoryTags: KnockoutObservableArray<number> = ko.observableArray<number>();
        public StoryTagsForDropdown: KnockoutComputed<number[]>;
        public IsReachGoal: KnockoutObservable<boolean> = ko.observable<boolean>();

        public TotalDevHours: KnockoutComputed<number>;
        public TotalQsHours: KnockoutComputed<number>;
        public Collapsed: KnockoutComputed<boolean>;
        public CollapsedOverride: KnockoutObservable<boolean> = ko.observable<boolean>();

        public Complete: KnockoutComputed<boolean>;
        public Blocked: KnockoutComputed<boolean>;
        public QSReadyOrInProgress: KnockoutComputed<boolean>;
        public Progressing: KnockoutComputed<boolean>;
        public ReachToggleText: KnockoutComputed<string>;

        public constructor(storyId: number, storyText: string, storyPoints: number, ordinal: number, isReachGoal: boolean, storyTags: number[]) {
            this.StoryId = storyId
            this.HtmlId = 'story' + storyId;
            this.StoryText(storyText);
            this.StoryPoints(storyPoints);
            this.Ordinal(ordinal);
            this.IsReachGoal(isReachGoal);
            this.StoryTags(storyTags);

            this.ReachToggleText = ko.computed(() => {
                return this.IsReachGoal() ? 'Make this a commitment.' : 'Make this a reach goal.';
            });

            this.TotalDevHours = ko.computed(() => {
                return sum(_.map(this.Tasks(), (task) => { return task.EstimatedDevHours(); }));
            });

            this.TotalQsHours = ko.computed(() => {
                return sum(_.map(this.Tasks(), (task) => { return task.EstimatedQsHours(); }));
            });

            this.StoryTagsForDropdown = ko.computed<number[]>({
                read: (): number[]=> {
                    return this.StoryTags();
                },
                write: (newStoryTagIds: number[]) => {
                    jQuery.ajax({
                        type: 'POST',
                        url: '/PlanSprint/SetStoryTags',
                        data: {
                            StoryId: this.StoryId,
                            StoryTagIds: newStoryTagIds.join('|')
                        },
                        success: () => {
                            this.StoryTags(newStoryTagIds);
                        },
                        error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                            toastr.error("Failed to set story tags: " + errorThrown);
                        }
                    });
                }
            });

            this.Complete = ko.computed(() => {
                return _.all(this.Tasks(), (task) => { return task.State() == "Complete"; });
            });

            this.Blocked = ko.computed(() => {
                return _.any(this.Tasks(), (task) => { return task.State() == "Blocked"; });
            });

            this.QSReadyOrInProgress = ko.computed(() => {
                return !this.Blocked() && (_.any(this.Tasks(), (task) => { return task.State() == "ReadyForQs" }) || _.any(this.Tasks(), (task) => { return task.State() == "QsInProgress"; }));
            });


            this.Progressing = ko.computed(() => {
                return !(this.Complete() || this.Blocked() || this.QSReadyOrInProgress);
            });

            this.Collapsed = ko.computed(() => {
                if (this.CollapsedOverride() === null) {
                    return this.Complete();
                }
                return this.CollapsedOverride();
            });

            this.CollapsedOverride(JSON.parse(localStorage.getItem("collapsed" + this.StoryId)));

            this.StoryText.subscribe(this.UpdateStory);
            this.StoryPoints.subscribe(this.UpdateStory);
        }

        public UpdateStory = () => {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/UpdateStory',
                data: {
                    StoryId: this.StoryId,
                    StoryText: this.StoryText(),
                    StoryPoints: this.StoryPoints(),
                    IsReachGoal: this.IsReachGoal()
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to update story: " + errorThrown);
                }
            });
        }

        public AddTask() {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/AddTask',
                data: {
                    StoryId: this.StoryId
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to add task: " + errorThrown);
                },
                success: (data: { TaskId: number; Ordinal: number }) => {
                    var task = new RawTask(data.TaskId, data.Ordinal);
                    this.Tasks.push(new Task(task));
                }
            });
        }

        public RemoveTask(task: Task) {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/RemoveTask',
                data: {
                    TaskId: task.TaskId
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to add task: " + errorThrown);
                },
                success: (taskId: number) => {
                    this.Tasks.remove(task);
                }
            });
        }
    }
}
