var ScrumThing;
(function (ScrumThing) {
    var Note = (function () {
        function Note(raw) {
            var _this = this;
            this.UserName = ko.observable();
            this.Note = ko.observable();
            this.Timestamp = ko.observable();
            this.TaskId = raw.TaskId;
            this.UserName(raw.UserName);
            this.Note(raw.Note);
            this.Timestamp(raw.Timestamp);
            this.DisplayTimestamp = ko.computed(function () {
                return _this.PrettifyDateString(_this.Timestamp());
            });
        }
        Note.prototype.PrettifyDateString = function (rawDate) {
            var d = new Date(rawDate);
            return d.getMonth() + '/' + this.PadLeadingZero(d.getDay()) + ' '
                + (d.getHours() % 12) + ':' + this.PadLeadingZero(d.getMinutes()) + ' '
                + (d.getHours() > 12 ? "PM" : "AM");
        };
        Note.prototype.PadLeadingZero = function (n) {
            return ("0" + n).slice(-2);
        };
        return Note;
    })();
    ScrumThing.Note = Note;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=Note.js.map