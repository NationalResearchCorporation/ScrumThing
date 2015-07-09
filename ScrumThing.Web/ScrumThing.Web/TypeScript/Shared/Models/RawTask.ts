module ScrumThing {
    export class RawTask {
        public TaskId: number = -1;
        public TaskText: string = '';
        public Ordinal: number = 1;
        public State: string = 'ReadyForDev';
        public EstimatedDevHours: number = 0;
        public EstimatedQsHours: number = 0;
        public DevHoursBurned: number = 0;
        public QsHoursBurned: number = 0;
        public RemainingDevHours: number = 0;
        public RemainingQsHours: number = 0;
        public Assignments: RawAssignment[];
        public Notes: RawNote[];
        public TaskTags: RawTaskTag[];

        constructor(taskId: number, ordinal: number, taskTags: RawTaskTag[]) {
            this.TaskId = taskId;
            this.Ordinal = ordinal;
            this.TaskTags = taskTags;
        }
    }
} 