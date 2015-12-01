module ScrumThing.Models.PersonalActionLog {
    export interface ITask {
        MostRecentActivityLoggedBy: string;
        MostRecentTimeStamp: Date;
        MinTimeperiodValue: Date;
        MaxTimeperiodValue: Date;
        TeamName: string;
        SprintId: number;
        SprintName: string;
        StoryOrdinal: number;
        StoryTitle: string;
        StoryText: string;
        IsReachGoal: boolean;
        StoryPoints: number;
        TaskOrdinal: number;
        TaskText: string;
        TaskState: string;
        EstimatedDevHours: number;
        EstimatedQsHours: number;
        BurnedDevHours: number;
        BurnedDevHoursDelta: number;
        BurnedQsHours: number;
        BurnedQsHoursDelta: number;
        RemainingDevHours: number;
        RemainingDevHoursDelta: number;
        RemainingQsHours: number;
        RemainingQsHoursDelta: number;
    }
}