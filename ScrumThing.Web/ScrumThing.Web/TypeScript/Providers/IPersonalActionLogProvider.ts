module ScrumThing.Providers {
    export interface IPersonalActionLogProvider {
        GetPersonalActionLog: (fromTime : Date, toTime : Date, timeScale : string) => JQueryPromise<Array<ScrumThing.Models.PersonalActionLog.ITask>>;
    };
}