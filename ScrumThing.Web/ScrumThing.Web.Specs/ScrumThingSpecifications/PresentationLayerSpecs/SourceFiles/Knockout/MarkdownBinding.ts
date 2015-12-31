
// This binding currently assumes that the valueAccessor is an observable.

(<any>ko.bindingHandlers).markdown = {
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {

        var previewOnly: boolean = ko.unwrap(allBindings.get('previewOnly')) || false;
        var value : KnockoutObservable<string> = valueAccessor();

        var optionsForPreviewOnly = {
            hiddenButtons: 'all',
            fullscreen: {
                enable: false
            },
            resize: "vertical",
            onShow: (e) => {
                e.setContent(value());
                e.showPreview();

                //The core markdown control does some strange formatting when showPreview
                //is called directly. 
                //This unwinds some of that strangeness.
                var editorContainer = e.$editor;
                editorContainer.css({ "border": "none" });

                var previewContainer = editorContainer.find("div[class*='md-preview']");
                previewContainer.outerWidth('100%');
                previewContainer.outerHeight('100%');
                previewContainer.css({ "border-top": "0px solid #ddd", "border-bottom": "0px solid #ddd" });

                editorContainer.find("div[class*='md-header']").hide();
                editorContainer.find("div[class*='md-footer']").hide();
            }
        }

        var optionsForStandardView = {
            fullscreen: {
                enable: false
            },
            resize: "vertical",
            onChange: (e) => {
                value(e.getContent());
            },
            onShow: (e) => {
                e.setContent(value());
            }
        }

        var options = previewOnly? optionsForPreviewOnly : optionsForStandardView;
        jQuery(element).markdown(options);
    },

    update: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        var value: KnockoutObservable<string> = valueAccessor();
        jQuery(element).val(value());
    }
};