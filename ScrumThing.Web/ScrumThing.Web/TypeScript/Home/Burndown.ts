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
                        console.log(_.pluck(data, 'HoursBurned'));
                        this.burndown(JSON.stringify(data));
                        jQuery("#burndownChart").highcharts({
                            title: {
                                text: 'Sprint Burndown',
                                x: -20
                            },
                            subtitle: {
                                text: 'brought to you by the letter narf',
                                x: -20
                            },
                            xAxis: {
                                categories: _.pluck(data, 'FormattedBurnDate')
                            },
                            yAxis: {
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
                    error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                        jQuery.jGrowl("Failed to get burndown: " + errorThrown);
                    }
                });
            }
        }
    }
}
