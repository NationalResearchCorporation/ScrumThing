// This binding currently assumes that the valueAccessor is an observable.
ko.bindingHandlers.markdown = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var previewOnly = ko.unwrap(allBindings.get('previewOnly')) || false;
        var value = valueAccessor();
        var optionsForPreviewOnly = {
            hiddenButtons: 'all',
            fullscreen: {
                enable: false
            },
            resize: "vertical",
            onShow: function (e) {
                e.setContent(value());
                e.showPreview();
                var editorContainer = e.$editor;
                editorContainer.css({ "border": "none" });
                var previewContainer = editorContainer.find("div[class*='md-preview']");
                previewContainer.outerWidth('100%');
                previewContainer.outerHeight('100%');
                previewContainer.css({ "border-top": "0px solid #ddd", "border-bottom": "0px solid #ddd" });
                editorContainer.find("div[class*='md-header']").hide();
                editorContainer.find("div[class*='md-footer']").hide();
            }
        };
        var optionsForStandardView = {
            fullscreen: {
                enable: false
            },
            resize: "vertical",
            onChange: function (e) {
                value(e.getContent());
            },
            onShow: function (e) {
                e.setContent(value());
            }
        };
        var options = previewOnly ? optionsForPreviewOnly : optionsForStandardView;
        jQuery(element).markdown(options);
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        jQuery(element).val(value());
    }
};
//# sourceMappingURL=MarkdownBinding.js.map