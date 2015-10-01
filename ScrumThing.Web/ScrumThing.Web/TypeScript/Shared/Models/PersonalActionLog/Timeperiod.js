/// <reference path="itask.ts" />
var ScrumThing;
(function (ScrumThing) {
    var Models;
    (function (Models) {
        var PersonalActionLog;
        (function (PersonalActionLog) {
            var Timeperiod = (function () {
                function Timeperiod() {
                    this.MinTimeperiodValue = new Date();
                    this.MaxTimeperiodValue = new Date();
                    this.Tasks = [];
                }
                return Timeperiod;
            })();
            PersonalActionLog.Timeperiod = Timeperiod;
        })(PersonalActionLog = Models.PersonalActionLog || (Models.PersonalActionLog = {}));
    })(Models = ScrumThing.Models || (ScrumThing.Models = {}));
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=timeperiod.js.map