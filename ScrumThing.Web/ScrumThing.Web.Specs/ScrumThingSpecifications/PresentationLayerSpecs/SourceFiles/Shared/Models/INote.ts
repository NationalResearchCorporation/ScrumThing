module ScrumThing {
    export interface INote {
        TaskId: number;
        UserName: KnockoutObservable<string>;
        Note: KnockoutObservable<string>;
        Timestamp: KnockoutObservable<string>;
        DisplayTimestamp: KnockoutComputed<string>;

        PrettifyDateString: (rawDate: string) => string;
        PadLeadingZero: (n: number) => string;
    }
}