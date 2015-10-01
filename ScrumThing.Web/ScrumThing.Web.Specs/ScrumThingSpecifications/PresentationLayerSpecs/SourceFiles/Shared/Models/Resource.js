/// <reference path="rawresource.ts" />
var ScrumThing;
(function (ScrumThing) {
    var Resource = (function () {
        function Resource(userName, devPercentage, qsPercentage, days) {
            var _this = this;
            this.UserName = ko.observable();
            this.DevPercentage = ko.observable();
            this.QsPercentage = ko.observable();
            this.Days = ko.observable();
            this.TotalDevHours = ko.computed(function () {
                return Math.round(_this.DevPercentage() / 100.0 * _this.Days() * 4);
            });
            this.TotalQsHours = ko.computed(function () {
                return Math.round(_this.QsPercentage() / 100.0 * _this.Days() * 4);
            });
            this.TotalHours = ko.computed(function () {
                return Math.round((_this.TotalDevHours() + _this.TotalQsHours()));
            });
            this.UserName(userName);
            this.DevPercentage(devPercentage);
            this.QsPercentage(qsPercentage);
            this.Days(days);
        }
        Resource.prototype.ToRaw = function () {
            var raw = new ScrumThing.RawResource();
            raw.UserName = this.UserName();
            raw.DevPercentage = this.DevPercentage();
            raw.QsPercentage = this.QsPercentage();
            raw.Days = this.Days();
            raw.TotalDevHours = this.TotalDevHours();
            raw.TotalQsHours = this.TotalQsHours();
            raw.TotalHours = this.TotalHours();
            return raw;
        };
        return Resource;
    })();
    ScrumThing.Resource = Resource;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=Resource.js.map