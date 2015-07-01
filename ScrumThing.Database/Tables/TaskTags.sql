CREATE TABLE [dbo].[TaskTags] (
    [TaskTagId]          INT         NOT NULL,
    [TaskTagDescription] VARCHAR(50) NULL,
    [TaskTagClasses]     VARCHAR(50) NULL,
    CONSTRAINT [PK_TaskTags] PRIMARY KEY CLUSTERED ([TaskTagId] ASC)
);
