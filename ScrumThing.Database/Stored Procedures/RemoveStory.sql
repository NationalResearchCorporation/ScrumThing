
CREATE PROCEDURE RemoveStory
    @StoryId INT
AS
BEGIN
    
    BEGIN TRANSACTION

    DECLARE @SprintId INT = (SELECT SprintId
                             FROM Stories
                             WHERE StoryId = @StoryId);

    DELETE FROM Assignments
    WHERE TaskId IN (SELECT TaskId FROM Tasks WHERE StoryId = @StoryId);

    DELETE FROM Notes
    WHERE TaskId IN (SELECT TaskId FROM Tasks WHERE StoryId = @StoryId);

    DELETE FROM WorkLogs
    WHERE TaskId IN (SELECT TaskId FROM Tasks WHERE StoryId = @StoryId);

    DELETE FROM Tasks
    WHERE TaskId IN (SELECT TaskId FROM Tasks WHERE StoryId = @StoryId);

    DELETE FROM Stories
    WHERE StoryId = @StoryId;

    EXEC FixOrdinals @SprintId;

    -- Return the latest StoryId, Ordinal pairs so the front end can stay up to date
    SELECT StoryId, Ordinal
    FROM Stories
    WHERE SprintId = @SprintId;

    COMMIT

END
