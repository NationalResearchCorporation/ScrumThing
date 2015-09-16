var ScrumThing;
(function (ScrumThing) {
    var RawStoryTag = (function () {
        function RawStoryTag(storyTagId, storyTagDescription) {
            this.StoryTagId = storyTagId;
            this.StoryTagDescription = storyTagDescription;
        }
        return RawStoryTag;
    })();
    ScrumThing.RawStoryTag = RawStoryTag;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=RawStoryTag.js.map