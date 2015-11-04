
jQuery(() => {
    var managementViewModel: ScrumThing.ViewModels.Management = new ScrumThing.ViewModels.Management();
    ko.applyBindings(managementViewModel);
    (<any>window).managementViewModel = managementViewModel;
});
