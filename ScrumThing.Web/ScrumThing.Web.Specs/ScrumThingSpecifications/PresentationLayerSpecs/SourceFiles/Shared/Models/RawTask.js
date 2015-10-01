var ScrumThing;
(function (ScrumThing) {
    var RawTask = (function () {
        function RawTask(taskId, ordinal) {
            this.TaskId = -1;
            this.TaskText = '';
            this.Ordinal = 1;
            this.State = 'ReadyForDev';
            this.EstimatedDevHours = 0;
            this.EstimatedQsHours = 0;
            this.DevHoursBurned = 0;
            this.QsHoursBurned = 0;
            this.RemainingDevHours = 0;
            this.RemainingQsHours = 0;
            this.Assignments = [];
            this.Notes = [];
            this.TaskTags = [];
            this.TaskId = taskId;
            this.Ordinal = ordinal;
        }
        return RawTask;
    })();
    ScrumThing.RawTask = RawTask;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=RawTask.js.map