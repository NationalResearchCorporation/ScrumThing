CREATE TABLE [dbo].[StoryTags] (
    -- We will manage these IDs by hand, we do not need autoincrement
    [StoryTagId]          INT         NOT NULL,
    [StoryTagDescription] VARCHAR(50) NULL,
    CONSTRAINT [PK_StoryTags] PRIMARY KEY CLUSTERED ([StoryTagId] ASC)
);
