
CREATE TABLE [dbo].[StoryTags] (
    [StoryTagId]          INT         NOT NULL IDENTITY(1, 1),
    [StoryTagDescription] VARCHAR(50) NULL,
    [Ordinal] INT NOT NULL,
    CONSTRAINT [PK_StoryTags] PRIMARY KEY CLUSTERED ([StoryTagId] ASC)
);
