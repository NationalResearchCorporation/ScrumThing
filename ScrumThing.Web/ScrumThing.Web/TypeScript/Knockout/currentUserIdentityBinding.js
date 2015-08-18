ko.bindingHandlers.currentUserIdentity = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        viewModel.currentUserIdentity(ko.unwrap(valueAccessor()));
        jQuery(element).text(ko.unwrap(valueAccessor()));
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // Currently not supported.
    }
};
//# sourceMappingURL=currentUserIdentityBinding.js.map
