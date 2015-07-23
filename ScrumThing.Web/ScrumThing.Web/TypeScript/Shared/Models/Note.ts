module ScrumThing {
    export class Note {
        public TaskId: number;
        public UserName: KnockoutObservable<string> = ko.observable<string>();
        public Note: KnockoutObservable<string> = ko.observable<string>();
        public Timestamp: KnockoutObservable<string> = ko.observable<string>();

        public DisplayTimestamp: KnockoutComputed<string>;

        public constructor(raw: RawNote) {
            this.TaskId = raw.TaskId;
            this.UserName(raw.UserName);
            this.Note(raw.Note);
            this.Timestamp(raw.Timestamp);

            this.DisplayTimestamp = ko.computed<string>(() => {
                return this.PrettifyDateString(this.Timestamp());
            });
        }

        public PrettifyDateString(rawDate: string): string {
            var d = new Date(rawDate);
            return d.getMonth() + '/' + this.PadLeadingZero(d.getDay()) + ' '
                + (d.getHours() % 12) + ':' + this.PadLeadingZero(d.getMinutes()) + ' '
                + (d.getHours() > 12 ? "PM" : "AM");
        }

        public PadLeadingZero(n: number): string {
            return ("0" + n).slice(-2);
        }
    }
}