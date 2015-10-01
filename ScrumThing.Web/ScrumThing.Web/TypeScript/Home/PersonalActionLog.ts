module ScrumThing.ViewModels {
    export class PersonalActionLog extends ScrumThing.BaseViewModel {

        FromDateTime: KnockoutObservable<Date> = ko.observable<Date>(new Date());

        ToDateTime: KnockoutObservable<Date> = ko.observable<Date>(new Date());

        DateSelectionIsInvalid: KnockoutComputed<Boolean> = ko.computed((): Boolean => {
            return this.ToDateTime().getTime() < this.FromDateTime().getTime();
        });

        TimeScales: string[] = [
            'sprint',
            'week',
            'day',
            'hour',
            'minute',
            'none'
        ];

        CurrentTimeScale: KnockoutObservable<string> = ko.observable('day');

        Log: KnockoutObservable<ScrumThing.Models.PersonalActionLog.ILog> = ko.observable(new ScrumThing.Models.PersonalActionLog.Log([]));

        CurrentlyRefreshingData: KnockoutObservable<Boolean> = ko.observable<boolean>(false);

        constructor(timeProvider: ScrumThing.Providers.ITimeProvider, palProvider: ScrumThing.Providers.IPersonalActionLogProvider, teamProvider: ScrumThing.Providers.TeamProvider) {
            super(teamProvider);

            this.RefreshData = () => {
                this.CurrentlyRefreshingData(true);
                palProvider
                    .GetPersonalActionLog(this.FromDateTime(), this.ToDateTime(), this.CurrentTimeScale())
                    .done((tasks) => {
                        this.Log(new ScrumThing.Models.PersonalActionLog.Log(tasks));
                        this.CurrentlyRefreshingData(false);
                    });
            }

            var currentTime = new Date(timeProvider.GetCurrentTime().getTime());
            var todayAtNineThirty = new Date(timeProvider.GetCurrentTime().setHours(9, 30));
            if (currentTime.getTime() > todayAtNineThirty.getTime()) {
                this.FromDateTime(todayAtNineThirty);
            }
            else {
                var yesterdayAtNineThirty = new Date(todayAtNineThirty.setDate(todayAtNineThirty.getDate() - 1));
                this.FromDateTime(yesterdayAtNineThirty);
            }
            this.ToDateTime(timeProvider.GetCurrentTime());

            ko.computed(() => {
                this.RefreshData();
            });
        }
    }
}