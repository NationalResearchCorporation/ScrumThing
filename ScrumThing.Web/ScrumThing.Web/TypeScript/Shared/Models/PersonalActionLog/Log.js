/// <reference path="itimeperiod.ts" />
/// <reference path="../../../../scripts/typings/underscore/underscore.d.ts" />
/// <reference path="timeperiod.ts" />
var ScrumThing;
(function (ScrumThing) {
    var Models;
    (function (Models) {
        var PersonalActionLog;
        (function (PersonalActionLog) {
            var Log = (function () {
                function Log(tasks) {
                    var _this = this;
                    this.TimePeriods = [];
                    this.HasTimePeriods = function () { return _this.TimePeriods.length > 0; };
                    this.TimePeriods = this.mapTasksToTimeperiods(tasks);
                }
                Log.prototype.mapTasksToTimeperiods = function (tasks) {
                    var result = _.sortBy(_.map(_.groupBy(tasks, function (task) {
                        return task.MinTimeperiodValue;
                    }), function (tasksForAGivenTimeperiod) {
                        return _.reduce(tasksForAGivenTimeperiod, function (timePeriod, timeperiodTask) {
                            timePeriod.MinTimeperiodValue = timeperiodTask.MinTimeperiodValue;
                            timePeriod.MaxTimeperiodValue = timeperiodTask.MaxTimeperiodValue;
                            timePeriod.Tasks.push(timeperiodTask);
                            return timePeriod;
                        }, new PersonalActionLog.Timeperiod());
                    }), function (timePeriod) {
                        return timePeriod.MinTimeperiodValue;
                    })
                        .reverse();
                    return result;
                };
                return Log;
            })();
            PersonalActionLog.Log = Log;
        })(PersonalActionLog = Models.PersonalActionLog || (Models.PersonalActionLog = {}));
    })(Models = ScrumThing.Models || (ScrumThing.Models = {}));
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=Log.js.map