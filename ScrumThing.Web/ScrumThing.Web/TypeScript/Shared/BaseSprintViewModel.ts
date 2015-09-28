/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="Utility.ts" />
/// <reference path="globals.ts" />

module ScrumThing {
    export class BaseSprintViewModel {
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
        public currentTeamDropdown: KnockoutComputed<string>;
        public sprintIsEmpty: KnockoutComputed<boolean>;
        public storyTags: KnockoutObservableArray<RawStoryTag>;
        public taskTags: KnockoutObservableArray<RawTaskTag>;

        public stories: KnockoutObservableArray<Story> = ko.observableArray<Story>();
        public tasks: KnockoutComputed<Task[]>;

        public teams: KnockoutObservableArray<RawTeam> = ko.observableArray<RawTeam>();
        public currentTeam: KnockoutObservable<RawTeam> = ko.observable<RawTeam>();

        public searchTerms: KnockoutObservable<string> = ko.observable<string>("");
        public searchFilteredStories: KnockoutComputed<Story[]>;

        constructor() {

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

            this.currentTeamDropdown = ko.computed(() => {
                return this.currentTeam() ? this.currentTeam().TeamName : '';
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

            this.GetTeams();
            this.GetStoryTags();
            this.GetTaskTags();
            this.sprintId.subscribe(this.GetResources, this);
            this.sprintId.subscribe(this.GetSprintInfo, this);
            this.currentTeam.subscribe(this.GetSprints, this);
            this.currentTeam.subscribe(() => {
                jQuery.cookie('team', this.currentTeam().TeamName);
            });

            this.sprintName.subscribe(this.UpdateSprint, this);

            jQuery(function () {
                jQuery('table').stickyTableHeaders();
            });
        }

        public GetSprints() {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/GetSprints',
                data: {
                    TeamId: this.currentTeam().TeamId
                },
                success: (rawSprints: Array<RawSprint>) => {
                    this.sprints(_.map(rawSprints, (rawSprint: RawSprint) => new Sprint(rawSprint)));

                    if (rawSprints.length > 0) {
                        this.sprintId(rawSprints[rawSprints.length - 1].SprintId);
                        this.sprintName(rawSprints[rawSprints.length - 1].Name);
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
                    this.GetSprints();
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
            this.storyTags = ko.observableArray<RawStoryTag>();

            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/GetStoryTags',
                success: (data: Array<RawStoryTag>) => {
                    this.storyTags(data);
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to get story tags: " + errorThrown);
                }
            });
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
                            var storyTags = _.map(story.StoryTags, (tag) => tag.StoryTagId);
                            var newStory = new Story(story.StoryId, story.StoryText, story.StoryPoints, story.Ordinal, story.IsReachGoal, storyTags)
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

        public GetTeams() {
            jQuery.ajax({
                type: 'POST',
                url: '/Home/GetTeams',
                success: (data: Array<RawTeam>) => {
                    this.teams(data);

                    var presetTeam = this.getUrlVars()["Team"] || jQuery.cookie('team');
                    var newTeam = this.teams()[0];

                    for (var ii = 0; ii < this.teams().length; ii++) {
                        var team = this.teams()[ii];
                        if (team.TeamName == presetTeam) {
                            newTeam = team;
                        }
                    }

                    this.currentTeam(newTeam);
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to get teams: " + errorThrown);
                }
            });
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

        // Read a page's GET URL variables and return them as an associative array.
        // http://stackoverflow.com/questions/4656843/jquery-get-querystring-from-url
        private getUrlVars() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }
    }
}
