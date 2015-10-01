var ScrumThing;
(function (ScrumThing) {
    var Providers;
    (function (Providers) {
        var TimeProvider = (function () {
            function TimeProvider() {
                this.GetCurrentTime = function () { return new Date(); };
            }
            return TimeProvider;
        })();
        Providers.TimeProvider = TimeProvider;
    })(Providers = ScrumThing.Providers || (ScrumThing.Providers = {}));
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=TimeProvider.js.map