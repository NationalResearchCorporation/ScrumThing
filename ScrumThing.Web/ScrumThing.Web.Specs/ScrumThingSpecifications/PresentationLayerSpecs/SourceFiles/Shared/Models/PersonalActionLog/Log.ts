/// <reference path="itimeperiod.ts" />
/// <reference path="../../../../scripts/typings/underscore/underscore.d.ts" />
/// <reference path="timeperiod.ts" />

module ScrumThing.Models.PersonalActionLog {
    export class Log implements ScrumThing.Models.PersonalActionLog.ILog {
        TimePeriods: Array<PersonalActionLog.ITimeperiod> = [];
        HasTimePeriods = () => this.TimePeriods.length > 0;

        constructor(tasks: Array<ScrumThing.Models.PersonalActionLog.ITask>) {
            this.TimePeriods = this.mapTasksToTimeperiods(tasks);
        }

        private mapTasksToTimeperiods(tasks: Array<ITask>): Array<ITimeperiod> {
            var result =
                _.sortBy(
                    _.map(
                        _.groupBy(tasks, (task) => {
                            return task.MinTimeperiodValue;
                        }),
                        (tasksForAGivenTimeperiod) => {
                            return _.reduce(tasksForAGivenTimeperiod,
                                (timePeriod: ITimeperiod, timeperiodTask: ScrumThing.Models.PersonalActionLog.ITask) => {
                                    timePeriod.MinTimeperiodValue = timeperiodTask.MinTimeperiodValue;
                                    timePeriod.MaxTimeperiodValue = timeperiodTask.MaxTimeperiodValue;
                                    timePeriod.Tasks.push(timeperiodTask);
                                    return timePeriod;
                                },
                                new Timeperiod()
                                );
                        })
                    , (timePeriod) => {
                        return timePeriod.MinTimeperiodValue;
                    })
                .reverse();
            return result;
        }
    }
}