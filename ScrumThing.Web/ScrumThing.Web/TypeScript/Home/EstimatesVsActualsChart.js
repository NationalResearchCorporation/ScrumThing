/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../../Scripts/typings/highcharts/highcharts.d.ts" />
/// <reference path="../Shared/Utility.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
jQuery(function () {
    var viewModel = new ScrumThing.EstimatesVsActualsViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));
});

var ScrumThing;
(function (ScrumThing) {
    var EstimatesVsActualsViewModel = (function (_super) {
        __extends(EstimatesVsActualsViewModel, _super);
        //public estimatesVsActuals: KnockoutObservable<any> = ko.observable();
        function EstimatesVsActualsViewModel() {
            _super.call(this);
            this.sprintId.subscribe(this.GetEstimatesVsActuals, this);
        }
        EstimatesVsActualsViewModel.prototype.GetSeriesData = function (data, groupByField, aggregateField) {
            return _.chain(data).groupBy(groupByField).map(function (values, key) {
                return _.reduce(values, function (memo, value) {
                    return memo + value[aggregateField];
                }, 0);
            }).value();
        };

        EstimatesVsActualsViewModel.prototype.GetEstimatesVsActuals = function () {
            var _this = this;
            if (typeof this.sprintId() === 'number') {
                jQuery.ajax({
                    type: 'POST',
                    url: '/EstimatesVsActuals/GetEstimatesVsActuals',
                    data: { SprintId: this.sprintId() },
                    success: function (data) {
                        jQuery("#estimatesVsActualsChart").highcharts({
                            chart: {
                                type: 'bar',
                                height: _.uniq(_.pluck(data, 'StoryText')).length * 100
                            },
                            title: {
                                text: 'Estimates vs Actuals'
                            },
                            xAxis: {
                                categories: _.uniq(_.pluck(data, 'StoryText')),
                                title: {
                                    text: 'Stories'
                                },
                                labels: {
                                    formatter: function () {
                                        var currentText = this.value;

                                        var ordinal = _.find(data, function (row) {
                                            return row.StoryText == currentText;
                                        }).StoryOrdinal;

                                        return '<span><b>' + ordinal + '</b> ' + this.value + '</span>';
                                    }
                                }
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: 'Hours',
                                    align: 'high'
                                },
                                labels: {
                                    overflow: 'justify'
                                }
                            },
                            tooltip: {
                                valueSuffix: ''
                            },
                            plotOptions: {
                                bar: {
                                    dataLabels: {
                                        enabled: true
                                    }
                                }
                            },
                            legend: {
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'top',
                                x: -40,
                                y: 100,
                                floating: true,
                                borderWidth: 1,
                                backgroundColor: '#FFFFFF',
                                shadow: true,
                                reversed: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: [
                                {
                                    name: 'Dev Estimated',
                                    data: _this.GetSeriesData(data, 'StoryText', 'EstimatedDevHours'),
                                    index: 3,
                                    color: '#A4A7FA'
                                },
                                {
                                    name: 'Dev Actual',
                                    data: _this.GetSeriesData(data, 'StoryText', 'DevHoursBurned'),
                                    index: 2,
                                    color: '#070DA8'
                                },
                                {
                                    name: 'QS Estimated',
                                    data: _this.GetSeriesData(data, 'StoryText', 'EstimatedQsHours'),
                                    index: 1,
                                    color: '#E0A3F6'
                                },
                                {
                                    name: 'QS Actual',
                                    data: _this.GetSeriesData(data, 'StoryText', 'QsHoursBurned'),
                                    index: 0,
                                    color: '#6E1190'
                                }
                            ]
                        });
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        jQuery.jGrowl("Failed to get estimates vs actuals: " + errorThrown);
                    }
                });
            }
        };
        return EstimatesVsActualsViewModel;
    })(ScrumThing.BaseSprintViewModel);
    ScrumThing.EstimatesVsActualsViewModel = EstimatesVsActualsViewModel;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=EstimatesVsActualsChart.js.map
