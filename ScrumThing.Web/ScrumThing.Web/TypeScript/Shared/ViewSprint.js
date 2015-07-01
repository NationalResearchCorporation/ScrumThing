/// <reference path='../../Scripts/typings/underscore/underscore.d.ts' />
/// <reference path='../Shared/Utility.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
jQuery(function () {
    var viewModel = new Scrum.ViewSprintViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));

    window.viewModel = viewModel;
});

var Scrum;
(function (Scrum) {
    var ViewSprintViewModel = (function (_super) {
        __extends(ViewSprintViewModel, _super);
        function ViewSprintViewModel() {
            _super.call(this);
            this.currentTask = ko.observable(null);
            this.newNote = ko.observable();
            this.states = [
                'Blocked',
                'ReadyForDev',
                'DevInProgress',
                'ReadyForQs',
                'QsInProgress',
                'Complete'
            ];

            // TODO: Move this to a custom binding
            this.currentTask.subscribe(function () {
                jQuery("#taskDetails").modal();
            });
        }
        ViewSprintViewModel.prototype.GetStoryTasksInState = function (story, state) {
            return ko.computed(function () {
                return _.sortBy(_.filter(story.Tasks(), function (task) {
                    return task.State() == state;
                }), function (task) {
                    return task.Ordinal();
                });
            });
        };

        ViewSprintViewModel.prototype.Drag = function (event) {
            event.dataTransfer.setData('text', event.target.id);
        };

        ViewSprintViewModel.prototype.AllowDrop = function (event) {
            event.preventDefault();
        };

        ViewSprintViewModel.prototype.DropTask = function (event, state) {
            var htmlId = event.dataTransfer.getData('text');
            var task = _.find(this.tasks(), function (t) {
                return t.HtmlId == htmlId;
            });
            jQuery.ajax({
                type: 'POST',
                url: '/ViewSprint/SetTaskState',
                data: {
                    TaskId: task.TaskId,
                    State: state
                },
                success: function () {
                    task.State(state);
                },
                error: function (xhr, textStatus, errorThrown) {
                    jQuery.jGrowl("Failed to update task's state: " + errorThrown);
                }
            });
        };

        ViewSprintViewModel.prototype.SetTask = function (task) {
            var _this = this;
            return function () {
                _this.currentTask(task);
            };
        };

        ViewSprintViewModel.prototype.SaveWork = function (task) {
            return function () {
                jQuery.ajax({
                    type: 'POST',
                    url: '/ViewSprint/LogWork',
                    data: task.ToRaw(),
                    error: function (xhr, textStatus, errorThrown) {
                        jQuery.jGrowl("Failed to update hours burned: " + errorThrown);
                    }
                });
            };
        };

        ViewSprintViewModel.prototype.OnDropTask = function (state) {
            return "viewModel.DropTask(event, '" + state.State + "')";
        };

        ViewSprintViewModel.prototype.ClassForTask = function (task) {
            var _this = this;
            return ko.computed(function () {
                if (_this.currentTask() != null && task.TaskId == _this.currentTask().TaskId) {
                    return "active";
                }

                if (task.State() == "Blocked") {
                    return "list-group-item-danger";
                }

                return "";
            });
        };

        ViewSprintViewModel.prototype.ClassForAssignment = function (task, username) {
            var assigned = _.any(task.Assignments(), function (assignment) {
                return assignment.UserName == username;
            });
            if (assigned) {
                return "btn-primary";
            }
            return "btn-default";
        };

        ViewSprintViewModel.prototype.ToggleAssignment = function (task, username) {
            return function () {
                var assigned = _.any(task.Assignments(), function (assignment) {
                    return assignment.UserName == username;
                });
                var assignment = { TaskId: task.TaskId, UserName: username };
                if (assigned) {
                    jQuery.ajax({
                        type: 'POST',
                        url: '/ViewSprint/RemoveAssignment',
                        data: assignment,
                        success: function () {
                            var filtered = _.filter(task.Assignments(), function (assignment) {
                                return assignment.UserName != username;
                            });
                            task.Assignments(filtered);
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            jQuery.jGrowl("Failed to remove assignment: " + errorThrown);
                        }
                    });
                } else {
                    jQuery.ajax({
                        type: 'POST',
                        url: '/ViewSprint/AddAssignment',
                        data: {
                            UserName: username,
                            TaskId: task.TaskId
                        },
                        success: function () {
                            task.Assignments.push(assignment);
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            jQuery.jGrowl("Failed to add assignment: " + errorThrown);
                        }
                    });
                }
            };
        };

        ViewSprintViewModel.prototype.AddNote = function () {
            var _this = this;
            jQuery.ajax({
                type: 'POST',
                url: '/ViewSprint/AddNote',
                data: {
                    TaskId: this.currentTask().TaskId,
                    Note: this.newNote()
                },
                success: function (data) {
                    _this.newNote('');
                    _this.currentTask().Notes.unshift(data);
                },
                error: function (xhr, textStatus, errorThrown) {
                    jQuery.jGrowl("Failed to add note: " + errorThrown);
                }
            });
        };

        ViewSprintViewModel.prototype.SetCollapsed = function (story, collapsed) {
            return function () {
                localStorage.setItem('collapsed' + story.StoryId, JSON.stringify(collapsed));
                story.CollapsedOverride(collapsed);
            };
        };

        ViewSprintViewModel.prototype.ClearCollapsed = function () {
            localStorage.clear();
            _.forEach(this.stories(), function (story) {
                story.CollapsedOverride(null);
            });
        };
        return ViewSprintViewModel;
    })(Scrum.BaseSprintViewModel);
    Scrum.ViewSprintViewModel = ViewSprintViewModel;
})(Scrum || (Scrum = {}));
//# sourceMappingURL=ViewSprint.js.map
