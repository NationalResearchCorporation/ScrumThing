(<any>ko.bindingHandlers).markdown = {
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        var value = valueAccessor();
        jQuery(element).markdown({
            fullscreen: {
                enable: false
            },
            onChange: (e) => {
                value(e.getContent());
            },
            footer: '<div></div>',
            onShow: (e) => {

            }
        });
    },
    update: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        //
    }
};