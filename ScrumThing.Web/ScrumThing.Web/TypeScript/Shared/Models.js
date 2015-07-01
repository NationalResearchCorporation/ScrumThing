var ScrumThing;
(function (ScrumThing) {
    var RawResource = (function () {
        function RawResource() {
        }
        return RawResource;
    })();
    ScrumThing.RawResource = RawResource;

    var Resource = (function () {
        function Resource(userName, devPercentage, qsPercentage, days) {
            var _this = this;
            this.UserName = ko.observable();
            this.DevPercentage = ko.observable();
            this.QsPercentage = ko.observable();
            this.Days = ko.observable();
            this.TotalDevHours = ko.computed(function () {
                return Math.round(_this.DevPercentage() / 100.0 * _this.Days() * 4);
            });
            this.TotalQsHours = ko.computed(function () {
                return Math.round(_this.QsPercentage() / 100.0 * _this.Days() * 4);
            });
            this.TotalHours = ko.computed(function () {
                return Math.round((_this.TotalDevHours() + _this.TotalQsHours()));
            });
            this.UserName(userName);
            this.DevPercentage(devPercentage);
            this.QsPercentage(qsPercentage);
            this.Days(days);
        }
        Resource.prototype.ToRaw = function () {
            var raw = new RawResource();
            raw.UserName = this.UserName();
            raw.DevPercentage = this.DevPercentage();
            raw.QsPercentage = this.QsPercentage();
            raw.Days = this.Days();
            raw.TotalDevHours = this.TotalDevHours();
            raw.TotalQsHours = this.TotalQsHours();
            raw.TotalHours = this.TotalHours();
            return raw;
        };
        return Resource;
    })();
    ScrumThing.Resource = Resource;

    var Sprint = (function () {
        function Sprint() {
        }
        return Sprint;
    })();
    ScrumThing.Sprint = Sprint;

    var RawStory = (function () {
        function RawStory() {
        }
        return RawStory;
    })();
    ScrumThing.RawStory = RawStory;

    var Story = (function () {
        function Story(storyId, storyText, storyPoints, ordinal, isReachGoal, tags) {
            var _this = this;
            this.Ordinal = ko.observable();
            this.StoryText = ko.observable();
            this.StoryPoints = ScrumThing.observableNumber();
            this.Tasks = ko.observableArray();
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
                        jQuery.jGrowl("Failed to update story: " + errorThrown);
                    }
                });
            };
            this.StoryId = storyId;
            this.HtmlId = 'story' + storyId;
            this.Ordinal(ordinal);
            this.StoryText(storyText);
            this.StoryPoints(storyPoints);
            this.IsReachGoal(isReachGoal);
            this.Tags = tags;

            this.ReachToggleText = ko.computed(function () {
                return _this.IsReachGoal() ? 'Make this a commitment.' : 'Make this a reach goal.';
            });

            this.TotalDevHours = ko.computed(function () {
                return ScrumThing.sum(_.map(_this.Tasks(), function (task) {
                    return task.EstimatedDevHours();
                }));
            });

            this.TotalQsHours = ko.computed(function () {
                return ScrumThing.sum(_.map(_this.Tasks(), function (task) {
                    return task.EstimatedQsHours();
                }));
            });

            this.Complete = ko.computed(function () {
                return _.all(_this.Tasks(), function (task) {
                    return task.State() == "Complete";
                });
            });

            this.Blocked = ko.computed(function () {
                return _.any(_this.Tasks(), function (task) {
                    return task.State() == "Blocked";
                });
            });

            this.Progressing = ko.computed(function () {
                return !(_this.Complete() || _this.Blocked());
            });

            this.Collapsed = ko.computed(function () {
                if (_this.CollapsedOverride() === null) {
                    return _this.Complete();
                }
                return _this.CollapsedOverride();
            });

            this.CollapsedOverride(JSON.parse(localStorage.getItem("collapsed" + this.StoryId)));

            this.StoryText.subscribe(this.UpdateStory);
            this.StoryPoints.subscribe(this.UpdateStory);
            this.IsReachGoal.subscribe(this.UpdateStory);
        }
        Story.prototype.ToggleReachGoal = function () {
            if (this.IsReachGoal()) {
                this.IsReachGoal(false);
                jQuery.jGrowl('Story ' + this.Ordinal() + ' is now a commitment, and has been moved above the reach line.');
            } else {
                this.IsReachGoal(true);
                jQuery.jGrowl('Story ' + this.Ordinal() + ' is now a reach goal, and has been moved below the reach line.');
            }
        };

        Story.prototype.AddTask = function () {
            var _this = this;
            jQuery.ajax({
                type: 'POST',
                url: '/PlanSprint/AddTask',
                data: {
                    StoryId: this.StoryId
                },
                error: function (xhr, textStatus, errorThrown) {
                    jQuery.jGrowl("Failed to add task: " + errorThrown);
                },
                success: function (data) {
                    var task = new RawTask(data.TaskId, data.Ordinal, _this.GetNewTags());
                    _this.Tasks.push(new Task(task));
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
                    jQuery.jGrowl("Failed to add task: " + errorThrown);
                },
                success: function (taskId) {
                    _this.Tasks.remove(task);
                }
            });
        };

        Story.prototype.GetNewTags = function () {
            var tags = new Array();
            for (var ii = 0; ii < this.Tags.length; ii++) {
                tags.push(this.Tags[ii].ToRaw());
            }
            return tags;
        };

        Story.prototype.ToRaw = function () {
            var raw = new RawStory();
            raw.StoryText = this.StoryText();
            raw.StoryPoints = this.StoryPoints();
            raw.Ordinal = this.Ordinal();
            raw.IsReachGoal = this.IsReachGoal();
            raw.Tasks = _.map(this.Tasks(), function (task) {
                return task.ToRaw();
            });
            return raw;
        };
        return Story;
    })();
    ScrumThing.Story = Story;

    var RawTask = (function () {
        function RawTask(taskId, ordinal, tags) {
            this.TaskId = -1;
            this.TaskText = '';
            this.Ordinal = 1;
            this.State = 'ReadyForDev';
            this.EstimatedDevHours = 0;
            this.EstimatedQsHours = 0;
            this.DevHoursBurned = 0;
            this.QsHoursBurned = 0;
            this.RemainingDevHours = 0;
            this.RemainingQsHours = 0;
            this.TaskId = taskId;
            this.Ordinal = ordinal;
            this.Tags = tags;
        }
        return RawTask;
    })();
    ScrumThing.RawTask = RawTask;

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
            this.Notes = ko.observableArray();
            this.Tags = ko.observableArray();
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
                            jQuery.jGrowl("Failed to set assignments: " + errorThrown);
                        }
                    });
                }
            }, this);
            this.UpdateTask = function () {
                jQuery.ajax({
                    type: 'POST',
                    url: '/PlanSprint/UpdateTask',
                    data: {
                        TaskId: _this.TaskId,
                        TaskText: _this.TaskText(),
                        State: _this.State,
                        EstimatedDevHours: _this.EstimatedDevHours,
                        EstimatedQsHours: _this.EstimatedQsHours,
                        DevHoursBurned: _this.DevHoursBurned,
                        QsHoursBurned: _this.QsHoursBurned,
                        RemainingDevHours: _this.RemainingDevHours,
                        RemainingQsHours: _this.RemainingQsHours,
                        Tags: _.map(_.filter(_this.Tags(), function (tag) {
                            return tag.IsIncluded;
                        }), function (tag) {
                            return tag.TagId;
                        }).join('|')
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        jQuery.jGrowl("Failed to update task: " + errorThrown);
                    }
                });
                return true;
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
            this.Notes(raw.Notes);
            this.Tags(raw.Tags);
            this.TaskText.subscribe(this.UpdateTask);
            this.State.subscribe(this.UpdateTask);
            this.EstimatedDevHours.subscribe(this.UpdateTask);
            this.EstimatedQsHours.subscribe(this.UpdateTask);
            this.DevHoursBurned.subscribe(this.UpdateTask);
            this.QsHoursBurned.subscribe(this.UpdateTask);
            this.RemainingDevHours.subscribe(this.UpdateTask);
            this.RemainingQsHours.subscribe(this.UpdateTask);
        }
        Task.prototype.ToRaw = function () {
            var raw = new RawTask(this.TaskId, this.Ordinal(), this.Tags());
            raw.TaskText = this.TaskText();
            raw.EstimatedDevHours = this.EstimatedDevHours();
            raw.EstimatedQsHours = this.EstimatedQsHours();
            raw.DevHoursBurned = this.DevHoursBurned();
            raw.QsHoursBurned = this.QsHoursBurned();
            raw.RemainingDevHours = this.RemainingDevHours();
            raw.RemainingQsHours = this.RemainingQsHours();
            return raw;
        };
        return Task;
    })();
    ScrumThing.Task = Task;

    var RawAssignment = (function () {
        function RawAssignment() {
        }
        return RawAssignment;
    })();
    ScrumThing.RawAssignment = RawAssignment;

    var RawNote = (function () {
        function RawNote() {
        }
        return RawNote;
    })();
    ScrumThing.RawNote = RawNote;

    var RawTeam = (function () {
        function RawTeam() {
        }
        return RawTeam;
    })();
    ScrumThing.RawTeam = RawTeam;

    var RawTag = (function () {
        function RawTag(tagId, tagDescription, tagClasses) {
            this.IsIncluded = false;
            this.TagId = tagId;
            this.TagClasses = tagClasses;
            this.TagDescription = tagDescription;
        }
        RawTag.prototype.ToRaw = function () {
            return new RawTag(this.TagId, this.TagDescription, this.TagClasses);
        };
        return RawTag;
    })();
    ScrumThing.RawTag = RawTag;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=Models.js.map
