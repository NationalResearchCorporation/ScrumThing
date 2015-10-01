/// <reference path="../../../scripts/typings/knockout/knockout.d.ts" />
/// <reference path="rawassignment.ts" />
/// <reference path="inote.ts" />

module ScrumThing {
    export interface ITask {
        TaskId: number;
        HtmlId: string;
        Ordinal: KnockoutObservable<number>;
        TaskText: KnockoutObservable<string>;
        State: KnockoutObservable<string>;
        EstimatedDevHours: KnockoutObservable<number>;
        EstimatedQsHours: KnockoutObservable<number>;
        DevHoursBurned: KnockoutObservable<number>;
        QsHoursBurned: KnockoutObservable<number>;
        RemainingDevHours: KnockoutObservable<number>;
        RemainingQsHours: KnockoutObservable<number>;
        Assignments: KnockoutObservableArray<IRawAssignment>;
        TaskTags: KnockoutObservableArray<number>;
        Notes: KnockoutObservableArray<INote>;
        SearchableTaskText: KnockoutComputed<string>;
        AssignmentsForDropdown: KnockoutComputed<string[]>;
        UpdateTask: () => void;
        HasTaskTag: (taskTagId: number) => boolean;
        ToggleTaskTag: (taskTagId: number) => void
    }
} 
