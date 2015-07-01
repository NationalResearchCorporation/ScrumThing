/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../../Scripts/typings/highcharts/highcharts.d.ts" />
/// <reference path="../Shared/Utility.ts" />

jQuery(function () {
    var viewModel: ScrumThing.EstimatesVsActualsViewModel = new ScrumThing.EstimatesVsActualsViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));
});

module ScrumThing {
    export class EstimatesVsActualsViewModel extends BaseSprintViewModel {
        //public estimatesVsActuals: KnockoutObservable<any> = ko.observable();

        constructor() {
            super();
            this.sprintId.subscribe(this.GetEstimatesVsActuals, this);
        }

        private GetSeriesData(data, groupByField, aggregateField): Array<number> {
            return _.chain(data)
                .groupBy(groupByField)
                .map((values, key): number => {
                    return _.reduce(values, (memo, value: any): number => {
                        return memo + value[aggregateField];
                    }, 0);
                }).value();

        }

        public GetEstimatesVsActuals() {
            if (typeof this.sprintId() === 'number') {
                jQuery.ajax({
                    type: 'POST',
                    url: '/EstimatesVsActuals/GetEstimatesVsActuals',
                    data: { SprintId: this.sprintId() },
                    success: (data: Array<any>) => {

                        
                        jQuery("#estimatesVsActualsChart").highcharts({
                            chart: {
                                type: 'bar',
                                height: _.uniq(_.pluck(data, 'StoryText')).length * 100
                            },
                            title: {
                                text: 'Estimates vs Actuals'
                            },
                            subtitle: {
                                text: 'brought to you by the letter narf',
                                x: -20
                            },
                            xAxis: {
                                categories: _.uniq(_.pluck(data, 'StoryText')),
                                title: {
                                    text: 'Stories'
                                },
                                labels: {
                                    formatter: function () { 

                                        var currentText = this.value;

                                        var ordinal = _.find(data, (row) => {
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
                                    data: this.GetSeriesData(data, 'StoryText', 'EstimatedDevHours'),
                                    index: 3,
                                    color: '#A4A7FA'
                                },
                                {
                                    name: 'Dev Actual',
                                    data: this.GetSeriesData(data, 'StoryText', 'DevHoursBurned'),
                                    index: 2,
                                    color: '#070DA8'
                                },
                                {
                                    name: 'QS Estimated',
                                    data: this.GetSeriesData(data, 'StoryText', 'EstimatedQsHours'),
                                    index: 1,
                                    color: '#E0A3F6'
                                },
                                {
                                    name: 'QS Actual',
                                    data: this.GetSeriesData(data, 'StoryText', 'QsHoursBurned'),
                                    index: 0,
                                    color: '#6E1190'
                                }
                            ]
                        });
                    },
                    error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                        jQuery.jGrowl("Failed to get estimates vs actuals: " + errorThrown);
                    }
                });
            }
        }
    }
}
