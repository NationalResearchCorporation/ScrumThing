
CREATE TABLE [dbo].[Sprints] (
    [SprintId] INT IDENTITY (1, 1) NOT NULL,
    [TeamId]   INT NOT NULL,
    [Name] VARCHAR(200) NULL, 
    CONSTRAINT [PK_Sprints] PRIMARY KEY CLUSTERED ([SprintId] ASC),
    CONSTRAINT [FK_Sprints_Teams] FOREIGN KEY ([TeamId]) REFERENCES [dbo].[Teams] ([TeamId])
);


