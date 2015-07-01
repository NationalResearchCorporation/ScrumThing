/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../../Scripts/typings/highcharts/highcharts.d.ts" />
/// <reference path="../Shared/Utility.ts" />

jQuery(function () {
    var viewModel: Scrum.HomeViewModel = new Scrum.HomeViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));
});

module Scrum {
    export class HomeViewModel extends BaseSprintViewModel {
        constructor() {
            super();
        }
    }
}
