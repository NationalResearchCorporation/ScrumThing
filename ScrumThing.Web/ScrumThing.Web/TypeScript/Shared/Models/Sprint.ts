module ScrumThing {
    export class Sprint {
        public SprintId: number;
        public Name: KnockoutObservable<string>;

        public constructor(rawSprint: RawSprint) {
            this.SprintId = rawSprint.SprintId;
            this.Name = ko.observable(rawSprint.Name);
        }
    }
}