CREATE TABLE [dbo].[StoriesInTags] (
    [StoryId]    INT NOT NULL,
    [StoryTagId] INT NOT NULL,
    CONSTRAINT [PK_StorysInTags] PRIMARY KEY CLUSTERED ([StoryId] ASC, [StoryTagId] ASC),
    CONSTRAINT [FK_StorysInTags_Storys] FOREIGN KEY ([StoryId]) REFERENCES [dbo].[Stories] ([StoryId]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_StorysInTags_Tags] FOREIGN KEY ([StoryTagId]) REFERENCES [dbo].[StoryTags] ([StoryTagId]) ON DELETE CASCADE ON UPDATE CASCADE
);

