var ScrumThing;
(function (ScrumThing) {
    var StoryTag = (function () {
        function StoryTag(rawStoryTag) {
            this.StoryTagId = rawStoryTag.StoryTagId;
            this.StoryTagDescription = ko.observable(rawStoryTag.StoryTagDescription);
            this.Ordinal = ko.observable(rawStoryTag.Ordinal);
            this.Enabled = ko.observable(rawStoryTag.Enabled);
        }
        return StoryTag;
    })();
    ScrumThing.StoryTag = StoryTag;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=StoryTag.js.map