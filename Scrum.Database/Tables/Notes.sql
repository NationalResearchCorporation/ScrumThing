
CREATE TABLE [dbo].[Notes] (
    [NoteId]    INT           IDENTITY (1, 1) NOT NULL,
    [TaskId]    INT           NOT NULL,
    [UserName]  VARCHAR (40)  NOT NULL,
    [Note]      VARCHAR (MAX) NOT NULL,
    [Timestamp] DATETIME      NOT NULL,
    CONSTRAINT [PK_Notes] PRIMARY KEY CLUSTERED ([NoteId] ASC),
    CONSTRAINT [FK_Notes_Tasks] FOREIGN KEY ([TaskId]) REFERENCES [dbo].[Tasks] ([TaskId])
);




