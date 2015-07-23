var ScrumThing;
(function (ScrumThing) {
    var RawTaskTag = (function () {
        function RawTaskTag(tagId, tagDescription, tagClasses) {
            this.TaskTagId = tagId;
            this.TaskTagClasses = tagClasses;
            this.TaskTagDescription = tagDescription;
        }
        return RawTaskTag;
    })();
    ScrumThing.RawTaskTag = RawTaskTag;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=RawTaskTag.js.map
