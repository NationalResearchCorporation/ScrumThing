
module ScrumThing {
    export class RawResource {
        public UserName: string;
        public DevPercentage: number;
        public QsPercentage: number;
        public Days: number;
        public TotalDevHours: number;
        public TotalQsHours: number;
        public TotalHours: number;
    }

    export class Resource {
        public UserName: KnockoutObservable<string> = ko.observable<string>();
        public DevPercentage: KnockoutObservable<number> = ko.observable<number>();
        public QsPercentage: KnockoutObservable<number> = ko.observable<number>();
        public Days: KnockoutObservable<number> = ko.observable<number>();

        public TotalDevHours: KnockoutComputed<number> = ko.computed<number>(() => {
            return Math.round(this.DevPercentage() / 100.0 * this.Days() * 4);
        });

        public TotalQsHours: KnockoutComputed<number> = ko.computed<number>(() => {
            return Math.round(this.QsPercentage() / 100.0 * this.Days() * 4);
        });

        public TotalHours: KnockoutComputed<number> = ko.computed<number>(() => {
            return Math.round((this.TotalDevHours() + this.TotalQsHours()));
        });

        public constructor(userName: string, devPercentage: number, qsPercentage: number, days: number) {
            this.UserName(userName);
            this.DevPercentage(devPercentage);
            this.QsPercentage(qsPercentage);
            this.Days(days);
        }

        public ToRaw(): RawResource {
            var raw = new RawResource();
            raw.UserName = this.UserName();
            raw.DevPercentage = this.DevPercentage();
            raw.QsPercentage = this.QsPercentage();
            raw.Days = this.Days();
            raw.TotalDevHours = this.TotalDevHours();
            raw.TotalQsHours = this.TotalQsHours();
            raw.TotalHours = this.TotalHours();
            return raw;
        }
    }

    export class Sprint {
        public SprintId: number;
        public Name: string;
    }

    export class RawStory {
        public StoryId: number;
        public Ordinal: number;
        public StoryText: string;
        public StoryPoints: number;
        public IsReachGoal: boolean;
        public Tasks: RawTask[];
        public StoryTags: RawStoryTag[];
    }

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
        public TaskTags: RawTaskTag[];
        public Blocked: KnockoutComputed<boolean>;
        public ReadyForQS: KnockoutComputed<boolean>;
        public Progressing: KnockoutComputed<boolean>;
        public ReachToggleText: KnockoutComputed<string>;

        public constructor(storyId: number, storyText: string, storyPoints: number, ordinal: number, isReachGoal: boolean, storyTags: number[], taskTags: RawTaskTag[]) {
            this.StoryId = storyId
            this.HtmlId = 'story' + storyId;
            this.Ordinal(ordinal);
            this.StoryText(storyText);
            this.StoryPoints(storyPoints);
            this.StoryTags(storyTags);
            this.IsReachGoal(isReachGoal);
            this.TaskTags = taskTags;

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
                read: (): number[] => {
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
                            jQuery.jGrowl("Failed to set story tags: " + errorThrown);
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
                return _.any(this.Tasks(), (task) => { return task.State() == "Ready For QS"; });
            });

            this.Progressing = ko.computed(() => {
                return !(this.Complete() || this.Blocked() || this.ReadyForQS);
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
                    jQuery.jGrowl("Failed to update story: " + errorThrown);
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
                    jQuery.jGrowl("Failed to add task: " + errorThrown);
                },
                success: (data: { TaskId: number; Ordinal: number }) => {
                    var task = new RawTask(data.TaskId, data.Ordinal, this.GetNewTaskTags());
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
                    jQuery.jGrowl("Failed to add task: " + errorThrown);
                },
                success: (newOrdinals: Array<{ TaskId: number; Ordinal: number }>) => {
                    this.Tasks.remove(task);

                    _.each(this.Tasks(), (task) => {
                        var newOrdinal = _.find(newOrdinals, (item) => item.TaskId == task.TaskId);
                        task.Ordinal(newOrdinal.Ordinal);
                    });
                }
            });
        }

        private GetNewTaskTags(): RawTaskTag[] {
            var tags = new Array<RawTaskTag>();
            for (var ii = 0; ii < this.TaskTags.length; ii++) {
                tags.push(this.TaskTags[ii]);
            }
            return tags;
        }

        public ToRaw(): RawStory {
            var raw = new RawStory();
            raw.StoryText = this.StoryText();
            raw.StoryPoints = this.StoryPoints();
            raw.Ordinal = this.Ordinal();
            raw.IsReachGoal = this.IsReachGoal();
            raw.Tasks = _.map(this.Tasks(), (task) => { return task.ToRaw(); });
            return raw;
        }
    }

    export class RawTask {
        public TaskId: number = -1;
        public TaskText: string = '';
        public Ordinal: number = 1;
        public State: string = 'ReadyForDev';
        public EstimatedDevHours: number = 0;
        public EstimatedQsHours: number = 0;
        public DevHoursBurned: number = 0;
        public QsHoursBurned: number = 0;
        public RemainingDevHours: number = 0;
        public RemainingQsHours: number = 0;
        public Assignments: RawAssignment[];
        public Notes: RawNote[];
        public TaskTags: RawTaskTag[];

        constructor(taskId: number, ordinal: number, taskTags: RawTaskTag[]) {
            this.TaskId = taskId;
            this.Ordinal = ordinal;
            this.TaskTags = taskTags;
        }
    }

    export class Task {
        public TaskId: number;
        public HtmlId: string;
        public Ordinal: KnockoutObservable<number> = ko.observable<number>();
        public TaskText: KnockoutObservable<string> = ko.observable<string>();
        public State: KnockoutObservable<string> = ko.observable<string>();
        public EstimatedDevHours: KnockoutObservable<number> = observableNumber();
        public EstimatedQsHours: KnockoutObservable<number> = observableNumber();
        public DevHoursBurned: KnockoutObservable<number> = observableNumber();
        public QsHoursBurned: KnockoutObservable<number> = observableNumber();
        public RemainingDevHours: KnockoutObservable<number> = observableNumber();
        public RemainingQsHours: KnockoutObservable<number> = observableNumber();
        public Assignments: KnockoutObservableArray<RawAssignment> = ko.observableArray<RawAssignment>();
        public Notes: KnockoutObservableArray<RawNote> = ko.observableArray<RawNote>();
        public TaskTags: KnockoutObservableArray<RawTaskTag> = ko.observableArray<RawTaskTag>();
        public AssignmentsForDropdown: KnockoutComputed<string[]> = ko.pureComputed<string[]>({
            read: () => {
                return _.map(this.Assignments(), (assignment) => { return assignment.UserName; });
            },
            write: (newAssignments: Array<string>) => {
                jQuery.ajax({
                    type: 'POST',
                    url: '/ViewSprint/SetAssignments',
                    data: {
                        TaskId: this.TaskId,
                        Assignments: newAssignments.join('|')
                    },
                    success: () => {
                        this.Assignments(_.map(newAssignments, (userName) => {
                            return <RawAssignment>{
                                TaskId: this.TaskId,
                                UserName: userName
                            }
                        }));
                    },
                    error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                        jQuery.jGrowl("Failed to set assignments: " + errorThrown);
                    }
                });
            }
        }, this);

        public constructor(raw: RawTask) {
            this.TaskId = raw.TaskId;
            this.HtmlId = 'task' + raw.TaskId;
            this.Ordinal(raw.Ordinal);
            this.TaskText(raw.TaskText);
            this.State(raw.State);
            this.EstimatedDevHours(raw.EstimatedDevHours);
            this.EstimatedQsHours(raw.EstimatedQsHours);
            this.DevHoursBurned(raw.DevHoursBurned);
            this.QsHoursBurned(raw.QsHoursBurned);
            this.RemainingDevHours(raw.RemainingDevHours);
            this.RemainingQsHours(raw.RemainingQsHours);
            this.Assignments(raw.Assignments);
            this.Notes(raw.Notes);
            this.TaskTags(raw.TaskTags);
            this.TaskText.subscribe(this.UpdateTask);
            this.State.subscribe(this.UpdateTask);
            this.EstimatedDevHours.subscribe(this.UpdateTask);
            this.EstimatedQsHours.subscribe(this.UpdateTask);
            this.DevHoursBurned.subscribe(this.UpdateTask);
            this.QsHoursBurned.subscribe(this.UpdateTask);
            this.RemainingDevHours.subscribe(this.UpdateTask);
            this.RemainingQsHours.subscribe(this.UpdateTask);
        }

        public UpdateTask = () => {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/UpdateTask',
                data: {
                    TaskId: this.TaskId,
                    TaskText: this.TaskText(),
                    State: this.State,
                    EstimatedDevHours: this.EstimatedDevHours,
                    EstimatedQsHours: this.EstimatedQsHours,
                    DevHoursBurned: this.DevHoursBurned,
                    QsHoursBurned: this.QsHoursBurned,
                    RemainingDevHours: this.RemainingDevHours,
                    RemainingQsHours: this.RemainingQsHours,
                    TaskTags: _.map(_.filter(this.TaskTags(), (tag) => tag.IsIncluded), (tag) => tag.TaskTagId).join('|')
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    jQuery.jGrowl("Failed to update task: " + errorThrown);
                }
            });
            return true; // Needed for checkbox click event
        }

        public ToRaw(): RawTask {
            var raw = new RawTask(this.TaskId, this.Ordinal(), this.TaskTags());
            raw.TaskText = this.TaskText();
            raw.EstimatedDevHours = this.EstimatedDevHours();
            raw.EstimatedQsHours = this.EstimatedQsHours();
            raw.DevHoursBurned = this.DevHoursBurned();
            raw.QsHoursBurned = this.QsHoursBurned();
            raw.RemainingDevHours = this.RemainingDevHours();
            raw.RemainingQsHours = this.RemainingQsHours();
            return raw;
        }
    }

    export class RawAssignment {
        public UserName: string;
        public TaskId: number;
    }

    export class RawNote {
        public TaskId: number;
        public UserName: string;
        public Note: string;
        public Timestamp: string;
    }

    export class RawTeam {
        public TeamId: number;
        public TeamName: string;
    }

    export class RawStoryTag {
        public StoryTagId: number;
        public StoryTagDescription: string;

        public constructor(storyTagId: number, storyTagDescription: string) {
            this.StoryTagId = storyTagId;
            this.StoryTagDescription = storyTagDescription;
        }
    }

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
