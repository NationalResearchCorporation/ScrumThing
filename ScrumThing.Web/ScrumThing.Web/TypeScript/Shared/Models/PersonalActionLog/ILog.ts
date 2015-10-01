/// <reference path="itimeperiod.ts" />

module ScrumThing.Models.PersonalActionLog {
    export interface ILog {
        TimePeriods: Array<PersonalActionLog.ITimeperiod>;
        HasTimePeriods: () => Boolean;
    }
}