﻿/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="Utility.ts" />

module ScrumThing {
    export class BaseSprintViewModel {
        public sprints: KnockoutObservableArray<Sprint> = ko.observableArray<Sprint>();
        public sprintId: KnockoutObservable<number> = ko.observable<number>();
        public sprintName: KnockoutObservable<string> = ko.observable<string>();

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
        public tags: RawTag[];

        public stories: KnockoutObservableArray<Story> = ko.observableArray<Story>();
        public tasks: KnockoutComputed<Task[]>;

        public teams: KnockoutObservableArray<RawTeam> = ko.observableArray<RawTeam>();
        public currentTeam: KnockoutObservable<RawTeam> = ko.observable<RawTeam>();

        constructor() {

            this.committedStories = ko.computed(() => {
                return _.filter(this.stories(), (story) => { return !story.IsReachGoal(); })
                        .sort((a, b) => { return a.Ordinal() - b.Ordinal() });
            });

            this.reachStories = ko.computed(() => {
                return _.filter(this.stories(), (story) => { return story.IsReachGoal(); })
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

            this.GetTeams();
            this.GetTags();
            this.sprintId.subscribe(this.GetResources, this);
            this.sprintId.subscribe(this.GetSprintInfo, this);
            this.currentTeam.subscribe(this.GetSprints, this);
            this.currentTeam.subscribe(() => {
                jQuery.cookie('team', this.currentTeam().TeamName);
                this.sprintName('')
            });

            jQuery(function () {
                jQuery('table').stickyTableHeaders();
            });

            // If the user goes idle for more than 60 seconds
            jQuery(document).idleTimer(60 * 1000);
            // Then when they return, reload all the sprint info
            jQuery(document).on("active.idleTimer", () => { this.GetSprintInfo(); })
        }


        public GetSprints() {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/GetSprints',
                data: {
                    TeamId: this.currentTeam().TeamId
                },
                success: (data: Array<Sprint>) => {
                    this.sprints(data);
                    if (data.length > 0) {
                        this.sprintId(data[data.length - 1].SprintId);
                        this.sprintName(data[data.length - 1].Name);
                    }
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    jQuery.jGrowl("Failed to get sprints: " + errorThrown);
                },
            });
        }

        public ChangeSprint(newSprintId: number, newSprintName: string) {
            return () => {
                this.sprintId(newSprintId);
                this.sprintName(newSprintName);
            };
        }

        public AddSprint() {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/AddSprint',
                data: {                    
                    TeamId: this.currentTeam().TeamId,
                    Name: this.sprintName()
                },
                success: (sprintId: number) => {
                    this.GetSprints();
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    jQuery.jGrowl("Failed to create sprint: " + errorThrown);
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
                    this.GetSprints();
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    jQuery.jGrowl("Failed to update sprint: " + errorThrown);
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
                        jQuery.jGrowl("Failed to get resources: " + errorThrown);
                    }
                });
            }
        }

        public GetTags() {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/GetTags',
                success: (data: Array<RawTag>) => {
                    this.tags = new Array<RawTag>();
                    for (var ii = 0; ii < data.length; ii++) {
                        this.tags.push(new RawTag(data[ii].TagId, data[ii].TagDescription, data[ii].TagClasses));
                    }
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    jQuery.jGrowl("Failed to get task tags: " + errorThrown);
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
                            var newStory = new Story(story.StoryId, story.StoryText, story.StoryPoints, story.Ordinal, story.IsReachGoal, this.tags)

                            for (var jj = 0; jj < story.Tasks.length; jj++) {
                                var task = story.Tasks[jj];
                                newStory.Tasks.push(new Task(task));
                            }

                            newStories.push(newStory);
                        }
                        this.stories(newStories);
                    },
                    error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                        jQuery.jGrowl("Failed to get sprint information: " + errorThrown);
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
                    jQuery.jGrowl("Failed to get teams: " + errorThrown);
                }
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