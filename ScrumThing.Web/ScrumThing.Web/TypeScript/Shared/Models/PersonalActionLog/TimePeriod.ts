/// <reference path="itask.ts" />

module ScrumThing.Models.PersonalActionLog {
    export class Timeperiod implements ITimeperiod {
        MinTimeperiodValue: Date = new Date();
        MaxTimeperiodValue: Date = new Date();
        Tasks: Array<PersonalActionLog.ITask> = [];
    }
} 