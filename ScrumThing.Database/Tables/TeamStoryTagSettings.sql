CREATE TABLE [dbo].[TeamStoryTagSettings] (
    [TeamStoryTagSettingId] INT NOT NULL IDENTITY(1, 1),
    [TeamId] INT NOT NULL,
    [StoryTagId] INT NOT NULL,
    [Enabled] BIT NOT NULL DEFAULT(1),
    CONSTRAINT [PK_TeamStoryTagSettings] PRIMARY KEY CLUSTERED ([TeamStoryTagSettingId] ASC),
    CONSTRAINT [AK_TeamStoryTagSettings_TeamIdStoryTagId] UNIQUE ([TeamId], [StoryTagId]),
    CONSTRAINT [FK_TeamStoryTagSettings_TeamId] FOREIGN KEY ([TeamId]) REFERENCES [dbo].[Teams] ([TeamId]),
    CONSTRAINT [FK_StoryTagStoryTagSettings_StoryTagId] FOREIGN KEY ([StoryTagId]) REFERENCES [dbo].[StoryTags] ([StoryTagId])
);
