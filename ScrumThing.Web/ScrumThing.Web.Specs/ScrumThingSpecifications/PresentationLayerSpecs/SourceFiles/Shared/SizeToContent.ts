module ScrumThing {
    (<any>ko.bindingHandlers).sizeToContent = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            element.style.resize = 'none';
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            sizeToContent(element);
            $(element).on('input', function () { sizeToContent(element); });
        }
    };

    function sizeToContent(element: HTMLTextAreaElement) {
        if (!element.scrollHeight) return; // Happens if the element is hidden.
        var borderHeight = element.offsetHeight - element.clientHeight;

        element.style.height = 'auto'; // This is needed to make it shrink when deleting lines.
        element.style.height = (element.scrollHeight + borderHeight) + 'px';
    }
}