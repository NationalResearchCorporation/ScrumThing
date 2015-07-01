 
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
}
