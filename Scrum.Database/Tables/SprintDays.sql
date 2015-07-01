
CREATE TABLE [dbo].[SprintDays] (
    [SprintId] INT  NOT NULL,
    [Day]      DATE NOT NULL,
    CONSTRAINT [PK_SprintDays] PRIMARY KEY CLUSTERED ([SprintId] ASC, [Day] ASC),
    CONSTRAINT [FK_SprintDays_SprintId] FOREIGN KEY ([SprintId]) REFERENCES [dbo].[Sprints] ([SprintId])
);


