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
        function Story(storyId, storyText, storyPoints, ordinal, isReachGoal, storyTags, taskTags) {
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
                        jQuery.jGrowl("Failed to update story: " + errorThrown);
                    }
                });
            };
            this.StoryId = storyId;
            this.HtmlId = 'story' + storyId;
            this.Ordinal(ordinal);
            this.StoryText(storyText);
            this.StoryPoints(storyPoints);
            this.StoryTags(storyTags);
            this.IsReachGoal(isReachGoal);
            this.TaskTags = taskTags;

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

            this.StoryTagsForDropdown = ko.computed({
                read: function () {
                    return _this.StoryTags();
                },
                write: function (newStoryTagIds) {
                    jQuery.ajax({
                        type: 'POST',
                        url: '/PlanSprint/SetStoryTags',
                        data: {
                            StoryId: _this.StoryId,
                            StoryTagIds: newStoryTagIds.join('|')
                        },
                        success: function () {
                            _this.StoryTags(newStoryTagIds);
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            jQuery.jGrowl("Failed to set story tags: " + errorThrown);
                        }
                    });
                }
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
        }
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
                    var task = new RawTask(data.TaskId, data.Ordinal, _this.GetNewTaskTags());
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
                success: function (newOrdinals) {
                    _this.Tasks.remove(task);

                    _.each(_this.Tasks(), function (task) {
                        var newOrdinal = _.find(newOrdinals, function (item) {
                            return item.TaskId == task.TaskId;
                        });
                        task.Ordinal(newOrdinal.Ordinal);
                    });
                }
            });
        };

        Story.prototype.GetNewTaskTags = function () {
            var tags = new Array();
            for (var ii = 0; ii < this.TaskTags.length; ii++) {
                tags.push(this.TaskTags[ii]);
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
        function RawTask(taskId, ordinal, taskTags) {
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
            this.TaskTags = taskTags;
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
            this.TaskTags = ko.observableArray();
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
                        TaskTags: _.map(_.filter(_this.TaskTags(), function (tag) {
                            return tag.IsIncluded;
                        }), function (tag) {
                            return tag.TaskTagId;
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
            this.TaskTags(raw.TaskTags);
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
            var raw = new RawTask(this.TaskId, this.Ordinal(), this.TaskTags());
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

    var RawStoryTag = (function () {
        function RawStoryTag(storyTagId, storyTagDescription) {
            this.StoryTagId = storyTagId;
            this.StoryTagDescription = storyTagDescription;
        }
        return RawStoryTag;
    })();
    ScrumThing.RawStoryTag = RawStoryTag;

    var RawTaskTag = (function () {
        function RawTaskTag(tagId, tagDescription, tagClasses) {
            this.IsIncluded = false;
            this.TaskTagId = tagId;
            this.TaskTagClasses = tagClasses;
            this.TaskTagDescription = tagDescription;
        }
        return RawTaskTag;
    })();
    ScrumThing.RawTaskTag = RawTaskTag;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=Models.js.map
