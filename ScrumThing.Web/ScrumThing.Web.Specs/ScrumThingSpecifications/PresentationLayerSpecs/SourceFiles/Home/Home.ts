/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../../Scripts/typings/highcharts/highcharts.d.ts" />
/// <reference path="../Shared/Utility.ts" />

jQuery(function () {
    var viewModel: ScrumThing.HomeViewModel = new ScrumThing.HomeViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));
});

module ScrumThing {
    export class HomeViewModel extends BaseSprintViewModel {
        constructor() {
            super();
        }
    }
}
