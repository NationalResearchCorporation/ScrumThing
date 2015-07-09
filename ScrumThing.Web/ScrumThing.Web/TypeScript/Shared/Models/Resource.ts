module ScrumThing {
    export class Resource {
        public UserName: KnockoutObservable<string> = ko.observable<string>();
        public DevPercentage: KnockoutObservable<number> = ko.observable<number>();
        public QsPercentage: KnockoutObservable<number> = ko.observable<number>();
        public Days: KnockoutObservable<number> = ko.observable<number>();

        public TotalDevHours: KnockoutComputed<number> = ko.computed<number>(() => {
            return Math.round(this.DevPercentage() / 100.0 * this.Days() * 4);
        });

        public TotalQsHours: KnockoutComputed<number> = ko.computed<number>(() => {
            return Math.round(this.QsPercentage() / 100.0 * this.Days() * 4);
        });

        public TotalHours: KnockoutComputed<number> = ko.computed<number>(() => {
            return Math.round((this.TotalDevHours() + this.TotalQsHours()));
        });

        public constructor(userName: string, devPercentage: number, qsPercentage: number, days: number) {
            this.UserName(userName);
            this.DevPercentage(devPercentage);
            this.QsPercentage(qsPercentage);
            this.Days(days);
        }

        public ToRaw(): RawResource {
            var raw = new RawResource();
            raw.UserName = this.UserName();
            raw.DevPercentage = this.DevPercentage();
            raw.QsPercentage = this.QsPercentage();
            raw.Days = this.Days();
            raw.TotalDevHours = this.TotalDevHours();
            raw.TotalQsHours = this.TotalQsHours();
            raw.TotalHours = this.TotalHours();
            return raw;
        }
    }
} 