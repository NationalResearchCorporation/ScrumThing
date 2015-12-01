CREATE TABLE [dbo].[Stories] (
    [StoryId]     INT            IDENTITY (1, 1) NOT NULL,
    [StoryText]   VARCHAR (1000) NULL,
    [SprintId]    INT            NOT NULL,
    [StoryPoints] INT            NOT NULL DEFAULT 0,
    [Ordinal]     INT            NOT NULL,
    [IsReachGoal] BIT            NOT NULL DEFAULT 0,
    [Title]       VARCHAR(100)   NULL,
    PRIMARY KEY CLUSTERED ([StoryId] ASC),
    CONSTRAINT [FK_Stories_Sprints] FOREIGN KEY ([SprintId]) REFERENCES [dbo].[Sprints] ([SprintId])
);


