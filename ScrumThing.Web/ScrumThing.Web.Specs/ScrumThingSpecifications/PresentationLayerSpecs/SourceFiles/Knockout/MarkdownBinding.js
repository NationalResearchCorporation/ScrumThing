ko.bindingHandlers.markdown = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        jQuery(element).markdown({
            fullscreen: {
                enable: false
            },
            onChange: function (e) {
                value(e.getContent());
            },
            footer: '<div></div>',
            onShow: function (e) {
            }
        });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    }
};
//# sourceMappingURL=MarkdownBinding.js.map