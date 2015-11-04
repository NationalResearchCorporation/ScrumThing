var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ScrumThing;
(function (ScrumThing) {
    var ViewModels;
    (function (ViewModels) {
        var PersonalActionLog = (function (_super) {
            __extends(PersonalActionLog, _super);
            function PersonalActionLog(timeProvider, palProvider, teamProvider) {
                var _this = this;
                _super.call(this, teamProvider);
                this.FromDateTime = ko.observable(new Date());
                this.ToDateTime = ko.observable(new Date());
                this.DateSelectionIsInvalid = ko.computed(function () {
                    return _this.ToDateTime().getTime() < _this.FromDateTime().getTime();
                });
                this.TimeScales = [
                    'sprint',
                    'week',
                    'day',
                    'hour',
                    'minute',
                    'none'
                ];
                this.CurrentTimeScale = ko.observable('day');
                this.Log = ko.observable(new ScrumThing.Models.PersonalActionLog.Log([]));
                this.CurrentlyRefreshingData = ko.observable(false);
                this.RefreshData = function () {
                    _this.CurrentlyRefreshingData(true);
                    palProvider
                        .GetPersonalActionLog(_this.FromDateTime(), _this.ToDateTime(), _this.CurrentTimeScale())
                        .done(function (tasks) {
                        _this.Log(new ScrumThing.Models.PersonalActionLog.Log(tasks));
                        _this.CurrentlyRefreshingData(false);
                    });
                };
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
                ko.computed(function () {
                    _this.RefreshData();
                });
                this.showSprintDropdown(false);
            }
            return PersonalActionLog;
        })(ScrumThing.BaseViewModel);
        ViewModels.PersonalActionLog = PersonalActionLog;
    })(ViewModels = ScrumThing.ViewModels || (ScrumThing.ViewModels = {}));
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=PersonalActionLog.js.map