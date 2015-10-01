// Binding from: http://eonasdan.github.io/bootstrap-datetimepicker/Installing/#knockout
// Typescriptified on our end.
ko.bindingHandlers.dateTimePicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = allBindingsAccessor().dateTimePickerOptions || {};
        jQuery(element).datetimepicker(options);
        ko.utils.registerEventHandler(element, "dp.change", function (event) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                if (event.date != null && !(event.date instanceof Date)) {
                    value(event.date.toDate());
                }
                else {
                    value(event.date);
                }
            }
        });
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            var picker = jQuery(element).data("DateTimePicker");
            if (picker) {
                picker.destroy();
            }
        });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var picker = jQuery(element).data("DateTimePicker");
        if (picker) {
            var koDate = ko.utils.unwrapObservable(valueAccessor());
            koDate = (typeof (koDate) !== 'object') ? new Date(parseFloat(koDate.replace(/[^0-9]/g, ''))) : koDate;
            picker.date(koDate);
        }
    }
};
//# sourceMappingURL=DateTimePickerBinding.js.map