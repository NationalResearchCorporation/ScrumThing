/// <reference path="../../scripts/typings/moment/moment.d.ts" />
 
module ScrumThing {
    export function sum(values: number[]): number {
        return _.reduce<number, number>(values, (l, r) => { return l + r; }, 0);
    }

    export function observableNumber(): KnockoutObservable<number> {
        var obs = ko.observable<number>();
        return ko.computed({
            read: (): number => {
                return obs();
            },
            write: (value: any) => {
                obs(parseFloat(value));
            }
        });
    }

    // http://stackoverflow.com/a/1767558/3434541
    export function formatJsonDateTimeString(dateString: string): string {
        var date = new Date(parseInt(dateString.substr(6)));
        var dateString = moment(date).format("dddd, MMMM Do [at] LT");
        return dateString;
    }
}
