jQuery(() => {
    var timeProvider = new ScrumThing.Providers.TimeProvider();
    var personalActionLogProvider = new ScrumThing.Providers.PersonalActionLogProvider(ScrumThing.Globals.CurrentUserIdentity);
    var teamProvider = new ScrumThing.Providers.TeamProvider();
    var personalActionLogViewModel: ScrumThing.ViewModels.PersonalActionLog =
        new ScrumThing.ViewModels.PersonalActionLog(timeProvider, personalActionLogProvider, teamProvider);
    ko.applyBindings(personalActionLogViewModel);
    (<any>window).personalActionLogViewModel = personalActionLogViewModel;
});