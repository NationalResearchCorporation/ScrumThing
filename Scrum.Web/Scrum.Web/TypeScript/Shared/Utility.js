var Scrum;
(function (Scrum) {
    function sum(values) {
        return _.reduce(values, function (l, r) {
            return l + r;
        }, 0);
    }
    Scrum.sum = sum;

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
    Scrum.observableNumber = observableNumber;
})(Scrum || (Scrum = {}));
//# sourceMappingURL=Utility.js.map
