
CREATE PROCEDURE MoveTask
    @TaskId INT,
    @NewStoryId INT,
    @NewOrdinal INT
AS
BEGIN

    BEGIN TRANSACTION

    DECLARE @SprintId INT;
    DECLARE @OldStoryId INT;
    DECLARE @OldOrdinal INT;
    
    SELECT
        @SprintId = s.SprintId,
        @OldStoryId = t.StoryId,
        @OldOrdinal = t.Ordinal
    FROM Tasks t
    JOIN Stories s ON t.StoryId = s.StoryId
    WHERE TaskId = @TaskId;

    IF @NewStoryId != @OldStoryId  BEGIN
        -- If we are moving between stories, we'll begin by moving this task to the end of the new story, and repairing the old story
        SET @OldOrdinal = (SELECT COALESCE(COUNT(*) + 1, 1) FROM Tasks WHERE StoryId = @NewStoryId);

        UPDATE Tasks
        SET StoryId = @NewStoryId,
            Ordinal = @OldOrdinal
        WHERE TaskId = @TaskId;

        -- Remove the gap that created in the old story
        EXEC FixOrdinals @SprintId, @OldStoryId;

        -- Now, we can pretend it's just like moving inside a single story
    END

    IF @NewOrdinal < @OldOrdinal BEGIN
        -- We'll be moving this task up, so move the relevant stories down a position
        UPDATE Tasks
        SET Ordinal = Ordinal + 1
        WHERE StoryId = @NewStoryId AND Ordinal >= @NewOrdinal AND Ordinal <= @OldOrdinal;
    END

    IF @NewOrdinal > @OldOrdinal BEGIN
        -- We'll be moving this task down, so move the relevant stories up a position
        UPDATE Tasks
        SET Ordinal = Ordinal - 1
        WHERE StoryId = @NewStoryId AND Ordinal >= @OldOrdinal AND Ordinal <= @NewOrdinal;
    END

    -- And then move this task into the new position
    UPDATE Tasks
    SET Ordinal = @NewOrdinal
    WHERE TaskId = @TaskId;

    COMMIT

    -- Return all updated information so the front end doesn't have to replicate it
    SELECT TaskId, Ordinal
    FROM Tasks
    WHERE StoryId = @NewStoryId OR StoryId = @OldStoryId;
END
