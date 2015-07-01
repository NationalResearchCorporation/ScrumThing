
CREATE PROCEDURE RemoveStory
    @StoryId INT
AS
BEGIN
    
    BEGIN TRANSACTION

    DECLARE @SprintId INT = (SELECT SprintId
                             FROM Stories
                             WHERE StoryId = @StoryId);

    DELETE FROM Assignments
    WHERE TaskId IN (SELECT TaskId FROM Tasks WHERE StoryId = @StoryId)

    DELETE FROM Notes
    WHERE TaskId IN (SELECT TaskId FROM Tasks WHERE StoryId = @StoryId)

    DELETE FROM WorkLogs
    WHERE TaskId IN (SELECT TaskId FROM Tasks WHERE StoryId = @StoryId)

    DELETE FROM Tasks
    WHERE TaskId IN (SELECT TaskId FROM Tasks WHERE StoryId = @StoryId)

    DELETE FROM Stories
    WHERE StoryId = @StoryId

    EXEC FixOrdinals @SprintId;

    COMMIT

END
