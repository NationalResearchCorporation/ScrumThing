module ScrumThing.Providers {
    export interface ITimeProvider {
        GetCurrentTime:() => Date;
    }
}