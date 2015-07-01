
-- Calling this sproc will remove any "holes" in Ordinals left by removing a Story/Task
CREATE PROCEDURE FixOrdinals
    -- When passing using the default NULL value for that, we take that to mean "Update all Sprints/Stories" as appropriate
    @SprintId INT = NULL,
    @StoryId INT = NULL
AS

    BEGIN TRANSACTION

    UPDATE s
    SET Ordinal = DefaultOrdinal
    FROM (SELECT
            SprintId,
            Ordinal,
            DefaultOrdinal = ROW_NUMBER() OVER (PARTITION BY SprintID ORDER BY Ordinal, StoryId)
          FROM Stories) s
    WHERE s.SprintId = @SprintId OR @SprintId IS NULL;

    UPDATE tasksToUpdate
    SET Ordinal = DefaultOrdinal
    FROM (SELECT
            s.SprintId,
            t.StoryId,
            t.Ordinal,
            DefaultOrdinal = ROW_NUMBER() OVER (PARTITION BY t.StoryId ORDER BY t.Ordinal, TaskId)
          FROM Tasks t
          JOIN Stories s ON t.StoryId = s.StoryId) tasksToUpdate
    WHERE 
        (SprintId = @SprintId OR @SprintId IS NULL)
        AND
        (StoryId = @StoryId OR @StoryId IS NULL);

    COMMIT
          
RETURN 0
