var ScrumThing;
(function (ScrumThing) {
    var Sprint = (function () {
        function Sprint(rawSprint) {
            this.SprintId = rawSprint.SprintId;
            this.Name = ko.observable(rawSprint.Name);
        }
        return Sprint;
    })();
    ScrumThing.Sprint = Sprint;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=Sprint.js.map