/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../../Scripts/typings/highcharts/highcharts.d.ts" />
/// <reference path="../Shared/Utility.ts" />

jQuery(function () {
    var viewModel: ScrumThing.BurndownViewModel = new ScrumThing.BurndownViewModel();
    ko.applyBindings(viewModel, document.getElementById('body'));
});

module ScrumThing {
    export class BurndownViewModel extends BaseSprintViewModel {
        public burndown: KnockoutObservable<any> = ko.observable();

        constructor() {
            super();
            this.sprintId.subscribe(this.GetBurndown, this);
        }

        public GetBurndown() {
            if (typeof this.sprintId() === 'number') {
                jQuery.ajax({
                    type: 'POST',
                    url: '/Burndown/GetBurndown',
                    data: { SprintId: this.sprintId() },
                    success: (data: Array<any>) => {
                        this.burndown(JSON.stringify(data));

                        var preliminaryPoint = _.findIndex(data, (point) => point.Preliminary);
                        var zones = null;
                        var notFound = -1;
                        if (preliminaryPoint != notFound) {
                            zones = [{
                                value: preliminaryPoint - 1,
                                dashStyle: 'Solid'
                            }, {
                                value: preliminaryPoint,
                                dashStyle: 'Dash'
                            }]
                        }

                        jQuery("#burndownChart").highcharts({
                            title: {
                                text: 'Sprint Burndown',
                                x: -20
                            },
                            tooltip: {
                                formatter: function () {
                                    var notFinalWarning = '';
                                    if (!this.point.IsFinal) {
                                        notFinalWarning = '<b>Preliminary</b><br />';
                                    }

                                    return notFinalWarning + this.x + '<br /><span style="color:' + this.point.series.color + '">\u25CF</span> ' + this.series.name + ': <b>' + Number(Math.round(Math.ceil(this.point.y * 2)) / 2) + '</b><br/>'
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
                                data: _.map(data, (point) => {
                                    return {
                                        y: point.HoursRemaining,
                                        IsFinal: point.Preliminary
                                    };
                                }),
                                color: '#7CB5EC',
                                zoneAxis: 'x',
                                zones: zones
                            }, {
                                name: 'Burned',
                                data: _.map(data, (point) => {
                                    return {
                                        y: point.HoursBurned,
                                        IsFinal: point.Preliminary
                                    };
                                }),
                                color: '#C0C0C0',
                                zoneAxis: 'x',
                                zones: zones
                            }, {
                                name: 'Ideal (End of Day)',
                                data: _.pluck(data, 'IdealHoursRemaining'),
                                color: '#90ED7D'
                            }]
                        });
                    },
                    error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                        toastr.error("Failed to get burndown: " + errorThrown);
                    }
                });
            }
        }
    }
}
