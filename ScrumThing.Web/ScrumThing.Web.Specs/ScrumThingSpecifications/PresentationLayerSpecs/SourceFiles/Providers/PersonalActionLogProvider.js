var ScrumThing;
(function (ScrumThing) {
    var Providers;
    (function (Providers) {
        var PersonalActionLogProvider = (function () {
            function PersonalActionLogProvider(userIdentity) {
                var _this = this;
                this.GetPersonalActionLog = function (fromTime, toTime, timeScale) {
                    return jQuery.ajax({
                        type: 'POST',
                        url: '/PersonalActionLog/GetPersonalActionLog',
                        data: { UserIdentity: _this.UserIdentity, FromTime: fromTime.toISOString(), ToTime: toTime.toISOString(), TimeScale: timeScale },
                        success: function (data) {
                            return data;
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            toastr.error("Failed to get personal action log: " + errorThrown);
                        }
                    });
                };
                this.UserIdentity = userIdentity;
            }
            return PersonalActionLogProvider;
        })();
        Providers.PersonalActionLogProvider = PersonalActionLogProvider;
        ;
    })(Providers = ScrumThing.Providers || (ScrumThing.Providers = {}));
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=PersonalActionLogProvider.js.map