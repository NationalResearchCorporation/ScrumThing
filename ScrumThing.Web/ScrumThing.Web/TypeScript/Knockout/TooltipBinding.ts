
(<any>ko.bindingHandlers).tooltip = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var options = <TooltipOptions>ko.unwrap(valueAccessor());

        var title = <string>ko.unwrap(options.title);
        var placement = <string>ko.unwrap(options.placement);

        jQuery(element).attr('title', title);
        jQuery(element).attr('data-placement', placement);
        jQuery(element).tooltip({ container: 'body' });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // TODO: Figure out what to do when things change
    }
};
