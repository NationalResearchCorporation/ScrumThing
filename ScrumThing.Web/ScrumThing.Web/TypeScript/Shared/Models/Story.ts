/// <reference path="taskordinal.ts" />
module ScrumThing {
    export class Story {
        public StoryId: number;
        public HtmlId: string;
        public Ordinal: KnockoutObservable<number> = ko.observable<number>();
        public Title: KnockoutObservable<string> = ko.observable<string>();
        public StoryText: KnockoutObservable<string> = ko.observable<string>();
        public Notes: KnockoutObservable<string> = ko.observable<string>();
        public StoryPoints: KnockoutObservable<number> = observableNumber();
        public Tasks: KnockoutObservableArray<Task> = ko.observableArray<Task>();
        public StoryTags: KnockoutObservableArray<RawStoryTag> = ko.observableArray<RawStoryTag>();
        public StoryTagsForDropdown: KnockoutComputed<number[]>;
        public IsReachGoal: KnockoutObservable<boolean> = ko.observable<boolean>();

        public TotalDevHours: KnockoutComputed<number>;
        public TotalQsHours: KnockoutComputed<number>;
        public RemainingDevHours: KnockoutComputed<number>;
        public RemainingQsHours: KnockoutComputed<number>;
        public Collapsed: KnockoutComputed<boolean>;
        public CollapsedOverride: KnockoutObservable<boolean> = ko.observable<boolean>();

        public Complete: KnockoutComputed<boolean>;
        public Blocked: KnockoutComputed<boolean>;
        public ReadyForQS: KnockoutComputed<boolean>;
        public QSInProgress: KnockoutComputed<boolean>;
        public ReadyForDev: KnockoutComputed<boolean>;
        public DevInProgress: KnockoutComputed<boolean>;
        public CssClassForState: KnockoutComputed<string[]>;
        public ReachToggleText: KnockoutComputed<string>;

        public SearchableStoryText: KnockoutComputed<string>;

        public IsCarryOverEligible: KnockoutComputed<boolean>;

        public constructor(storyId: number, title: string, storyText: string, notes: string, storyPoints: number, ordinal: number, isReachGoal: boolean, storyTags: RawStoryTag[]) {
            this.StoryId = storyId
            this.HtmlId = 'story' + storyId;
            this.Title(title);
            this.StoryText(storyText);
            this.Notes(notes);
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
                    return _.map(this.StoryTags(), (storyTag) => storyTag.StoryTagId);
                },
                write: (newStoryTagIds: number[]) => {
                    jQuery.ajax({
                        type: 'POST',
                        url: '/PlanSprint/SetStoryTags',
                        data: {
                            StoryId: this.StoryId,
                            StoryTagIds: newStoryTagIds.join('|')
                        },
                        success: (data: Array<RawStoryTag>) => {
                            this.StoryTags(data);
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

            this.ReadyForQS = ko.computed(() => {
                return _.any(this.Tasks(), (task) => { return task.State() == "ReadyForQs" });
            });

            this.QSInProgress = ko.computed(() => {
                return _.any(this.Tasks(), (task) => { return task.State() == "QsInProgress"; });
            });

            this.ReadyForDev = ko.computed(() => {
                return _.any(this.Tasks(), (task) => { return task.State() == "ReadyForDev"; });
            });

            this.DevInProgress = ko.computed(() => {
                return _.any(this.Tasks(), (task) => { return task.State() == "DevInProgress"; });
            });

            this.RemainingDevHours = ko.computed(() => {
                var result: number = 0;
                _.each(this.Tasks(), (task) => { result += task.RemainingDevHours(); });
                return result;
            });

            this.RemainingQsHours = ko.computed(() => {
                var result: number = 0;
                _.each(this.Tasks(), (task) => { result += task.RemainingQsHours(); });
                return result;
            });

            this.CssClassForState = ko.computed(() => {

                var states: Array<string> = [];

                if (this.Blocked()) {
                    states.push("blocked");
                } else if (this.ReadyForDev() || this.DevInProgress() || this.ReadyForQS() || this.QSInProgress()) {
                    if (this.ReadyForDev()) {
                        states.push("readyForDev");
                    }

                    if (this.DevInProgress()) {
                        states.push("devInProgress");
                    }

                    if (this.ReadyForQS()) {
                        states.push("readyForQS");
                    }

                    if (this.QSInProgress()) {
                        states.push("qsInProgress");
                    }
                } else if (this.Complete()) {
                    states.push("complete");
                }

                return states;
            });

            this.Collapsed = ko.computed(() => {
                if (this.CollapsedOverride() === null) {
                    return this.Complete();
                }
                return this.CollapsedOverride();
            });

            this.SearchableStoryText = ko.computed(() => {
                var title = this.Title() ? this.Title() : '';
                var storyText = this.StoryText() ? this.StoryText() : '';
                var notes = this.Notes() ? this.Notes() : '';
                return title.toLowerCase() + ' ' + storyText.toLowerCase() + ' ' + notes.toLowerCase();
            });

            this.CollapsedOverride(JSON.parse(localStorage.getItem("collapsed" + this.StoryId)));

            this.Title.subscribe(this.UpdateStory);
            this.StoryText.subscribe(this.UpdateStory);
            this.Notes.subscribe(this.UpdateStory);
            this.StoryPoints.subscribe(this.UpdateStory);

            this.IsCarryOverEligible = ko.computed(() => {
                return !this.Complete() &&
                    (this.RemainingDevHours() > 0 || this.RemainingQsHours() > 0)
            });
        }

        public UpdateStory = () => {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/UpdateStory',
                data: {
                    StoryId: this.StoryId,
                    Title: this.Title(),
                    StoryText: this.StoryText(),
                    Notes: this.Notes(),
                    StoryPoints: this.StoryPoints(),
                    IsReachGoal: this.IsReachGoal()
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to update story: " + errorThrown);
                }
            });
        }

        public AddTask(loggedBy: string) {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/AddTask',
                data: {
                    LoggedBy: loggedBy,
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
                success: (newTaskOrdinals: TaskOrdinal[]) => {
                    this.Tasks.remove(task);

                    _.each(newTaskOrdinals, (newTaskOrdinal: TaskOrdinal) => {
                        var taskToSetNewOrdinal = _.find(this.Tasks(), (candidate) => candidate.TaskId == newTaskOrdinal.TaskId);
                        taskToSetNewOrdinal.Ordinal(newTaskOrdinal.Ordinal);
                    });
                }
            });
        }

        public MatchesSearchTerms(searchTerms: Array<string>): boolean {
            return _.all(searchTerms, (term) => this.StoryTextMatches(term) ||
                this.AnyAssignmentMatches(term) ||
                this.AnyTaskTextMatches(term) ||
                this.AnyStoryTagMatches(term) ||
                this.AnyOrdinalMatches(term));
        }

        public StoryTextMatches(term: string): boolean {
            return this.SearchableStoryText().indexOf(term) != -1;
        }

        public AnyAssignmentMatches(term: string): boolean {
            return _.any(this.Tasks(), (task) => {
                return _.any(task.Assignments(), (assignment) => assignment.UserName.toLowerCase().indexOf(term) != -1);
            });
        }

        public AnyTaskTextMatches(term: string): boolean {
            return _.any(this.Tasks(), (task) => task.SearchableTaskText().indexOf(term) != -1);
        }

        public AnyStoryTagMatches(term: string): boolean {
            return _.any(this.StoryTags(), (storyTag) => storyTag.StoryTagDescription.toLowerCase().indexOf(term) != -1);
        }

        public AnyOrdinalMatches(term: string): boolean {
            return this.Ordinal().toString() == term ||
                _.any(this.Tasks(), (task) => task.Ordinal().toString() == term);
        }
    }
}
