module ScrumThing {
    (<any>ko.bindingHandlers).sizeToContent = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            element.style.resize = 'vertical';
            $(element).on('input', function () { sizeToContent(element); });
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            // Calling sizeToContent here is desirable, but causes performance issues right now when there are
            // a large number of stories/tasks. Commenting out until a way is found to reduce the performance issues. 
            //sizeToContent(element);
        }
    };

    function sizeToContent(element: HTMLTextAreaElement) {
        if (!element.scrollHeight) return; // Happens if the element is hidden.
        var borderHeight = element.offsetHeight - element.clientHeight;

        element.style.height = 'auto'; // This is needed to make it shrink when deleting lines.
        element.style.height = (element.scrollHeight + borderHeight) + 'px';
    }
}