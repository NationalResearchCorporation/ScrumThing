ko.bindingHandlers.tooltip = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var options = ko.unwrap(valueAccessor());
        var title = ko.unwrap(options.title);
        var placement = ko.unwrap(options.placement);
        jQuery(element).attr('title', title);
        jQuery(element).attr('data-placement', placement);
        jQuery(element).tooltip({ container: element });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // TODO: Figure out what to do when things change
    }
};
//# sourceMappingURL=TooltipBinding.js.map