/// <reference path="taskordinal.ts" />
var ScrumThing;
(function (ScrumThing) {
    var Story = (function () {
        function Story(storyId, storyText, storyPoints, ordinal, isReachGoal, storyTags) {
            var _this = this;
            this.Ordinal = ko.observable();
            this.StoryText = ko.observable();
            this.StoryPoints = ScrumThing.observableNumber();
            this.Tasks = ko.observableArray();
            this.StoryTags = ko.observableArray();
            this.IsReachGoal = ko.observable();
            this.CollapsedOverride = ko.observable();
            this.UpdateStory = function () {
                jQuery.ajax({
                    type: 'POST',
                    url: '/PlanSprint/UpdateStory',
                    data: {
                        StoryId: _this.StoryId,
                        StoryText: _this.StoryText(),
                        StoryPoints: _this.StoryPoints(),
                        IsReachGoal: _this.IsReachGoal()
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        toastr.error("Failed to update story: " + errorThrown);
                    }
                });
            };
            this.StoryId = storyId;
            this.HtmlId = 'story' + storyId;
            this.StoryText(storyText);
            this.StoryPoints(storyPoints);
            this.Ordinal(ordinal);
            this.IsReachGoal(isReachGoal);
            this.StoryTags(storyTags);
            this.ReachToggleText = ko.computed(function () {
                return _this.IsReachGoal() ? 'Make this a commitment.' : 'Make this a reach goal.';
            });
            this.TotalDevHours = ko.computed(function () {
                return ScrumThing.sum(_.map(_this.Tasks(), function (task) { return task.EstimatedDevHours(); }));
            });
            this.TotalQsHours = ko.computed(function () {
                return ScrumThing.sum(_.map(_this.Tasks(), function (task) { return task.EstimatedQsHours(); }));
            });
            this.StoryTagsForDropdown = ko.computed({
                read: function () {
                    return _.map(_this.StoryTags(), function (storyTag) { return storyTag.StoryTagId; });
                },
                write: function (newStoryTagIds) {
                    jQuery.ajax({
                        type: 'POST',
                        url: '/PlanSprint/SetStoryTags',
                        data: {
                            StoryId: _this.StoryId,
                            StoryTagIds: newStoryTagIds.join('|')
                        },
                        success: function (data) {
                            _this.StoryTags(data);
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            toastr.error("Failed to set story tags: " + errorThrown);
                        }
                    });
                }
            });
            this.Complete = ko.computed(function () {
                return _.all(_this.Tasks(), function (task) { return task.State() == "Complete"; });
            });
            this.Blocked = ko.computed(function () {
                return _.any(_this.Tasks(), function (task) { return task.State() == "Blocked"; });
            });
            this.QSReadyOrInProgress = ko.computed(function () {
                return _.any(_this.Tasks(), function (task) { return task.State() == "ReadyForQs"; }) ||
                    _.any(_this.Tasks(), function (task) { return task.State() == "QsInProgress"; });
            });
            this.DevInProgress = ko.computed(function () {
                return _.any(_this.Tasks(), function (task) { return task.State() == "DevInProgress"; });
            });
            this.CssClassForState = ko.computed(function () {
                if (_this.Complete()) {
                    return "complete";
                }
                if (_this.Blocked()) {
                    return "blocked";
                }
                if (_this.QSReadyOrInProgress()) {
                    return "qsReadyOrInProgress";
                }
                if (_this.DevInProgress()) {
                    return "devInProgress";
                }
                return "readyForDev";
            });
            this.Collapsed = ko.computed(function () {
                if (_this.CollapsedOverride() === null) {
                    return _this.Complete();
                }
                return _this.CollapsedOverride();
            });
            this.SearchableStoryText = ko.computed(function () {
                return _this.StoryText().toLowerCase();
            });
            this.CollapsedOverride(JSON.parse(localStorage.getItem("collapsed" + this.StoryId)));
            this.StoryText.subscribe(this.UpdateStory);
            this.StoryPoints.subscribe(this.UpdateStory);
        }
        Story.prototype.AddTask = function (loggedBy) {
            var _this = this;
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/AddTask',
                data: {
                    LoggedBy: loggedBy,
                    StoryId: this.StoryId
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to add task: " + errorThrown);
                },
                success: function (data) {
                    var task = new ScrumThing.RawTask(data.TaskId, data.Ordinal);
                    _this.Tasks.push(new ScrumThing.Task(task));
                }
            });
        };
        Story.prototype.RemoveTask = function (task) {
            var _this = this;
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/RemoveTask',
                data: {
                    TaskId: task.TaskId
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error("Failed to add task: " + errorThrown);
                },
                success: function (newTaskOrdinals) {
                    _this.Tasks.remove(task);
                    _.each(newTaskOrdinals, function (newTaskOrdinal) {
                        var taskToSetNewOrdinal = _.find(_this.Tasks(), function (candidate) { return candidate.TaskId == newTaskOrdinal.TaskId; });
                        taskToSetNewOrdinal.Ordinal(newTaskOrdinal.Ordinal);
                    });
                }
            });
        };
        Story.prototype.MatchesSearchTerms = function (searchTerms) {
            var _this = this;
            return _.all(searchTerms, function (term) { return _this.StoryTextMatches(term) ||
                _this.AnyAssignmentMatches(term) ||
                _this.AnyTaskTextMatches(term) ||
                _this.AnyStoryTagMatches(term); });
        };
        Story.prototype.StoryTextMatches = function (term) {
            return this.SearchableStoryText().indexOf(term) != -1;
        };
        Story.prototype.AnyAssignmentMatches = function (term) {
            return _.any(this.Tasks(), function (task) {
                return _.any(task.Assignments(), function (assignment) { return assignment.UserName.toLowerCase().indexOf(term) != -1; });
            });
        };
        Story.prototype.AnyTaskTextMatches = function (term) {
            return _.any(this.Tasks(), function (task) { return task.SearchableTaskText().indexOf(term) != -1; });
        };
        Story.prototype.AnyStoryTagMatches = function (term) {
            return _.any(this.StoryTags(), function (storyTag) { return storyTag.StoryTagDescription.toLowerCase().indexOf(term) != -1; });
        };
        return Story;
    })();
    ScrumThing.Story = Story;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=Story.js.map