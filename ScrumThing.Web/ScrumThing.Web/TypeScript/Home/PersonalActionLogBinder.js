jQuery(function () {
    var timeProvider = new ScrumThing.Providers.TimeProvider();
    var personalActionLogProvider = new ScrumThing.Providers.PersonalActionLogProvider(ScrumThing.Globals.CurrentUserIdentity);
    var teamProvider = new ScrumThing.Providers.TeamProvider();
    var personalActionLogViewModel = new ScrumThing.ViewModels.PersonalActionLog(timeProvider, personalActionLogProvider, teamProvider);
    ko.applyBindings(personalActionLogViewModel);
    window.personalActionLogViewModel = personalActionLogViewModel;
});
//# sourceMappingURL=PersonalActionLogBinder.js.map