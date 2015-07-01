CREATE TABLE [dbo].[TasksInTags] (
    [TaskId]    INT NOT NULL,
    [TaskTagId] INT NOT NULL,
    CONSTRAINT [PK_TasksInTags] PRIMARY KEY CLUSTERED ([TaskId] ASC, [TaskTagId] ASC),
    CONSTRAINT [FK_TasksInTags_Tasks] FOREIGN KEY ([TaskId]) REFERENCES [dbo].[Tasks] ([TaskId]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_TasksInTags_Tags] FOREIGN KEY ([TaskTagId]) REFERENCES [dbo].[TaskTags] ([TaskTagId]) ON DELETE CASCADE ON UPDATE CASCADE
);

