var ScrumThing;
(function (ScrumThing) {
    ko.bindingHandlers.sizeToContent = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            element.style.resize = 'none';
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            sizeToContent(element);
            $(element).on('input', function () { sizeToContent(element); });
        }
    };
    function sizeToContent(element) {
        if (!element.scrollHeight)
            return;
        var borderHeight = element.offsetHeight - element.clientHeight;
        element.style.height = 'auto';
        element.style.height = (element.scrollHeight + borderHeight) + 'px';
    }
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=SizeToContent.js.map