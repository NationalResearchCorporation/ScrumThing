CREATE TABLE [dbo].[WorkLogs] (
    [WorkLogId]               INT            IDENTITY (1, 1) NOT NULL,
    [SprintId]                INT            NOT NULL,
    [TaskId]                  INT            NOT NULL,
    [TaskDevHoursBurned]      DECIMAL (9, 4) NOT NULL,
    [TaskQsHoursBurned]       DECIMAL (9, 4) NOT NULL,
    [TaskRemainingDevHours]   DECIMAL (9, 4) NOT NULL,
    [TaskRemainingQsHours]    DECIMAL (9, 4) NOT NULL,
    [Timestamp]               DATETIME       NULL,
    CONSTRAINT [PK_WorkLogs] PRIMARY KEY CLUSTERED ([WorkLogId] ASC),
    CONSTRAINT [FK_WorkLogs_Tasks] FOREIGN KEY ([TaskId]) REFERENCES [dbo].[Tasks] ([TaskId])
);




