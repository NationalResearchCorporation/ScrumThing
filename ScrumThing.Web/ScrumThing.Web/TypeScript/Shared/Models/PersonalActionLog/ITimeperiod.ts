/// <reference path="itask.ts" />

module ScrumThing.Models.PersonalActionLog {
    export interface ITimeperiod {
        MinTimeperiodValue: Date;
        MaxTimeperiodValue: Date;
        Tasks: Array<PersonalActionLog.ITask>;
    }
}