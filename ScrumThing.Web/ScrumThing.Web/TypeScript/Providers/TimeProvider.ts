module ScrumThing.Providers {
    export class TimeProvider implements ITimeProvider{
        GetCurrentTime = () => new Date();
    }
}