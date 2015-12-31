/// <reference path="taskordinal.ts" />
var ScrumThing;
(function (ScrumThing) {
    var Story = (function () {
        function Story(storyId, title, storyText, notes, storyPoints, ordinal, isReachGoal, storyTags) {
            var _this = this;
            this.Ordinal = ko.observable();
            this.Title = ko.observable();
            this.StoryText = ko.observable();
            this.Notes = ko.observable();
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
                        Title: _this.Title(),
                        StoryText: _this.StoryText(),
                        Notes: _this.Notes(),
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
            this.Title(title);
            this.StoryText(storyText);
            this.Notes(notes);
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
            this.ReadyForQS = ko.computed(function () {
                return _.any(_this.Tasks(), function (task) { return task.State() == "ReadyForQs"; });
            });
            this.QSInProgress = ko.computed(function () {
                return _.any(_this.Tasks(), function (task) { return task.State() == "QsInProgress"; });
            });
            this.ReadyForDev = ko.computed(function () {
                return _.any(_this.Tasks(), function (task) { return task.State() == "ReadyForDev"; });
            });
            this.DevInProgress = ko.computed(function () {
                return _.any(_this.Tasks(), function (task) { return task.State() == "DevInProgress"; });
            });
            this.RemainingDevHours = ko.computed(function () {
                var result = 0;
                _.each(_this.Tasks(), function (task) { result += task.RemainingDevHours(); });
                return result;
            });
            this.RemainingQsHours = ko.computed(function () {
                var result = 0;
                _.each(_this.Tasks(), function (task) { result += task.RemainingQsHours(); });
                return result;
            });
            this.CssClassForState = ko.computed(function () {
                var states = [];
                if (_this.Blocked()) {
                    states.push("blocked");
                }
                else if (_this.ReadyForDev() || _this.DevInProgress() || _this.ReadyForQS() || _this.QSInProgress()) {
                    if (_this.ReadyForDev()) {
                        states.push("readyForDev");
                    }
                    if (_this.DevInProgress()) {
                        states.push("devInProgress");
                    }
                    if (_this.ReadyForQS()) {
                        states.push("readyForQS");
                    }
                    if (_this.QSInProgress()) {
                        states.push("qsInProgress");
                    }
                }
                else if (_this.Complete()) {
                    states.push("complete");
                }
                return states;
            });
            this.Collapsed = ko.computed(function () {
                if (_this.CollapsedOverride() === null) {
                    return _this.Complete();
                }
                return _this.CollapsedOverride();
            });
            this.SearchableStoryText = ko.computed(function () {
                var title = _this.Title() ? _this.Title() : '';
                var storyText = _this.StoryText() ? _this.StoryText() : '';
                var notes = _this.Notes() ? _this.Notes() : '';
                return title.toLowerCase() + ' ' + storyText.toLowerCase() + ' ' + notes.toLowerCase();
            });
            this.CollapsedOverride(JSON.parse(localStorage.getItem("collapsed" + this.StoryId)));
            this.Title.subscribe(this.UpdateStory);
            this.StoryText.subscribe(this.UpdateStory);
            this.Notes.subscribe(this.UpdateStory);
            this.StoryPoints.subscribe(this.UpdateStory);
            this.IsCarryOverEligible = ko.computed(function () {
                return !_this.Complete() &&
                    (_this.RemainingDevHours() > 0 || _this.RemainingQsHours() > 0);
            });
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
                _this.AnyStoryTagMatches(term) ||
                _this.StoryOrdinalMatches(term); });
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
        Story.prototype.StoryOrdinalMatches = function (term) {
            return this.Ordinal().toString().indexOf(term) != -1;
        };
        return Story;
    })();
    ScrumThing.Story = Story;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=Story.js.map