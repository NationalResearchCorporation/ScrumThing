/// <reference path='../../Scripts/typings/underscore/underscore.d.ts' />
/// <reference path='../Shared/Utility.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
jQuery(function () {
    var viewModel = new ScrumThing.ViewSprintViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));

    window.viewModel = viewModel;
});

var ScrumThing;
(function (ScrumThing) {
    var ViewSprintViewModel = (function (_super) {
        __extends(ViewSprintViewModel, _super);
        function ViewSprintViewModel() {
            var _this = this;
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

            // If the user goes idle for more than 60 seconds
            jQuery(document).idleTimer(60 * 1000);

            // Then when they return, reload all the sprint info
            jQuery(document).on("active.idleTimer", function () {
                _this.GetSprintInfo();
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
            task.State(state);
        };

        ViewSprintViewModel.prototype.SetTask = function (task) {
            var _this = this;
            return function () {
                _this.currentTask(task);
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

        ViewSprintViewModel.prototype.MakeSetCollapsedHandler = function (story, collapsed) {
            var _this = this;
            return function () {
                _this.SetCollapsed(story, collapsed);
            };
        };

        ViewSprintViewModel.prototype.SetCollapsed = function (story, collapsed) {
            localStorage.setItem('collapsed' + story.StoryId, JSON.stringify(collapsed));
            story.CollapsedOverride(collapsed);
        };

        ViewSprintViewModel.prototype.ExpandAll = function () {
            var _this = this;
            _.forEach(this.stories(), function (story) {
                _this.SetCollapsed(story, false);
            });
        };

        ViewSprintViewModel.prototype.CollapseAll = function () {
            var _this = this;
            _.forEach(this.stories(), function (story) {
                _this.SetCollapsed(story, true);
            });
        };

        ViewSprintViewModel.prototype.SmartCollapse = function () {
            Object.keys(localStorage).forEach(function (key) {
                if (/^collapsed/.test(key)) {
                    localStorage.removeItem(key);
                }
            });
            _.forEach(this.stories(), function (story) {
                story.CollapsedOverride(null);
            });
        };
        return ViewSprintViewModel;
    })(ScrumThing.BaseSprintViewModel);
    ScrumThing.ViewSprintViewModel = ViewSprintViewModel;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=ViewSprint.js.map
