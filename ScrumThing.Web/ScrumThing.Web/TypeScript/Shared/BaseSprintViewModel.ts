/// <reference path="Models\StoryTag.ts" />

module ScrumThing {
    export class BaseSprintViewModel extends ScrumThing.BaseViewModel {
        public sprints: KnockoutObservableArray<Sprint> = ko.observableArray<Sprint>();
        public sprintId: KnockoutObservable<number> = ko.observable<number>();
        public sprintName: KnockoutObservable<string> = ko.observable<string>();
        public newSprintName: KnockoutObservable<string> = ko.observable<string>();

        public resources: KnockoutObservableArray<Resource> = ko.observableArray<Resource>();
        public totalDevHoursAvailable: KnockoutComputed<number>;
        public totalQsHoursAvailable: KnockoutComputed<number>;
        public totalDevHoursAllocated: KnockoutComputed<number>;
        public totalQsHoursAllocated: KnockoutComputed<number>;
        public totalDevHoursRemaining: KnockoutComputed<number>;
        public totalQsHoursRemaining: KnockoutComputed<number>;
        public totalStoryPoints: KnockoutComputed<number>;
        public reachStories: KnockoutComputed<Story[]>;
        public committedStories: KnockoutComputed<Story[]>;
        public committedTasks: KnockoutComputed<Task[]>;
        
        public sprintIsEmpty: KnockoutComputed<boolean>;
        public storyTags: KnockoutObservableArray<StoryTag> = ko.observableArray<StoryTag>([]);
        public enabledStoryTags: KnockoutComputed<Array<StoryTag>>;
        public taskTags: KnockoutObservableArray<RawTaskTag>;

        public stories: KnockoutObservableArray<Story> = ko.observableArray<Story>();
        public tasks: KnockoutComputed<Task[]>;      

        public searchTerms: KnockoutObservable<string> = ko.observable<string>("");
        public searchFilteredStories: KnockoutComputed<Story[]>;

        constructor() {
            super(new ScrumThing.Providers.TeamProvider());

            this.RefreshData = () => {
                this.GetSprintInfo();
            }

            this.searchFilteredStories = ko.computed(() => {
                var splitTerms = _.filter(this.searchTerms().split(" "), (term) => term != "");
                var loweredTerms = _.map(splitTerms, (term) => term.toLowerCase());
                
                if (loweredTerms.length == 0) {
                    return this.stories();
                } else {
                    return _.filter(this.stories(), (story) => story.MatchesSearchTerms(loweredTerms));
                }
            });

            this.committedStories = ko.computed(() => {
                return _.filter(this.searchFilteredStories(), (story) => { return !story.IsReachGoal(); })
                        .sort((a, b) => { return a.Ordinal() - b.Ordinal() });
            });

            this.reachStories = ko.computed(() => {
                return _.filter(this.searchFilteredStories(), (story) => { return story.IsReachGoal(); })
                        .sort((a, b) => { return a.Ordinal() - b.Ordinal() });
            }); 
                    
            this.tasks = ko.computed(() => {
                return <Task[]>_.flatten(_.map(this.stories(), (story) => { return story.Tasks(); }));
            });

            this.committedTasks = ko.computed(() => {
                return <Task[]>_.flatten(_.map(this.committedStories(), (story) => { return story.Tasks(); }));
            });

            this.totalDevHoursAvailable = ko.computed(() => {
                var hours = _.map(this.resources(), (r) => { return r.TotalDevHours(); });
                return sum(hours);
            });

            this.totalQsHoursAvailable = ko.computed(() => {
                var hours = _.map(this.resources(), (r) => { return r.TotalQsHours(); });
                return sum(hours);
            });

            this.totalDevHoursAllocated = ko.computed(() => {
                
                return sum(_.map(this.committedTasks(), (task) => (task.EstimatedDevHours())));
            });

            this.totalQsHoursAllocated = ko.computed(() => {
                return sum(_.map(this.committedTasks(), (task) => (task.EstimatedQsHours())));
            });

            this.totalDevHoursRemaining = ko.computed(() => {
                return Math.round(this.totalDevHoursAvailable() - this.totalDevHoursAllocated());
            });

            this.totalQsHoursRemaining = ko.computed(() => {
                return Math.round(this.totalQsHoursAvailable() - this.totalQsHoursAllocated());
            });

            this.totalStoryPoints = ko.computed(() => {
                return sum(_.map(this.committedStories(), (story) => { return story.StoryPoints(); }));
            });

            this.sprintIsEmpty = ko.computed(() => {
                return this.stories().length == 0;
            });

            this.enabledStoryTags = ko.computed(() => {
                return _.filter(this.storyTags(), (tag) => tag.Enabled());
            });

            this.GetTaskTags();

            this.sprintId.subscribe(() => {
                jQuery.cookie('sprint-' + this.currentTeam().TeamId, this.sprintId(), { expires: 365 })
            });
            this.sprintId.subscribe(this.GetResources, this);
            this.sprintId.subscribe(this.GetSprintInfo, this);
            
            this.currentTeam.subscribe(() => this.GetSprints(0), this);
            this.currentTeam.subscribe(this.GetStoryTags, this);

            this.sprintName.subscribe(this.UpdateSprint, this);

            jQuery(function () {
                jQuery('table').stickyTableHeaders();
            });
        }

        public GetSprints(selectedSprintId: number = 0) {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/GetSprints',
                data: {
                    TeamId: this.currentTeam().TeamId
                },
                success: (rawSprints: Array<RawSprint>) => {
                    this.sprints(_.map(rawSprints, (rawSprint: RawSprint) => new Sprint(rawSprint)));

                    if (rawSprints.length < 0) return;

                    if (selectedSprintId > 0) { //force-select a sprint
                        this.SwitchSprintById(selectedSprintId);
                    }
                    else if (jQuery.cookie('sprint-' + this.currentTeam().TeamId) > 0) { //check for a cookie
                        this.SwitchSprintById(parseInt(jQuery.cookie('sprint-' + this.currentTeam().TeamId)));
                    }
                    else { //select to top in the list
                        this.SwitchSprint(rawSprints[0].SprintId, rawSprints[0].Name);
                    }
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to get sprints: " + errorThrown);
                },
            });
        }

        public ChangeSprint(newSprintId: number, newSprintName: string) {
            return () => {
                this.sprintId(newSprintId);
                this.sprintName(newSprintName);
            };
        }

        public SwitchSprint(sprintId: number, sprintName: string) {
            this.sprintId(sprintId);
            this.sprintName(sprintName);
        }

        public SwitchSprintById(sprintId: number) {
            this.SwitchSprint(sprintId, this.GetSprintNameFromId(sprintId)); 
        }

        public GetSprintNameFromId(sprintId: number) {
            var sprint = _.find(this.sprints(), (s: Sprint) => s.SprintId == sprintId);
            return sprint.Name();
        }

        public OpenAddSprintModal() {
            this.newSprintName('');
            jQuery("#createNewSprintModal").modal();
        }

        public AddSprint() {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/AddSprint',
                data: {                    
                    TeamId: this.currentTeam().TeamId,
                    Name: this.newSprintName()
                },
                success: (sprintId: number) => {
                    this.GetSprints(sprintId);
                    jQuery("#createNewSprintModal").modal('hide');
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to create sprint: " + errorThrown);
                    jQuery("#createNewSprintModal").modal('hide');
                }
            });
        }

        public UpdateSprint() {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/UpdateSprint',
                data: {
                    SprintId: this.sprintId(),
                    Name: this.sprintName()
                },
                success: (sprintId: number) => {
                    var sprint = _.find(this.sprints(), (s: Sprint) => s.SprintId == this.sprintId());
                    sprint.Name(this.sprintName());
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to update sprint: " + errorThrown);
                }
            });
        }

        public GetResources() {
            if (typeof this.sprintId() === 'number') {
                jQuery.ajax({
                    type: 'POST',
                    url: '/PlanSprint/GetResources',
                    data: { SprintId: this.sprintId() },
                    success: (data: Array<RawResource>) => {
                        var newResources: Array<Resource> = new Array<Resource>();
                        for (var ii = 0; ii < data.length; ii++) {
                            newResources.push(new Resource(data[ii].UserName, data[ii].DevPercentage, data[ii].QsPercentage, data[ii].Days));
                        }
                        this.resources(newResources);
                    },
                    error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                        toastr.error("Failed to get resources: " + errorThrown);
                    }
                });
            }
        }

        public GetStoryTags() {
            if (this.currentTeam()) {
                jQuery.ajax({
                    type: 'POST',
                    url: '/PlanSprint/GetStoryTags',
                    data: {
                        TeamId: this.currentTeam().TeamId
                    },
                    success: (data: Array<RawStoryTag>) => {
                        var inflated = _.map(data, (tag) => new StoryTag(tag));
                        var sorted = _.sortBy(inflated, (tag) => tag.Ordinal());
                        this.storyTags(sorted);
                    },
                    error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                        toastr.error("Failed to get story tags: " + errorThrown);
                    }
                });
            }
        }

        public GetTaskTags() {
            this.taskTags = ko.observableArray<RawTaskTag>();

            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/GetTaskTags',
                success: (data: Array<RawTaskTag>) => {
                    this.taskTags(data);
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to get task tags: " + errorThrown);
                }
            });
        }

        public GetSprintInfo() {
            if (typeof this.sprintId() === 'number') {
                jQuery.ajax({
                    type: 'POST',
                    url: '/PlanSprint/GetSprintInfo',
                    data: { SprintId: this.sprintId() },
                    success: (data: Array<RawStory>) => {
                        var newStories = new Array<Story>();

                        for (var ii = 0; ii < data.length; ii++) {
                            var story = data[ii];
                            var newStory = new Story(story.StoryId, story.Title, story.StoryText, story.Notes, story.StoryPoints, story.Ordinal, story.IsReachGoal, story.StoryTags);
                            newStory.Tasks(_.map(story.Tasks, (task) => new Task(task)));
                            newStories.push(newStory);
                        }

                        this.stories(newStories);
                    },
                    error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                        toastr.error("Failed to get sprint information: " + errorThrown);
                    }
                });
            }
        }

        public MakeSetCollapsedHandler(story: Story, collapsed: boolean) {
            return () => {
                this.SetCollapsed(story, collapsed);
            };
        }

        public SetCollapsed(story: Story, collapsed: boolean) {
            localStorage.setItem('collapsed' + story.StoryId, JSON.stringify(collapsed));
            story.CollapsedOverride(collapsed);
        }

        public ExpandAll() {
            _.forEach(this.stories(), (story) => {
                this.SetCollapsed(story, false);
            });
        }

        public CollapseAll() {
            _.forEach(this.stories(), (story) => {
                this.SetCollapsed(story, true);
            });
        }

        public SmartCollapse() {
            Object.keys(localStorage)
                .forEach((key) => {
                    if (/^collapsed/.test(key)) {
                        localStorage.removeItem(key);
                    }
                });
            _.forEach(this.stories(), (story) => {
                story.CollapsedOverride(null);
            });
        }
    }
}
