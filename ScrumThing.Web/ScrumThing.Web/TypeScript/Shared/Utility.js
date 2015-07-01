var ScrumThing;
(function (ScrumThing) {
    function sum(values) {
        return _.reduce(values, function (l, r) {
            return l + r;
        }, 0);
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
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=Utility.js.map
