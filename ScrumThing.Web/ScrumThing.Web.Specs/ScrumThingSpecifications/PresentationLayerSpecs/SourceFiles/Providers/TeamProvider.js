var ScrumThing;
(function (ScrumThing) {
    var Providers;
    (function (Providers) {
        var TeamProvider = (function () {
            function TeamProvider() {
                this.GetTeams = function () {
                    return jQuery.ajax({
                        type: 'POST',
                        url: '/Home/GetTeams',
                        success: function (data) {
                            return data;
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            toastr.error("Failed to get teams: " + errorThrown);
                        }
                    });
                };
            }
            return TeamProvider;
        })();
        Providers.TeamProvider = TeamProvider;
        ;
    })(Providers = ScrumThing.Providers || (ScrumThing.Providers = {}));
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=TeamProvider.js.map