var ScrumThing;
(function (ScrumThing) {
    var Task = (function () {
        function Task(raw) {
            var _this = this;
            this.Ordinal = ko.observable();
            this.TaskText = ko.observable();
            this.State = ko.observable();
            this.EstimatedDevHours = ScrumThing.observableNumber();
            this.EstimatedQsHours = ScrumThing.observableNumber();
            this.DevHoursBurned = ScrumThing.observableNumber();
            this.QsHoursBurned = ScrumThing.observableNumber();
            this.RemainingDevHours = ScrumThing.observableNumber();
            this.RemainingQsHours = ScrumThing.observableNumber();
            this.Assignments = ko.observableArray();
            this.TaskTags = ko.observableArray();
            this.Notes = ko.observableArray();
            this.AssignmentsForDropdown = ko.pureComputed({
                read: function () {
                    return _.map(_this.Assignments(), function (assignment) {
                        return assignment.UserName;
                    });
                },
                write: function (newAssignments) {
                    jQuery.ajax({
                        type: 'POST',
                        url: '/ViewSprint/SetAssignments',
                        data: {
                            TaskId: _this.TaskId,
                            Assignments: newAssignments.join('|')
                        },
                        success: function () {
                            _this.Assignments(_.map(newAssignments, function (userName) {
                                return {
                                    TaskId: _this.TaskId,
                                    UserName: userName
                                };
                            }));
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            toastr.error("Failed to set assignments: " + errorThrown);
                        }
                    });
                }
            }, this);
            this.UpdateTask = function () {
                jQuery.ajax({
                    type: 'POST',
                    url: '/PlanSprint/UpdateTask',
                    data: {
                        LoggedBy: ScrumThing.Globals.CurrentUserIdentity,
                        TaskId: _this.TaskId,
                        TaskText: _this.TaskText(),
                        State: _this.State,
                        EstimatedDevHours: _this.EstimatedDevHours,
                        EstimatedQsHours: _this.EstimatedQsHours,
                        DevHoursBurned: _this.DevHoursBurned,
                        QsHoursBurned: _this.QsHoursBurned,
                        RemainingDevHours: _this.RemainingDevHours,
                        RemainingQsHours: _this.RemainingQsHours,
                        TaskTags: _this.TaskTags().join('|')
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        toastr.error("Failed to update task: " + errorThrown);
                    }
                });
            };
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
            this.TaskTags(_.map(raw.TaskTags, function (tag) {
                return tag.TaskTagId;
            }));
            this.Notes(_.map(raw.Notes, function (raw) {
                return new ScrumThing.Note(raw);
            }));
            this.TaskText.subscribe(this.UpdateTask);
            this.State.subscribe(this.UpdateTask);
            this.EstimatedDevHours.subscribe(this.UpdateTask);
            this.EstimatedQsHours.subscribe(this.UpdateTask);
            this.DevHoursBurned.subscribe(this.UpdateTask);
            this.QsHoursBurned.subscribe(this.UpdateTask);
            this.RemainingDevHours.subscribe(this.UpdateTask);
            this.RemainingQsHours.subscribe(this.UpdateTask);
        }
        Task.prototype.HasTaskTag = function (taskTagId) {
            return _.contains(this.TaskTags(), taskTagId);
        };

        Task.prototype.ToggleTaskTag = function (taskTagId) {
            var _this = this;
            return function () {
                if (_this.HasTaskTag(taskTagId)) {
                    _this.TaskTags.remove(taskTagId);
                } else {
                    _this.TaskTags.push(taskTagId);
                }

                _this.UpdateTask();
                return true;
            };
        };
        return Task;
    })();
    ScrumThing.Task = Task;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=Task.js.map
