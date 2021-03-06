/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../Shared/Utility.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
jQuery(function () {
    var viewModel = new ScrumThing.PlanSprintViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));
    window.viewModel = viewModel;
});
var ScrumThing;
(function (ScrumThing) {
    var PlanSprintViewModel = (function (_super) {
        __extends(PlanSprintViewModel, _super);
        function PlanSprintViewModel() {
            var _this = this;
            _super.call(this);
            this.carryOverTargetTeam = ko.observable();
            this.carryOverSourceStory = ko.observable();
            this.days = ko.observableArray();
            this.sprintId.subscribe(this.GetSprintDays, this);
            jQuery("#sprintDaysPicker").multiDatesPicker();
            this.lastDay = ko.computed(function () {
                return _.max(_this.days());
            });
            this.IsAfterLastDayOfSprint = ko.computed(function () {
                var today = new Date();
                return _this.lastDay() < today;
            });
        }
        PlanSprintViewModel.prototype.AddResource = function () {
            this.resources.push(new ScrumThing.Resource('', 0, 0, 0));
        };
        PlanSprintViewModel.prototype.RemoveResource = function (resource) {
            this.resources.remove(resource);
        };
        PlanSprintViewModel.prototype.SetResources = function () {
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/SetResources',
                data: {
                    SprintId: this.sprintId,
                    ResourcesJson: JSON.stringify(_.map(this.resources(), function (resource) { return resource.ToRaw(); }))
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to save resources: " + errorThrown);
                }
            });
        };
        PlanSprintViewModel.prototype.GetSprintDays = function () {
            var _this = this;
            if (typeof this.sprintId() === 'number') {
                jQuery.ajax({
                    type: 'POST',
                    url: '/PlanSprint/GetSprintDays',
                    data: { SprintId: this.sprintId() },
                    success: function (data) {
                        var dates = _.map(data, function (date) { return date.Day; });
                        _this.days(_.map(dates, function (date) { return new Date(date); }));
                        if (dates.length > 0) {
                            jQuery('#sprintDaysPicker').multiDatesPicker('resetDates');
                            jQuery('#sprintDaysPicker').multiDatesPicker('addDates', dates);
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        toastr.error("Failed to get sprint days: " + errorThrown);
                    }
                });
            }
        };
        PlanSprintViewModel.prototype.SetSprintDays = function () {
            var dates = jQuery('#sprintDaysPicker').multiDatesPicker('getDates');
            this.days(_.map(dates, function (date) { return new Date(date); }));
            var packedDates = dates.join('|');
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/SetSprintDays',
                data: {
                    SprintId: this.sprintId(),
                    Days: packedDates
                },
                success: function (data) {
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to save sprint days: " + errorThrown);
                }
            });
        };
        PlanSprintViewModel.prototype.AddStory = function (ordinal, isReachGoal) {
            var _this = this;
            return function () {
                return jQuery.ajax({
                    type: 'POST',
                    url: '/PlanSprint/AddStory',
                    data: {
                        SprintId: _this.sprintId,
                        Ordinal: ordinal,
                        IsReachGoal: isReachGoal
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        toastr.error("Failed to add story: " + errorThrown);
                    },
                    success: function (data) {
                        var story = new ScrumThing.Story(data.NewStoryId, '', '', '', 0, ordinal, isReachGoal, []);
                        story.CollapsedOverride(false);
                        _this.stories.push(story);
                        _.each(data.NewOrdinals, function (newOrdinal) {
                            var story = _.find(_this.stories(), function (candidate) { return candidate.StoryId == newOrdinal.StoryId; });
                            story.Ordinal(newOrdinal.Ordinal);
                        });
                    }
                });
            };
        };
        PlanSprintViewModel.prototype.RemoveStory = function (story) {
            var _this = this;
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/RemoveStory',
                data: {
                    StoryId: story.StoryId
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to remove story: " + errorThrown);
                },
                success: function (newOrdinals) {
                    _this.stories.remove(story);
                    _.each(_this.stories(), function (story) {
                        var newOrdinal = _.find(newOrdinals, function (item) { return item.StoryId == story.StoryId; });
                        story.Ordinal(newOrdinal.Ordinal);
                    });
                }
            });
        };
        PlanSprintViewModel.prototype.MoveStory = function (storyId, newOrdinal, isReachGoal, growlMsg) {
            var _this = this;
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/MoveStory',
                data: {
                    StoryId: storyId,
                    NewOrdinal: newOrdinal,
                    IsReachGoal: isReachGoal
                },
                success: function (data) {
                    for (var ii = 0; ii < data.length; ii++) {
                        var modifiedStory = _.findWhere(_this.stories(), { StoryId: data[ii].StoryId });
                        modifiedStory.Ordinal(data[ii].Ordinal);
                        modifiedStory.IsReachGoal(data[ii].IsReachGoal);
                    }
                    if (growlMsg) {
                        toastr.info(growlMsg);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to change story's order: " + errorThrown);
                }
            });
        };
        PlanSprintViewModel.prototype.ToggleReachGoal = function (story) {
            var msg, newOrdinal;
            if (story.IsReachGoal()) {
                newOrdinal = _.max(this.stories(), function (story) { return story.IsReachGoal() ? -1 : story.Ordinal(); }).Ordinal() + 1;
                msg = 'Story ' + story.Ordinal() + ' is now a commitment.  The new story number is ' + newOrdinal + '.';
            }
            else {
                newOrdinal = _.max(this.stories(), function (story) { return story.Ordinal(); }).Ordinal();
                msg = 'Story ' + story.Ordinal() + ' is now a reach goal.  The new story number is ' + newOrdinal + '.';
            }
            story.IsReachGoal(!story.IsReachGoal());
            this.MoveStory(story.StoryId, newOrdinal, story.IsReachGoal(), msg);
        };
        PlanSprintViewModel.prototype.HoursRemainingClass = function (hours) {
            if (hours() < 10) {
                return "text-danger";
            }
            else if (hours() < 30) {
                return "text-warning";
            }
            return "text-success";
        };
        PlanSprintViewModel.prototype.Drag = function (event) {
            event.dataTransfer.setData('text', event.target.id);
        };
        PlanSprintViewModel.prototype.AllowDrop = function (event) {
            event.preventDefault();
        };
        PlanSprintViewModel.prototype.DropStory = function (event, ordinal, isReachGoal) {
            var htmlId = event.dataTransfer.getData('text');
            var story = _.find(this.stories(), function (t) { return t.HtmlId == htmlId; });
            this.MoveStory(story.StoryId, ordinal, isReachGoal);
        };
        PlanSprintViewModel.prototype.DropTask = function (event, story, ordinal) {
            var _this = this;
            var htmlId = event.dataTransfer.getData('text');
            var task = _.find(this.tasks(), function (t) { return t.HtmlId == htmlId; });
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/MoveTask',
                data: {
                    TaskId: task.TaskId,
                    NewStoryId: story,
                    NewOrdinal: ordinal
                },
                success: function (data) {
                    for (var ii = 0; ii < data.length; ii++) {
                        var modifiedTask = _.findWhere(_this.tasks(), { TaskId: data[ii].TaskId });
                        modifiedTask.Ordinal(data[ii].Ordinal);
                    }
                    var currentTask = _.findWhere(_this.tasks(), { TaskId: task.TaskId });
                    for (var ii = 0; ii < _this.stories().length; ii++) {
                        if (_.contains(_this.stories()[ii].Tasks(), currentTask)) {
                            if (_this.stories()[ii].StoryId != story) {
                                var newStory = _.findWhere(_this.stories(), { StoryId: story });
                                _this.stories()[ii].Tasks.remove(currentTask);
                                newStory.Tasks.push(currentTask);
                            }
                        }
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to change task's order: " + errorThrown);
                }
            });
        };
        PlanSprintViewModel.prototype.OnDropStory = function (ordinal, isReachGoal) {
            return "viewModel.DropStory(event, " + ordinal + ", " + isReachGoal + ")";
        };
        PlanSprintViewModel.prototype.OnDropTask = function (story, index) {
            return "viewModel.DropTask(event, " + story.StoryId + ", " + (index + 1) + ")";
        };
        PlanSprintViewModel.prototype.ExportSprint = function () {
            jQuery("#exportSprintForm").submit();
        };
        PlanSprintViewModel.prototype.CarryOverStoryModal = function (storyId) {
            this.carryOverTargetTeam(this.currentTeam().TeamName);
            this.carryOverSourceStory(storyId);
            jQuery("#carryOverModal").modal();
        };
        PlanSprintViewModel.prototype.ChangeTargetTeam = function (newTeamName) {
            this.carryOverTargetTeam(newTeamName);
        };
        PlanSprintViewModel.prototype.CarryOverStory = function () {
            var _this = this;
            var team = _.find(this.teams(), function (team) { return team.TeamName == _this.carryOverTargetTeam(); });
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/CarryOverStory',
                data: {
                    StoryId: this.carryOverSourceStory(),
                    TeamId: team.TeamId
                },
                success: function () {
                    jQuery("#carryOverModal").modal('hide');
                    toastr.success("Carried over story to current sprint of team:" + team.TeamName);
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to carry over story: " + errorThrown);
                }
            });
        };
        return PlanSprintViewModel;
    })(ScrumThing.BaseSprintViewModel);
    ScrumThing.PlanSprintViewModel = PlanSprintViewModel;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=PlanSprint.js.map