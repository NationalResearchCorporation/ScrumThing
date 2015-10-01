/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../../Scripts/typings/highcharts/highcharts.d.ts" />
/// <reference path="../Shared/Utility.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
jQuery(function () {
    var viewModel = new ScrumThing.HomeViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));
});
var ScrumThing;
(function (ScrumThing) {
    var HomeViewModel = (function (_super) {
        __extends(HomeViewModel, _super);
        function HomeViewModel() {
            _super.call(this);
        }
        return HomeViewModel;
    })(ScrumThing.BaseSprintViewModel);
    ScrumThing.HomeViewModel = HomeViewModel;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=Home.js.map