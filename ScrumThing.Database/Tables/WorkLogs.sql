CREATE TABLE [dbo].[WorkLogs] (
    [WorkLogId]               INT            IDENTITY (1, 1) NOT NULL,
    [LoggedBy]                VARCHAR(40)    NOT NULL DEFAULT dbo.SystemUserName(), 
    [SprintId]                INT            NOT NULL,
    [TaskId]                  INT            NOT NULL,
    [TaskDevHoursBurned]      DECIMAL (9, 4) NOT NULL DEFAULT 0,
    [TaskQsHoursBurned]       DECIMAL (9, 4) NOT NULL DEFAULT 0,
    [TaskRemainingDevHours]   DECIMAL (9, 4) NOT NULL DEFAULT 0,
    [TaskRemainingQsHours]    DECIMAL (9, 4) NOT NULL DEFAULT 0,
    [Timestamp]               DATETIME       NULL,
    CONSTRAINT [PK_WorkLogs] PRIMARY KEY CLUSTERED ([WorkLogId] ASC),
    CONSTRAINT [FK_WorkLogs_Tasks] FOREIGN KEY ([TaskId]) REFERENCES [dbo].[Tasks] ([TaskId]), 
);

GO

CREATE INDEX [IX_WorkLogs_LoggedBy] ON [dbo].[WorkLogs] ([LoggedBy])
