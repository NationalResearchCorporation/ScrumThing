/// <reference path="../../scripts/typings/moment/moment.d.ts" />
var ScrumThing;
(function (ScrumThing) {
    function sum(values) {
        return _.reduce(values, function (l, r) { return l + r; }, 0);
    }
    ScrumThing.sum = sum;
    function observableNumber() {
        var obs = ko.observable();
        return ko.computed({
            read: function () {
                return obs();
            },
            write: function (value) {
                obs(parseFloat(value));
            }
        });
    }
    ScrumThing.observableNumber = observableNumber;
    function formatJsonDateTimeString(dateString) {
        var date = new Date(parseInt(dateString.substr(6)));
        var dateString = moment(date).format("dddd, MMMM Do [at] LT");
        return dateString;
    }
    ScrumThing.formatJsonDateTimeString = formatJsonDateTimeString;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=Utility.js.map