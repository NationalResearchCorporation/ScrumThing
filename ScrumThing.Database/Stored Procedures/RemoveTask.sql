
CREATE PROCEDURE RemoveTask
    @TaskId INT
AS
BEGIN

    BEGIN TRANSACTION

    DECLARE @SprintId INT;
    DECLARE @StoryId INT;

    SELECT
        @SprintId = s.SprintId,
        @StoryId = t.StoryId
    FROM Tasks t
    JOIN Stories s ON t.StoryId = s.StoryId
    WHERE TaskId = @TaskId;

    DELETE FROM Assignments
    WHERE TaskId = @TaskId;

    DELETE FROM Notes
    WHERE TaskId = @TaskId;

    DELETE FROM WorkLogs
    WHERE TaskId = @TaskId;

    DELETE FROM Tasks
    WHERE TaskId = @TaskId;

    EXEC FixOrdinals @SprintId, @StoryId;

    -- Return the latest TaskId, Ordinal pairs so the front end can stay up to date
    SELECT t.TaskId, t.Ordinal
    FROM Tasks t
    JOIN Stories s ON t.StoryId = s.StoryId
    WHERE s.SprintId = @SprintId;

    COMMIT
END
