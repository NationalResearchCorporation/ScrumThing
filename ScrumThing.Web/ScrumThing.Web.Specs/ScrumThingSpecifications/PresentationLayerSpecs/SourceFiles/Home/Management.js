var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ScrumThing;
(function (ScrumThing) {
    var ViewModels;
    (function (ViewModels) {
        var Management = (function (_super) {
            __extends(Management, _super);
            function Management() {
                var _this = this;
                _super.call(this);
                this.NewStoryTagDescription = ko.observable("");
                this.AddStoryTag = function () {
                    jQuery.ajax({
                        type: 'POST',
                        url: '/Management/AddStoryTag',
                        data: {
                            StoryTagDescription: _this.NewStoryTagDescription()
                        },
                        success: function (rawStoryTag) {
                            _this.storyTags.push(rawStoryTag);
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            toastr.error("Failed to add storytag: " + errorThrown);
                        },
                    });
                };
                this.GetStoryTags();
                this.showSprintDropdown(false);
            }
            return Management;
        })(ScrumThing.BaseSprintViewModel);
        ViewModels.Management = Management;
    })(ViewModels = ScrumThing.ViewModels || (ScrumThing.ViewModels = {}));
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=Management.js.map