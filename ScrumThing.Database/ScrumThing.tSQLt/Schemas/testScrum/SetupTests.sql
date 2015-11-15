CREATE SCHEMA testScrumThing AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'testScrumThing';
GO 

CREATE PROCEDURE testScrumThing.SetupTests
AS
    DELETE FROM Notes;
    DELETE FROM WorkLogs;
    DELETE FROM Assignments;
    DELETE FROM Resources;
    DELETE FROM SprintDays;
    DELETE FROM Tasks;
    DELETE FROM Stories;
    DELETE FROM Sprints;
    DELETE FROM Teams;
    DELETE FROM Users;

    DBCC CHECKIDENT ('dbo.Notes', RESEED, 0) WITH NO_INFOMSGS;
    DBCC CHECKIDENT ('dbo.WorkLogs', RESEED, 0) WITH NO_INFOMSGS;
    DBCC CHECKIDENT ('dbo.Resources', RESEED, 0) WITH NO_INFOMSGS;
    DBCC CHECKIDENT ('dbo.Tasks', RESEED, 0) WITH NO_INFOMSGS;
    DBCC CHECKIDENT ('dbo.Stories', RESEED, 0) WITH NO_INFOMSGS;
    DBCC CHECKIDENT ('dbo.Sprints', RESEED, 0) WITH NO_INFOMSGS;

    INSERT UserIdentities (UserIdentity) VALUES ('UserIdentity1'), ('UserIdentity2'), ('Unknown')

    INSERT Users VALUES
        ('User1', 'user1@nrc.com', 'UserIdentity1'),
        ('User2', 'user2@nrc.com', 'UserIdentity2')

    INSERT Teams VALUES
        (1, 'Team1'),
        (2, 'Team2');

    SET IDENTITY_INSERT Sprints ON
    INSERT Sprints (SprintId, TeamId) VALUES
        (1, 1),
        (2, 1),
        (3, 2),
        (4, 2)
    SET IDENTITY_INSERT Sprints OFF

    SET IDENTITY_INSERT Stories ON
    INSERT Stories (StoryId, StoryText, SprintId, StoryPoints, Ordinal) VALUES
        (1, 'Story 1', 1, 1, 1),
        (2, 'Story 2', 1, 2, 2),
        (3, 'Story 3', 2, 3, 1),
        (4, 'Story 4', 2, 5, 2),
        (5, 'Story 5', 3, 8, 1),
        (6, 'Story 6', 3, 13, 2),
        (7, 'Story 7', 4, 20, 1),
        (8, 'Story 8', 4, 100, 2)
    SET IDENTITY_INSERT Stories OFF

    SET IDENTITY_INSERT Tasks ON
    INSERT Tasks (TaskId, StoryId, TaskText, [State], EstimatedDevHours, EstimatedQsHours, DevHoursBurned, QsHoursBurned, RemainingDevHours, RemainingQsHours, Ordinal) VALUES
        (1, 1, 'Task 1', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 1),
        (2, 1, 'Task 2', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 2),
        (3, 2, 'Task 3', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 1),
        (4, 2, 'Task 4', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 2),
        (5, 3, 'Task 5', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 1),
        (6, 3, 'Task 6', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 2),
        (7, 4, 'Task 7', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 1),
        (8, 4, 'Task 8', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 2),
        (9, 5, 'Task 9', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 1),
        (10, 5, 'Task 10', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 2),
        (11, 6, 'Task 11', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 1),
        (12, 6, 'Task 12', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 2),
        (13, 7, 'Task 13', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 1),
        (14, 7, 'Task 14', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 2),
        (15, 8, 'Task 15', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 1),
        (16, 8, 'Task 16', 'ReadyForDev', 1, 1, 1, 1, 1, 1, 2)
    SET IDENTITY_INSERT Tasks OFF

    INSERT SprintDays (SprintId, [Day]) VALUES
        (1, '2015-01-01'),
        (1, '2015-01-02'),
        (2, '2015-02-01'),
        (2, '2015-02-02')

    SET IDENTITY_INSERT Resources ON
    INSERT Resources (ResourceId, SprintId, UserName, DevPercentage, QsPercentage, [Days], TotalDevHours, TotalQsHours, TotalHours) VALUES
        (1, 1, 'User1', 25, 0, 4, 4, 0, 4),
        (2, 1, 'User2', 0, 50, 8, 0, 16, 16),
        (3, 2, 'User1', 25, 0, 4, 4, 0, 4),
        (4, 1, 'User2', 0, 50, 8, 0, 16, 16)
    SET IDENTITY_INSERT Resources OFF

    INSERT Assignments VALUES
        ('User1', 1),
        ('User2', 2)

    --SET IDENTITY_INSERT WorkLogs ON
    --INSERT WorkLogs () VALUES ()
    --SET IDENTITY_INSERT WorkLogs OFF

    --SET IDENTITY_INSERT Notes ON
    --INSERT Notes (NoteId, TaskId, UserName, Note, [Timestamp]) VALUES ()
    --SET IDENTITY_INSERT Notes OFF

RETURN 0
