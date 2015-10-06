/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../../Scripts/typings/highcharts/highcharts.d.ts" />
/// <reference path="../Shared/Utility.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
jQuery(function () {
    var viewModel = new ScrumThing.BurndownViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));
});
var ScrumThing;
(function (ScrumThing) {
    var BurndownViewModel = (function (_super) {
        __extends(BurndownViewModel, _super);
        function BurndownViewModel() {
            _super.call(this);
            this.burndown = ko.observable();
            this.sprintId.subscribe(this.GetBurndown, this);
        }
        BurndownViewModel.prototype.GetBurndown = function () {
            var _this = this;
            if (typeof this.sprintId() === 'number') {
                jQuery.ajax({
                    type: 'POST',
                    url: '/Burndown/GetBurndown',
                    data: { SprintId: this.sprintId() },
                    success: function (data) {
                        _this.burndown(JSON.stringify(data));
                        jQuery("#burndownChart").highcharts({
                            title: {
                                text: 'Sprint Burndown',
                                x: -20
                            },
                            tooltip: {
                                formatter: function () {
                                    return this.x + '<br /><span style="color:' + this.point.series.color + '">\u25CF</span> ' + this.series.name + ': <b>' + Number(Math.round(Math.ceil(this.point.y * 2)) / 2) + '</b><br/>';
                                }
                            },
                            xAxis: {
                                categories: _.pluck(data, 'FormattedBurnDate')
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Hours'
                                },
                                plotLines: [{
                                        value: 0,
                                        width: 1,
                                        color: '#808080'
                                    }]
                            },
                            series: [{
                                    name: 'Remaining',
                                    data: _.pluck(data, 'HoursRemaining'),
                                    color: '#7CB5EC'
                                }, {
                                    name: 'Burned',
                                    data: _.pluck(data, 'HoursBurned'),
                                    color: '#C0C0C0'
                                }, {
                                    name: 'Ideal (End of Day)',
                                    data: _.pluck(data, 'IdealHoursRemaining'),
                                    color: '#90ED7D'
                                }]
                        });
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        toastr.error("Failed to get burndown: " + errorThrown);
                    }
                });
            }
        };
        return BurndownViewModel;
    })(ScrumThing.BaseSprintViewModel);
    ScrumThing.BurndownViewModel = BurndownViewModel;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=Burndown.js.map