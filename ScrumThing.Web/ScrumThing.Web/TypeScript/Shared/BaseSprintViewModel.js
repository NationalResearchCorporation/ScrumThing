/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="Utility.ts" />
var ScrumThing;
(function (ScrumThing) {
    var BaseSprintViewModel = (function () {
        function BaseSprintViewModel() {
            var _this = this;
            this.sprints = ko.observableArray();
            this.sprintId = ko.observable();
            this.sprintName = ko.observable();
            this.resources = ko.observableArray();
            this.stories = ko.observableArray();
            this.teams = ko.observableArray();
            this.currentTeam = ko.observable();
            this.committedStories = ko.computed(function () {
                return _.filter(_this.stories(), function (story) {
                    return !story.IsReachGoal();
                }).sort(function (a, b) {
                    return a.Ordinal() - b.Ordinal();
                });
            });

            this.reachStories = ko.computed(function () {
                return _.filter(_this.stories(), function (story) {
                    return story.IsReachGoal();
                }).sort(function (a, b) {
                    return a.Ordinal() - b.Ordinal();
                });
            });

            this.tasks = ko.computed(function () {
                return _.flatten(_.map(_this.stories(), function (story) {
                    return story.Tasks();
                }));
            });

            this.committedTasks = ko.computed(function () {
                return _.flatten(_.map(_this.committedStories(), function (story) {
                    return story.Tasks();
                }));
            });

            this.totalDevHoursAvailable = ko.computed(function () {
                var hours = _.map(_this.resources(), function (r) {
                    return r.TotalDevHours();
                });
                return ScrumThing.sum(hours);
            });

            this.totalQsHoursAvailable = ko.computed(function () {
                var hours = _.map(_this.resources(), function (r) {
                    return r.TotalQsHours();
                });
                return ScrumThing.sum(hours);
            });

            this.totalDevHoursAllocated = ko.computed(function () {
                return ScrumThing.sum(_.map(_this.committedTasks(), function (task) {
                    return (task.EstimatedDevHours());
                }));
            });

            this.totalQsHoursAllocated = ko.computed(function () {
                return ScrumThing.sum(_.map(_this.committedTasks(), function (task) {
                    return (task.EstimatedQsHours());
                }));
            });

            this.totalDevHoursRemaining = ko.computed(function () {
                return Math.round(_this.totalDevHoursAvailable() - _this.totalDevHoursAllocated());
            });

            this.totalQsHoursRemaining = ko.computed(function () {
                return Math.round(_this.totalQsHoursAvailable() - _this.totalQsHoursAllocated());
            });

            this.totalStoryPoints = ko.computed(function () {
                return ScrumThing.sum(_.map(_this.committedStories(), function (story) {
                    return story.StoryPoints();
                }));
            });

            this.sprintIsEmpty = ko.computed(function () {
                return _this.stories().length == 0;
            });

            this.GetTeams();
            this.GetStoryTags();
            this.GetTaskTags();
            this.sprintId.subscribe(this.GetResources, this);
            this.sprintId.subscribe(this.GetSprintInfo, this);
            this.currentTeam.subscribe(this.GetSprints, this);
            this.currentTeam.subscribe(function () {
                jQuery.cookie('team', _this.currentTeam().TeamName);
                _this.sprintName('');
            });

            jQuery(function () {
                jQuery('table').stickyTableHeaders();
            });
        }
        BaseSprintViewModel.prototype.GetSprints = function () {
            var _this = this;
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/GetSprints',
                data: {
                    TeamId: this.currentTeam().TeamId
                },
                success: function (data) {
                    _this.sprints(data);
                    if (data.length > 0) {
                        _this.sprintId(data[data.length - 1].SprintId);
                        _this.sprintName(data[data.length - 1].Name);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to get sprints: " + errorThrown);
                }
            });
        };

        BaseSprintViewModel.prototype.ChangeSprint = function (newSprintId, newSprintName) {
            var _this = this;
            return function () {
                _this.sprintId(newSprintId);
                _this.sprintName(newSprintName);
            };
        };

        BaseSprintViewModel.prototype.AddSprint = function () {
            var _this = this;
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/AddSprint',
                data: {
                    TeamId: this.currentTeam().TeamId,
                    Name: this.sprintName()
                },
                success: function (sprintId) {
                    _this.GetSprints();
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to create sprint: " + errorThrown);
                }
            });
        };

        BaseSprintViewModel.prototype.UpdateSprint = function () {
            var _this = this;
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/UpdateSprint',
                data: {
                    SprintId: this.sprintId(),
                    Name: this.sprintName()
                },
                success: function (sprintId) {
                    _this.GetSprints();
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to update sprint: " + errorThrown);
                }
            });
        };

        BaseSprintViewModel.prototype.GetResources = function () {
            var _this = this;
            if (typeof this.sprintId() === 'number') {
                jQuery.ajax({
                    type: 'POST',
                    url: '/PlanSprint/GetResources',
                    data: { SprintId: this.sprintId() },
                    success: function (data) {
                        var newResources = new Array();
                        for (var ii = 0; ii < data.length; ii++) {
                            newResources.push(new ScrumThing.Resource(data[ii].UserName, data[ii].DevPercentage, data[ii].QsPercentage, data[ii].Days));
                        }
                        _this.resources(newResources);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        toastr.error("Failed to get resources: " + errorThrown);
                    }
                });
            }
        };

        BaseSprintViewModel.prototype.GetStoryTags = function () {
            var _this = this;
            this.storyTags = ko.observableArray();

            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/GetStoryTags',
                success: function (data) {
                    _this.storyTags(data);
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to get story tags: " + errorThrown);
                }
            });
        };

        BaseSprintViewModel.prototype.GetTaskTags = function () {
            var _this = this;
            this.taskTags = ko.observableArray();

            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/GetTaskTags',
                success: function (data) {
                    // The data coming back doesn't actually include "IsIncluded" field, so we populate that manually by calling the constructor
                    _this.taskTags(_.map(data, function (tag) {
                        return new ScrumThing.RawTaskTag(tag.TaskTagId, tag.TaskTagDescription, tag.TaskTagClasses);
                    }));
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to get task tags: " + errorThrown);
                }
            });
        };

        BaseSprintViewModel.prototype.GetSprintInfo = function () {
            var _this = this;
            if (typeof this.sprintId() === 'number') {
                jQuery.ajax({
                    type: 'POST',
                    url: '/PlanSprint/GetSprintInfo',
                    data: { SprintId: this.sprintId() },
                    success: function (data) {
                        var newStories = new Array();

                        for (var ii = 0; ii < data.length; ii++) {
                            var story = data[ii];
                            var storyTags = _.map(story.StoryTags, function (tag) {
                                return tag.StoryTagId;
                            });
                            var newStory = new ScrumThing.Story(story.StoryId, story.StoryText, story.StoryPoints, story.Ordinal, story.IsReachGoal, storyTags, _this.taskTags());
                            newStory.Tasks(_.map(story.Tasks, function (task) {
                                return new ScrumThing.Task(task);
                            }));
                            newStories.push(newStory);
                        }

                        _this.stories(newStories);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        toastr.error("Failed to get sprint information: " + errorThrown);
                    }
                });
            }
        };

        BaseSprintViewModel.prototype.GetTeams = function () {
            var _this = this;
            jQuery.ajax({
                type: 'POST',
                url: '/Home/GetTeams',
                success: function (data) {
                    _this.teams(data);

                    var presetTeam = _this.getUrlVars()["Team"] || jQuery.cookie('team');
                    var newTeam = _this.teams()[0];

                    for (var ii = 0; ii < _this.teams().length; ii++) {
                        var team = _this.teams()[ii];
                        if (team.TeamName == presetTeam) {
                            newTeam = team;
                        }
                    }

                    _this.currentTeam(newTeam);
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to get teams: " + errorThrown);
                }
            });
        };

        BaseSprintViewModel.prototype.MakeSetCollapsedHandler = function (story, collapsed) {
            var _this = this;
            return function () {
                _this.SetCollapsed(story, collapsed);
            };
        };

        BaseSprintViewModel.prototype.SetCollapsed = function (story, collapsed) {
            localStorage.setItem('collapsed' + story.StoryId, JSON.stringify(collapsed));
            story.CollapsedOverride(collapsed);
        };

        BaseSprintViewModel.prototype.ExpandAll = function () {
            var _this = this;
            _.forEach(this.stories(), function (story) {
                _this.SetCollapsed(story, false);
            });
        };

        BaseSprintViewModel.prototype.CollapseAll = function () {
            var _this = this;
            _.forEach(this.stories(), function (story) {
                _this.SetCollapsed(story, true);
            });
        };

        BaseSprintViewModel.prototype.SmartCollapse = function () {
            Object.keys(localStorage).forEach(function (key) {
                if (/^collapsed/.test(key)) {
                    localStorage.removeItem(key);
                }
            });
            _.forEach(this.stories(), function (story) {
                story.CollapsedOverride(null);
            });
        };

        // Read a page's GET URL variables and return them as an associative array.
        // http://stackoverflow.com/questions/4656843/jquery-get-querystring-from-url
        BaseSprintViewModel.prototype.getUrlVars = function () {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        };
        return BaseSprintViewModel;
    })();
    ScrumThing.BaseSprintViewModel = BaseSprintViewModel;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=BaseSprintViewModel.js.map
