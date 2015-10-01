// Binding from: http://eonasdan.github.io/bootstrap-datetimepicker/Installing/#knockout
// Typescriptified on our end.

(<any>ko.bindingHandlers).dateTimePicker = {
    init: (element, valueAccessor, allBindingsAccessor) => {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().dateTimePickerOptions || {};
        (<any>jQuery(element)).datetimepicker(options);

        //when a user changes the date, update the view model
        ko.utils.registerEventHandler(element, "dp.change", function (event) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                if (event.date != null && !(event.date instanceof Date)) {
                    value(event.date.toDate());
                } else {
                    value(event.date);
                }
            }
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            var picker = <any>jQuery(element).data("DateTimePicker");
            if (picker) {
                picker.destroy();
            }
        });
    },
    update: (element, valueAccessor, allBindings, viewModel, bindingContext) => {

        var picker = <any>jQuery(element).data("DateTimePicker");
        //when the view model is updated, update the widget
        if (picker) {
            var koDate = ko.utils.unwrapObservable(valueAccessor());

            //in case return from server datetime i am get in this form for example /Date(93989393)/ then fomat this
            koDate = (typeof (koDate) !== 'object') ? new Date(parseFloat(koDate.replace(/[^0-9]/g, ''))) : koDate;

            picker.date(koDate);
        }
    }
};