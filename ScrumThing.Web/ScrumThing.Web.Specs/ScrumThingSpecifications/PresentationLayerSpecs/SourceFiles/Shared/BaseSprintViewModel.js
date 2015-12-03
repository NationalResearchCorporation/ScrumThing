/// <reference path="Models\StoryTag.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ScrumThing;
(function (ScrumThing) {
    var BaseSprintViewModel = (function (_super) {
        __extends(BaseSprintViewModel, _super);
        function BaseSprintViewModel() {
            var _this = this;
            _super.call(this, new ScrumThing.Providers.TeamProvider());
            this.sprints = ko.observableArray();
            this.sprintId = ko.observable();
            this.sprintName = ko.observable();
            this.newSprintName = ko.observable();
            this.resources = ko.observableArray();
            this.storyTags = ko.observableArray([]);
            this.stories = ko.observableArray();
            this.searchTerms = ko.observable("");
            this.RefreshData = function () {
                _this.GetSprintInfo();
            };
            this.searchFilteredStories = ko.computed(function () {
                var splitTerms = _.filter(_this.searchTerms().split(" "), function (term) { return term != ""; });
                var loweredTerms = _.map(splitTerms, function (term) { return term.toLowerCase(); });
                if (loweredTerms.length == 0) {
                    return _this.stories();
                }
                else {
                    return _.filter(_this.stories(), function (story) { return story.MatchesSearchTerms(loweredTerms); });
                }
            });
            this.committedStories = ko.computed(function () {
                return _.filter(_this.searchFilteredStories(), function (story) { return !story.IsReachGoal(); })
                    .sort(function (a, b) { return a.Ordinal() - b.Ordinal(); });
            });
            this.reachStories = ko.computed(function () {
                return _.filter(_this.searchFilteredStories(), function (story) { return story.IsReachGoal(); })
                    .sort(function (a, b) { return a.Ordinal() - b.Ordinal(); });
            });
            this.tasks = ko.computed(function () {
                return _.flatten(_.map(_this.stories(), function (story) { return story.Tasks(); }));
            });
            this.committedTasks = ko.computed(function () {
                return _.flatten(_.map(_this.committedStories(), function (story) { return story.Tasks(); }));
            });
            this.totalDevHoursAvailable = ko.computed(function () {
                var hours = _.map(_this.resources(), function (r) { return r.TotalDevHours(); });
                return ScrumThing.sum(hours);
            });
            this.totalQsHoursAvailable = ko.computed(function () {
                var hours = _.map(_this.resources(), function (r) { return r.TotalQsHours(); });
                return ScrumThing.sum(hours);
            });
            this.totalDevHoursAllocated = ko.computed(function () {
                return ScrumThing.sum(_.map(_this.committedTasks(), function (task) { return (task.EstimatedDevHours()); }));
            });
            this.totalQsHoursAllocated = ko.computed(function () {
                return ScrumThing.sum(_.map(_this.committedTasks(), function (task) { return (task.EstimatedQsHours()); }));
            });
            this.totalDevHoursRemaining = ko.computed(function () {
                return Math.round(_this.totalDevHoursAvailable() - _this.totalDevHoursAllocated());
            });
            this.totalQsHoursRemaining = ko.computed(function () {
                return Math.round(_this.totalQsHoursAvailable() - _this.totalQsHoursAllocated());
            });
            this.totalStoryPoints = ko.computed(function () {
                return ScrumThing.sum(_.map(_this.committedStories(), function (story) { return story.StoryPoints(); }));
            });
            this.sprintIsEmpty = ko.computed(function () {
                return _this.stories().length == 0;
            });
            this.enabledStoryTags = ko.computed(function () {
                return _.filter(_this.storyTags(), function (tag) { return tag.Enabled(); });
            });
            this.GetTaskTags();
            this.sprintId.subscribe(this.GetResources, this);
            this.sprintId.subscribe(this.GetSprintInfo, this);
            this.currentTeam.subscribe(this.GetSprints, this);
            this.currentTeam.subscribe(this.GetStoryTags, this);
            this.sprintName.subscribe(this.UpdateSprint, this);
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
                success: function (rawSprints) {
                    _this.sprints(_.map(rawSprints, function (rawSprint) { return new ScrumThing.Sprint(rawSprint); }));
                    if (rawSprints.length > 0) {
                        _this.sprintId(rawSprints[rawSprints.length - 1].SprintId);
                        _this.sprintName(rawSprints[rawSprints.length - 1].Name);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to get sprints: " + errorThrown);
                },
            });
        };
        BaseSprintViewModel.prototype.ChangeSprint = function (newSprintId, newSprintName) {
            var _this = this;
            return function () {
                _this.sprintId(newSprintId);
                _this.sprintName(newSprintName);
            };
        };
        BaseSprintViewModel.prototype.OpenAddSprintModal = function () {
            this.newSprintName('');
            jQuery("#createNewSprintModal").modal();
        };
        BaseSprintViewModel.prototype.AddSprint = function () {
            var _this = this;
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/AddSprint',
                data: {
                    TeamId: this.currentTeam().TeamId,
                    Name: this.newSprintName()
                },
                success: function (sprintId) {
                    _this.GetSprints();
                    jQuery("#createNewSprintModal").modal('hide');
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to create sprint: " + errorThrown);
                    jQuery("#createNewSprintModal").modal('hide');
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
                    var sprint = _.find(_this.sprints(), function (s) { return s.SprintId == _this.sprintId(); });
                    sprint.Name(_this.sprintName());
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
            if (this.currentTeam()) {
                jQuery.ajax({
                    type: 'POST',
                    url: '/PlanSprint/GetStoryTags',
                    data: {
                        TeamId: this.currentTeam().TeamId
                    },
                    success: function (data) {
                        var inflated = _.map(data, function (tag) { return new ScrumThing.StoryTag(tag); });
                        var sorted = _.sortBy(inflated, function (tag) { return tag.Ordinal(); });
                        _this.storyTags(sorted);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        toastr.error("Failed to get story tags: " + errorThrown);
                    }
                });
            }
        };
        BaseSprintViewModel.prototype.GetTaskTags = function () {
            var _this = this;
            this.taskTags = ko.observableArray();
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/GetTaskTags',
                success: function (data) {
                    _this.taskTags(data);
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
                            var newStory = new ScrumThing.Story(story.StoryId, story.StoryText, story.StoryPoints, story.Ordinal, story.IsReachGoal, story.StoryTags);
                            newStory.Tasks(_.map(story.Tasks, function (task) { return new ScrumThing.Task(task); }));
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
            Object.keys(localStorage)
                .forEach(function (key) {
                if (/^collapsed/.test(key)) {
                    localStorage.removeItem(key);
                }
            });
            _.forEach(this.stories(), function (story) {
                story.CollapsedOverride(null);
            });
        };
        return BaseSprintViewModel;
    })(ScrumThing.BaseViewModel);
    ScrumThing.BaseSprintViewModel = BaseSprintViewModel;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=BaseSprintViewModel.js.map